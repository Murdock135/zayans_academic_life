---
created: 2026-10-28
status: implementation-guide
project: "[[Work/Agentic System For epidemiology/Home]]"
---
# Inspecting executor workers with LangGraph streaming

Enable nested streaming on the outer SPARQ graph to inspect the agents created inside `executor_node`. Keep root state snapshots separate from nested worker events so the final response extraction continues to work.

This is an implementation guide for the current v1 code, not a record of an implemented repository change. The guide was requested in the Codex discussion about inspecting workers inside the executor on 2026-10-28. It belongs to shared SPARQ infrastructure rather than a manuscript.

## What was read and verified

Official documentation read directly for this discussion:

- [LangGraph streaming](https://docs.langchain.com/oss/python/langgraph/streaming): Stream output format (v2), Stream modes, Graph state, LLM tokens, Subgraph outputs, Debug, and Multiple modes at once.
- [LangGraph subgraphs](https://docs.langchain.com/oss/python/langgraph/use-subgraphs#call-a-subgraph-inside-a-node): Define subgraph communication, Call a subgraph inside a node, and Add a subgraph as a node.

Repository source inspected: `src/sparq/architectures/v1/system.py`, the worker construction/invocation and parallel scheduling in `src/sparq/architectures/v1/nodes/executor.py`, the agent call in `src/sparq/architectures/v1/nodes/aggregator.py`, and JSON serialization in `src/sparq/utils/helpers.py`.

The local environment was checked: LangGraph **1.2.8**, LangChain **1.3.11**, Python **3.13**. A synthetic local test using actual `create_agent()` workers and a fake model passed; details appear below. No paid model call or full SPARQ execution was run. The implementation snippets below are proposed adaptations of that verified streaming pattern.

## Why the workers count as nested graphs

`create_agent()` returns a compiled graph. Both patterns support nested execution:

1. Register the compiled agent directly: `builder.add_node("worker", agent)`.
2. Register a function that calls the compiled agent: `await agent.ainvoke(...)` inside that function or its helpers.

SPARQ uses the second pattern:

```text
outer graph
  executor_node
    asyncio.gather(...)
      execute_single_step_worker(step 1)
        create_agent(...).ainvoke(...)
      execute_single_step_worker(step 2)
        create_agent(...).ainvoke(...)
```

The agents can emit nested runtime events without being registered individually through `add_node()`. This does not guarantee that dynamically created workers appear in a static graph drawing.

## 1. Replace the outer streaming loop

File: `src/sparq/architectures/v1/system.py`, method: `Agentic_system.run()`.

Currently, the loop uses `stream_mode="values"`. Its `state_values` variable is used later by:

```python
final_message = state_values["messages"][-1]
```

Replace only the existing `async for` loop and its body with the following. Keep it inside the existing `try` block, leaving the surrounding setup, cleanup, and final response extraction in place:

```python
async for chunk in self.graph.astream(
    input=input_data,
    config={"configurable": {"run_id": run_id}},
    stream_mode=["values", "updates"],
    subgraphs=True,
    version="v2",
):
    namespace = chunk["ns"]
    mode = chunk["type"]
    data = chunk["data"]

    if mode == "values" and not namespace:
        # Only outer graph state can supply the final SPARQ response.
        state_values = data
        logger.debug(state_values)
        write_json(run_dir, "trace.json", state_values)

    elif mode == "updates" and namespace:
        logger.debug(
            "Nested graph update | namespace={} | data={}",
            namespace,
            data,
        )
```

This keeps `trace.json` as the latest outer state snapshot and emits the inner model/tool updates through the logger. DEBUG messages require a log sink configured to include DEBUG output. Use the persistent event log in the next section if these details need to be available after the run.

The namespace filter is essential. A worker's `values` event contains that worker's state; assigning it to `state_values` could replace the outer state with an agent conversation or structured response.

## 2. Read the nested updates

With `version="v2"`, every event has the same envelope:

```python
{
    "type": "updates",
    "ns": ("executor:<task-id>",),
    "data": {"model": {"messages": [...]}}
}
```

| Field or update | Meaning |
| --- | --- |
| Empty `ns` | An event from the outer graph. |
| Nonempty `ns` | An event from a nested graph invocation. |
| `model` update | Model output, including tool-call requests when present. |
| `tools` update | Tool response messages. |
| Other internal node names | Additional agent steps, for example middleware. |

Nested aggregator events can also appear. To display only executor descendants, add a filter to the nested-update branch:

```python
if namespace[0].startswith("executor:"):
    logger.debug("Executor worker update | namespace={} | data={}", namespace, data)
```

Parallel worker events interleave. Group them by the complete namespace tuple. Do not treat the order of arrival, or a namespace suffix such as `"1"`, as a plan-step ID. Namespaces are runtime identifiers and can differ across invocations and retries.

## 3. Optionally retain an event history

`write_json()` overwrites its destination. Calling it repeatedly with the same event filename would retain only the last event.

For a chronological record, add `import json` to `system.py` and open a JSON Lines file around the replacement loop. `pydantic_core` is already imported in this module:

```python
with (run_dir / "graph_events.jsonl").open("a", encoding="utf-8") as event_file:
    async for chunk in self.graph.astream(
        input=input_data,
        config={"configurable": {"run_id": run_id}},
        stream_mode=["values", "updates"],
        subgraphs=True,
        version="v2",
    ):
        record = {"run_id": run_id, **chunk}
        event_file.write(
            json.dumps(pydantic_core.to_jsonable_python(record, by_alias=False))
            + "\n"
        )
        event_file.flush()

        if chunk["type"] == "values" and not chunk["ns"]:
            state_values = chunk["data"]
            logger.debug(state_values)
            write_json(run_dir, "trace.json", state_values)
```

Use this as an alternative to the loop in section 1, in the same `try` block. It retains every selected event, including nested state snapshots and updates. The serializer follows the existing `write_json()` approach and handles the LangChain messages and nested Pydantic objects used here. The file is appended to if the same run directory is reused; each record carries `run_id`.

Full nested snapshots repeat message history and can make the file large. For a smaller record, write only `chunk["type"] == "updates"` events while continuing to consume root `values` for the final response.

## 4. Optionally label workers and stream model output

The worker already has a graph name, `name=f"Agent {step.id}"`. For explicit plan-step labels in invocation metadata and traces, update the existing worker call in `execute_single_step_worker()`:

```python
response = await agent.ainvoke(
    agent_input,
    config={
        "recursion_limit": llm_config.recursion_limit,
        "tags": [f"worker-step-{step.id}"],
        "metadata": {"step_id": step.id},
    },
)
result: StepResult = response["structured_response"]
```

Keep the existing `try`/`except` and result handling around this call. These labels do not rename namespaces or insert `step_id` into the `updates` envelope.

To inspect model output chunks too, use:

```python
stream_mode=["values", "updates", "messages"]
```

Add a branch inside the streaming loop:

```python
elif chunk["type"] == "messages":
    message_chunk, metadata = chunk["data"]
    logger.debug(
        "Model output | namespace={} | step_id={} | content={}",
        chunk["ns"],
        metadata.get("step_id"),
        message_chunk.content,
    )
```

Confirm the actual provider's metadata before relying on `step_id` as a downstream join key. Model-output chunks are useful for live inspection; completed model/tool `updates` are easier for following the tool loop. Provider streaming behavior has not been tested in this guide.

## 5. Validate the change

First check the following with a small local test, then with one representative SPARQ query:

1. Two workers invoked through `asyncio.gather()` each produce nested events.
2. Each tool call has a model request and a tool result in the retained updates.
3. Worker events remain distinguishable by full namespace even when interleaved.
4. The last saved `state_values` is a root snapshot and contains the final assistant response.
5. The existing final-response extraction and `SystemOutput` construction still succeed.
6. If event logging is enabled, every JSONL line parses and earlier events remain present.

### Local verification already completed

On 2026-10-28, a synthetic test in SPARQ's `.venv` created two `create_agent()` instances dynamically inside an executor helper. Each used a fake model that requested a local `echo` tool and then returned a final message. Both were invoked with `ainvoke()` through `asyncio.gather()`.

The outer graph streamed `values` and `updates` with `subgraphs=True, version="v2"`. Assertions passed for:

- Four nested `model` updates: two requests and two final messages.
- Two nested `tools` updates.
- Two distinct worker namespaces.
- Final outer state exactly `{"results": ["done-1", "done-2"]}`.

Observed namespace shapes were `("executor:<id>",)` and `("executor:<id>", "1")`. They demonstrate distinct invocations, not stable step labels. The test used real LangChain agent construction, but did not exercise SPARQ's `StepResult` response format, TodoList middleware, production tools, JSONL persistence, or model-provider streaming.

## When to use other inspection modes

Use `debug` for additional graph execution diagnostics. Checkpoint events require a checkpointer; the current outer graph uses `compile()` without one. Adding persistence is a separate change from exposing worker updates.

Streaming shows runtime state and events. To inspect the complete constructed system prompt, available tools, model configuration, and middleware, inspect the worker construction in `execute_single_step_worker()` as well. These details are not all automatically included in the selected stream modes.
