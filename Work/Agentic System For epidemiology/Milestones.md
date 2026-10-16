> [!milestones] Roadmap
> 1. [ ] Complete the initial design
> 2. [ ] Refactor & incorporate good software-design principles
> 3. [ ] Preliminary checks; run system
> 4. [ ] Design improvements, batch evals and writing
> 5. [ ] Publish paper (END)

## Milestone 4-Design improvments, batch evals and writing

### Design improvements
- [ ] #task Give the executor two things
	- [ ] #task a skill that describes an execution workflow
	- [ ] #task The index.json
	- [ ] #task image understanding tool
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
