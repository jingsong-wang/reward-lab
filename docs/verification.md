# Verification — 2026-09-21

- Five automated tests pass, including learned baseline/repaired contrasts for all three tasks at seeds 7, 29, and 103 (18 training runs).
- All browser ES modules pass Node syntax checking.
- Independent review found no P1/P2 issues; 135 extra custom reward/seed checks found no false outcome labels.
- Browser Worker training and evaluation verified for all three tasks, baseline and repair. Pickup baseline: 80 steps, 40 pickups, 113.6 reward, no disposal. Repaired: 8 steps, one pickup, disposed.
- Delivery baseline broke the plant; repaired delivery preserved it. Hiding baseline put rubbish under rug; repaired strategy disposed in bin.
- Reward edits disable old exports and clear current result. PNG export preview decoded at 1200×1100; JSON download anchor has correct filename.
- Desktop layout and 390×844 responsive view inspected. Narrow document client/scroll widths both 375px (scrollbar excluded). Playback visibly advanced to step 37 with current state metrics.
- No browser error logs during tested flows. Training performance on the development desktop was approximately 0.1–0.2 seconds for tested configurations; not a device-independent guarantee.


## Creative workshop update

- Node tests cover scene validation, disposal without termination, one-time plant effects, reward tile entry, walls, seed reproducibility and learned pickup loops.
- Browser: painted wall, changed pad reward to +5, trained 6,000 episodes, observed policy repeatedly entering reward tile; no console errors.
- Scene JSON import confirmed via file chooser, download action confirmed.
- Mobile 390×844: document client width 375, scroll width 375; visual inspection of responsive controls and action counters.
- Independent review identified final-frame interpolation and non-string tile validation issues; both fixed, malformed tile regression added.
