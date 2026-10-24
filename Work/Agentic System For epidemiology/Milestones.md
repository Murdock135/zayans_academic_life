
> [!milestones] Roadmap
> 1. [x] Complete the initial design  [completion:: 2026-10-19]
> 2. [x] Refactor & incorporate good software-design principles  [completion:: 2026-10-19]
> 3. [x] Preliminary checks; run system  [completion:: 2026-10-19]
> 4. [ ] Design improvements, batch evals and writing
> 5. [ ] Ablation
> 6. [ ] Support for multi-turn conversations
> 7. [ ] Publish paper (END)

## Milestone 4-Design improvments, batch evals and writing

### Design 
- [x] #task Put artifact numbers into the artifact index  [completion:: 2026-10-23]
- [ ] #task Make metadata output better
	- [ ] #task Move printing of settings into 
	- [ ] #task Use rich tables
	- [ ] #task Hide API. use `xxxx` or something
- [ ] #task Give the planner the ability to do a literature review
- [ ] #task Give the executor two things #next 
	- [ ] #task a skill that describes an execution workflow
	- [x] #task The index.json  [completion:: 2026-10-19]
	- [ ] #task image understanding tool
		- This should use a VLM and return an image interpretation text
- [ ] #task Make the aggregator a report-writing node
	- [ ] #task Give the aggregator the following tools
		- [ ] image understanding
		- [ ] search and list artifacts
	- [x] Find MCP  [completion:: 2026-10-19]
	- [ ] Just use deep-agents
### Batch eval
- [ ] #task Extract token-in/token-out info (1 week)


> [!abstract]- Other work
> ### Optional housekeeping
> - [ ] #task Fix DevOps stuff
> 	- [ ] #task fix dockerfile
> 	- [ ] #task fix run scripts
>
> ### Future work
> - [ ] #task Planner supervisor
> 	- [ ] #task Basic plan review loop
> - [ ] #task Executor supervisor
> - [ ] #task Weather calling tool
>
> ### Misc
> - [ ] #task Implement lazy-updating bedrock model list and cross-checking with config files.
> - [ ] #task Add a web search node (tavily + pubmed)

# Archived

- [x] #task Review code  [completion:: 2026-09-30] 🔒 [[2026-09-30]] 🕸️ Milestones > Milestone 1- Batch eval
- [x] #task Merge `feat/loop_batch_eval` with `main`  [completion:: 2026-09-30] 🔒 [[2026-10-07]] 🕸️ Milestones > Milestone 1- Batch eval
- [x] #task Create node `interim_organizer`  [completion:: 2026-10-16] 🔒 [[2026-10-16]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design improvements
	- It should be coupled with the executor node. It should have knowledge of the current step id. If the step is the last step (you can determine this by checking plan length), then move to the next node
- [x] #task Create a type for index.json  [completion:: 2026-10-16] 🔒 [[2026-10-16]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design improvements
- [x] #task Create an `organizer_node`. This should be invoked  [completion:: 2026-10-16] 🔒 [[2026-10-16]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design improvements
	- After each execution step
	- After aggregator is done doing its work
	- It should also have `from_successful` and `from_failed`
