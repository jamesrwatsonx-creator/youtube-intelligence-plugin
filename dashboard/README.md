# Pulse Dashboard

Pulse is the visual intelligence surface for the YouTube Intelligence Plugin.

## Product boundary

- **Pulse**: discover markets, niches, creators, breakout videos, creative patterns, and monetization opportunities.
- **YouTube Intelligence Plugin**: data acquisition, scoring, semantic analysis, temporal observation, and evidence generation.
- **OpenCut**: deterministic editing and timeline assembly.
- **Higgsfield**: generative video/image/graphic/camera-motion asset creation.
- **Hermes / voice assistant**: conversational control and explanation across every screen and metric.

## Primary entry points

Pulse must let the user start at the correct stage instead of forcing one workflow:

1. **Start from money** — discover the best emerging niche first, then progress through winning content and production.
2. **Start from business** — skip niche discovery; research the strongest-performing commercials/social content for the business category, create a CreativeSpec, then produce.
3. **Start from topic** — analyze a known niche/topic/creator and identify the best-performing formats and why they work.

## Core niche metrics

The niche overview must expose, explain, and eventually evidence:

- Opportunity Score
- Growth / momentum
- Competition / saturation
- Breakout frequency
- Small-channel wins
- Monetization potential
- Views/hour and acceleration
- Median outlier multiplier
- Creator-count growth
- Replication across independent creators
- Shorts vs long-form fit
- Commercial intent
- Evergreen durability
- Confidence / provenance

Every metric should be explainable from the voice assistant and contextual Help UI.

## UX model

The dashboard follows the proven analytical pattern used by platforms such as Semrush: a global search/launch point, compact summary metrics, filters, trend visualizations, comparison views, ranked tables, and progressive drill-down from every high-level widget.

### Main views

- Discover
- Niches
- Videos
- Channels
- Creative DNA
- Monetization
- Watchlists

### Niche drill-down

Selecting a niche should eventually expose:

- momentum over time
- breakout frequency
- growth vs competition map
- topic clusters
- winning creators
- winning videos
- small-channel breakout rate
- creative-feature distribution
- monetization signals
- recommended next action

### Winning-video diagnosis

For each selected video Pulse should eventually explain:

- channel-relative outlier score
- views/hour and acceleration
- video age
- channel size
- baseline sample size
- title structure
- first 0–3 seconds
- spoken hook
- opening text
- visual style
- camera movement
- shot duration / cut rate
- diagrams / graphics / B-roll
- typography characteristics
- caption treatment
- music / SFX / voice
- CTA
- metadata patterns
- replication evidence
- confidence level

## Help behavior

The Help control is intentionally transient.

- Desktop: hovering or clicking Help opens a contextual flyout.
- Moving the pointer off both the Help trigger and flyout dismisses it immediately.
- Touch: tapping toggles the flyout.
- It explains the current screen and its metrics in plain English.
- It provides workflow shortcuts such as **Find a profitable niche**, **Create for a business**, and **Research a topic I know**.
- The full voice assistant remains the deeper explanation layer when the user wants to ask follow-up questions about anything visible on screen.

## Visualization stack

Initial UI stack:

- React + TypeScript + Vite
- Apache ECharts / `echarts-for-react` for dense analytical views, scatter/bubble maps, heatmaps, distributions, temporal curves and advanced comparisons
- Recharts for simpler product-native charts
- Lucide for UI iconography

Charts are a presentation layer. The durable value is the evidence and scoring model beneath them.

## Run locally

```bash
cd dashboard
npm install
npm run dev
```

The current dataset is mocked to establish the interaction model. The next frontend phase replaces mock values with API responses from the Python intelligence engine.

## Production loop

```text
DISCOVER
  -> choose niche / business / topic
UNDERSTAND
  -> diagnose videos and creative DNA
SPECIFY
  -> create evidence-backed CreativeSpec
GENERATE
  -> Higgsfield assets
EDIT
  -> OpenCut timeline
PUBLISH
MEASURE
  -> observations return to Pulse
LEARN
```
