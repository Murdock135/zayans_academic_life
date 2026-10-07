# Milestones

## Milestone 1 — Implement pipeline
### Milestone 1.1- Implement essential componenents
Essential components:
1. Frame of Discernment extractor
2. Focal set extractor
3. BPA assigner
4. Combiner
### Milestone 1.2- Robustness improvements
- [ ] #task Implement retry logic for each component. You can use the `_validate_()` functions as the anchor for the retries
- [ ] #task In the system prompt of the data generator, introduce another concept- a matrix that indicates which models have been given a piece of information $\lambda$ by the human. Each row represents the 'existence' vector for a piece of evidence. For example $\lambda=(1,0,1)^T$ means evidence $\lambda$ has been given to model 1 and 3 but not 0. This will be produced by the LLM in the data sample.
### Milestone 1.3- LLM as a judge
Reference image:
![[Pasted image 20261001144234.png]]

- [ ] #task Plan
- [ ] #task Outline components

### Milestone 1.4 — Implement combination logic
- [ ] #task Create component base class #next
- [ ] #task Create an implementation class
- [ ] #task Create a `combiners.py` to store all combination functions

## Milestone 3- Make eval list
TBD

## Milestone 4- Paper

## Misc
- [x] #task Brainstorm the ANFIS-CREDAL set informed architecture you were thinking about with ChatGPT #next  [completion:: 2026-10-07]
- [ ] #task Ask Data generator to create the Zadeh example as well as one of the samples #next

# Archived

- [x] #task Come up with possible frames of discernments, write about it and meet Dr. A to brainstorm ✅ 2025-11-06 🔒 [[2025-11-30]] 🕸️ Tasks
- [x] #task Create Project structure ✅ 2025-11-10 🔒 [[2025-11-30]] 🕸️ Tasks
- [x] #task Create the project structure, the registry pattern, one SDK integration ✅ 2025-11-30 🔒 [[2025-11-30]] 🕸️ Tasks
	- [x] #read Python tutorial on classes (2 hours) ✅ 2025-11-30
	- [ ] #read 
- [x] #task code the first hypothesis extractor ✅ 2025-11-30 🔒 [[2025-11-30]] 🕸️ Tasks
- [x] #task Build a synthetic data generator that uses an LLM to create the dataset. This would allow us to control the amount of conflict that each model will have. For example, perhaps M1 and M2 align and together contradict with M3. ✅ 2026-02-11 🔒 [[2026-02-12]] 🕸️ Tasks
- [x] #task Rewrite the system prompt ✅ 2026-02-12 🔒 [[2026-02-12]] 🕸️ Tasks
<<<<<<< HEAD
- [x] #task Create an output schema for the UoD extractor ✅ 2026-08-21 🔒 [[2026-08-24]] 🕸️ Tasks
- [x] #task Create an output schema for the Frame of Discernment extractor. ✅ 2026-08-21 🔒 [[2026-08-24]] 🕸️ Tasks
- [x] #task Implement a factory pattern for the components (*extractor, data_generator, bpa_assigner, etc*) by having a function `configure` ✅ 2026-08-21 🔒 [[2026-08-24]] 🕸️ Tasks
	- [x] #task the base class should indicate the `configure` contract ✅ 2026-08-21
	- [x] #task the component should implement `configure` ✅ 2026-08-24
- [x] #task Use the google-genai idiomatic way of setting system prompts, inference properties e.g. top-p, temp. see https://googleapis.github.io/python-genai/#system-instructions-and-other-configs ✅ 2026-08-21 🔒 [[2026-08-24]] 🕸️ Tasks
- [x] #task Change the namings in the `Extractor` Module to turn it into a single-`fod` (frame of discernment) module that is responsible for extracting frame of discernment. ✅ 2026-08-24 🔒 [[2026-08-24]] 🕸️ Tasks
	- [x] In `types.py`
		- [x] `ExtractorOutput -> FodOutput`
	- [x] In `default_config.toml`
		- [x] `hypothesis_extractor -> fod_extractor`
- [x] #task Create the focal_set extractor ✅ 2026-08-24 🔒 [[2026-09-09]] 🕸️ Tasks
- [x] #task Fix `LanguageModelFocalSetCreator._validate_result()` ✅ 2026-09-09 🔒 [[2026-09-09]] 🕸️ Coding and Reading
=======
- [x] #task Create an output schema for the UoD extractor ✅ 2026-08-21 🔒 [[2026-08-25]] 🕸️ Tasks
- [x] #task Create an output schema for the Frame of Discernment extractor. ✅ 2026-08-21 🔒 [[2026-08-25]] 🕸️ Tasks
- [x] #task Implement a factory pattern for the components (*extractor, data_generator, bpa_assigner, etc*) by having a function `configure` ✅ 2026-08-21 🔒 [[2026-08-25]] 🕸️ Tasks
	- [x] #task the base class should indicate the `configure` contract ✅ 2026-08-21
	- [ ] #task the component should implement `configure`
- [x] #task Use the google-genai idiomatic way of setting system prompts, inference properties e.g. top-p, temp. see https://googleapis.github.io/python-genai/#system-instructions-and-other-configs ✅ 2026-08-21 🔒 [[2026-08-25]] 🕸️ Tasks
>>>>>>> a9c58f1 (.)