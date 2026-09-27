1. Incorporate a way to detect possible overlaps within the sub-steps of the steps of each plan. Perhaps have a critic for the planner.
2. Use deliverables. Each Step should have deliverables. The deliverables can be used by the planner (when it's thinking) to better decide dependent steps. Furthermore, this will help the executor agent decide on completion criteria.
3. Introduce LSP features into the python repl so that worker agent can communicate with LSP and avoid *simple* errors instead of fix errors afterward
4. Track token counts everywhere and implement **context engineering** (truncation, summarization, etc)
5. - The datasets cannot be set by the planner in the Plan object because then, the executor doesn't have autonomy in case it wants to analyze a different dataset. We need a way to dynamically change the plan with each iteration of the executor.
6. How to evaluate the system
	- Create a dataset like that in [AgentRewardBench](https://arxiv.org/pdf/2504.08942)
	- We then let the system run again such that it follows the expert annotations. Then we use semantic similarity or some other measure to check how different the initial generation is (from the regeneration)
	- We can then use RLHF to make the system more like an epidemiologist.
	- What if we use Alvey's protoforms and then use Dempster Shafer Theory to study assumptions (read below)
7. Ask the system to produce a list of possible assumptions, rank ordered. We should probe the system to obtain a quantified 'amount' of belief in those assumptions.
8. We can use the `wants` and/or `misc` to signal that there is more to be done to complete the current step. Then we can invoke a helper `llm` that does this.