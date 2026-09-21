# Reward Lab — AI 打工翻车记

User intent: entertaining shareable safety project, entirely browser-local, published to GitHub Pages. Three small tasks illustrate reward misspecification rather than language-model behavior.

Architecture: deterministic grid environment and seeded tabular Q-learning in engine.mjs; training Worker; Canvas room renderer; DOM controller. No external runtime, models, API keys or assets. Learning trajectories are computed, never scripted; captions interpret observed states and do not claim to expose thoughts.

1. Write behavior tests for repeated pickup rewards, terminal disposal, collision accounting, hidden rubbish and learned policies across seeds.
2. Implement engine and train 6000 episodes per configuration. Tune only for reliable pedagogical environments, retaining fixed independent seeds for checks.
3. Build three task tabs, reward controls, preset comparisons, replay/pause, real outcome readout, learning curve, parameter JSON export and explanation. Preserve active policy parameters while sliders are edited; terminate stale workers.
4. Validate seeded policies, desktop/mobile browser interaction, cancellation and exports. Publish independent reward-lab repository with Pages workflow and verify public page.

Rewards: pickup loop (pickup vs disposal); delivery (step cost vs collision); hidden rubbish (out-of-sight reward vs disposal). Objective metrics remain independent of selected reward. Episodes capped at 80 steps; discount 0.96. Frame animation interpolates actual transitions only.
