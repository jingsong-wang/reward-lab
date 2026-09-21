# AI 打工翻车记 · MISREAD LAB 003

[Play](https://jingsong-wang.github.io/reward-lab/)

An interactive reward-misspecification playground. Train a small office robot to clean, deliver, or hide rubbish. Change reward weights and compare reward with actual task outcomes. Entirely browser-local: no API, model download, third-party assets or runtime dependencies.

## Run and test
Node 24: `node server.mjs`, then open http://127.0.0.1:4177/.
`node --test tests/*.test.mjs` tests transitions and learned policy behavior across seeds 7, 29 and 103.

## Learning, not scripted behavior
The agent uses tabular Q-learning over exact program state (position, rubbish position/carried/disposed/hidden, plant damage). Five actions: four movement directions and interact/wait. 6,000 episodes, 80-step cap, learning rate 0.18, discount 0.96, epsilon decays from 0.93 towards 0.08. Seeded PRNG. Zero-exploration greedy evaluation is animated after training. Ties are deterministic during evaluation. Training occurs in a terminable Web Worker.

Baseline and current policy are separately learned under the same seed. They are not a common policy with switched animations. Editing rewards invalidates previous results. Captions summarize actual rollout states, not chain of thought. JSON exports contain parameters and complete trajectories; PNG exports depict the evaluated final state.

Three intentionally small teaching environments:
- Repeated pickup earns reward, while placing rubbish down is allowed; disposal terminates the episode. Repaired preset rewards disposal only.
- Delivering a parcel ends the episode; crossing the plant cell breaks it once. Repaired preset penalizes damage.
- Hiding rubbish under a rug ends the episode but does not count as disposal. Repaired preset removes the hiding reward and increases disposal reward.

Changing reward changes the scale, so absolute returns should not be compared across configurations. The curve is the mean training return per 200 episodes, including exploration, not an accuracy measure. With custom coefficients a policy may loop or fail; this is reported rather than replaced with a hand-written solution. The fixed evaluation start and small deterministic state space do not establish generalization to other environments. Finite episode cutoffs use standard time-limit bootstrapping. No language understanding, perception, physical robot, Jev, or claim of deceptive intent.

## Research context
Independent educational construction inspired by [Specification gaming: the flip side of AI ingenuity (DeepMind)](https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/). These scenarios are not claimed to reproduce a specific published experiment.

## Deployment
GitHub Pages source: GitHub Actions. The included workflow runs tests and JS syntax checks, then deploys `dist/`. The interface shares the MISREAD LAB visual identity. All room graphics are drawn with Canvas; no external fonts or image licenses are required.


## Creative workshop

Open `workshop.html` (fourth destination after the lessons). Arrange a 7×5 room and set eight signed event rewards. One robot and movable item, up to three breakable plants, and any number of walls/bins/rugs/collection points/reward tiles fitting the grid. These bounds keep Q-learning local and lightweight. Each policy trains for 6,000 episodes in a worker and replays 80 steps without a success condition. Save/load validated scene JSON including seed and reward settings. No automatic persistence or backend. See `docs/workshop.md`.
