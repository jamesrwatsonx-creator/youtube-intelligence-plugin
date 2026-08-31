# YouTube Intelligence Plugin

A self-hosted, agent-native YouTube research and creative-intelligence plugin for Hermes.

Its job is to move from **what is winning on YouTube** to **why it is winning** to **what should be created next**.

The plugin discovers outlier videos and small-channel breakouts, measures velocity and channel-relative performance, analyzes transcripts and creative patterns, clusters repeatable formats, scores niche opportunity, maintains watchlists, and ultimately produces an evidence-backed `CreativeSpec` that can be handed to generation/editing systems such as Higgsfield or OpenCut.

Hermes provides the conversational interface. This repository provides the specialized machinery.

## What This Plugin Does

The plugin is designed as a full YouTube intelligence pipeline:

```text
DISCOVER
Find niches, channels, videos, Shorts, competitors, and emerging topics

    ↓

MEASURE
Calculate channel baselines, outlier multipliers, views/day, velocity,
replication, small-channel breakout signals, and confidence

    ↓

UNDERSTAND
Analyze transcripts, hooks, titles, metadata, topics, semantic similarity,
creative structures, visual patterns, pacing, captions, and format clusters

    ↓

REMEMBER
Store timestamped channel/video observations, historical performance,
watchlists, predictions, and prediction outcomes

    ↓

RECOMMEND
Rank niches, breakout ideas, repeatable formats, and content opportunities

    ↓

SPECIFY
Produce a structured CreativeSpec containing the recommended hook, script,
storyboard, shot list, visuals, camera direction, typography, metadata,
editing instructions, and generation prompts

    ↓

GENERATE / EDIT
Optional downstream handoff to Higgsfield, OpenCut, or another creation stack
```

The long-term goal is not merely to answer "what went viral?" It is to detect repeatable creative patterns and eventually identify content entering a breakout regime before it is obvious from total views alone.

## Why Use This Plugin

### 1. Hermes becomes the interface

You do not need a separate dashboard for every research task. Ask Hermes things such as:

- "Find AI-agent Shorts from channels under 25K subscribers that are at least 8x above baseline."
- "Show me breakout formats being replicated by multiple small creators."
- "Analyze why these five Shorts are working."
- "Turn the strongest opportunity into a 35-second video plan."
- "Watch this niche and surface new breakout patterns."

### 2. Self-hosted intelligence and data ownership

Commercial tools expose their own databases and scoring systems. This plugin is designed so your observations, watchlists, scoring history, embeddings, predictions, and eventually creative-performance dataset are yours.

The compounding asset is not the scraper. It is the historical observation graph:

```text
creator × video × topic × format × transcript × creative features × performance × time
```

### 3. Explainable scoring

The engine should never return only a black-box score. Every result should expose the evidence behind it: channel baseline, multiplier, views/day, subscriber count, replication, age, confidence, and provenance.

### 4. Small-channel breakout detection

A 500K-view video on a channel averaging 2M views is not necessarily interesting. A 500K-view video on a channel normally receiving 40K views may indicate a genuine idea or format breakout.

The system therefore emphasizes channel-relative performance and small-channel success rather than raw view counts alone.

### 5. Temporal intelligence

Repeated observations allow the plugin to measure not just totals but trajectory:

- view velocity
- acceleration / deceleration
- breakout timing
- viral half-life
- persistence
- prediction accuracy

This creates the foundation for detecting what is becoming important, not only what already became important.

### 6. Semantic and creative intelligence

The plugin can move beyond titles and tags by analyzing:

- transcripts
- hooks
- topic similarity
- repeated narrative structures
- opening 0-3 second patterns
- visual/camera conventions
- on-screen text and caption patterns
- pacing and cut structure
- metadata patterns
- calls to action

### 7. Creation-ready output

The intended end product is an evidence-backed `CreativeSpec`, not merely an analytics report.

A CreativeSpec can contain:

```text
Opportunity
Evidence
Concept
0-3 second hook
Script
Storyboard
Shot list
Camera direction
Visual direction
Graphics / diagrams
On-screen text
Typography guidance
Caption guidance
Audio / music direction
Metadata
Title options
Thumbnail / opening-frame direction
Generation prompts
Editing instructions
Confidence and source examples
```

That specification can later be exported for Higgsfield, OpenCut, generic JSON, or other creation systems.

## What Commercial Products Is It Most Similar To?

This is not intended to be a literal clone of any one commercial application. Architecturally, it combines ideas that are usually spread across several products.

### Nexlev-style capability

- niche research
- small-channel opportunity discovery
- outlier analysis
- views-per-hour / velocity thinking
- competitor and channel research

### 1of10-style capability

- outlier discovery
- niche exploration
- Shorts outliers
- similar-title / similar-video research
- idea generation informed by real outlier data
- title and packaging intelligence
- advanced filtering by channel size, recency, views, duration, language, and outlier score

### vidIQ-style capability

- channel-relative outlier scores
- views per hour
- engagement context
- subscriber / channel-size filters
- Shorts vs long-form research
- related-video discovery
- competitive research
- idea generation and metadata assistance

### Viewstats-style capability

- channel and video performance intelligence
- velocity-oriented research
- competitive tracking
- trend and outlier discovery

### Higgsfield / OpenCut handoff

The plugin itself is the research and creative-intelligence layer. It can eventually hand a CreativeSpec downstream to:

- **Higgsfield** for generative visuals, cinematic shots, graphics, image/video generation, and camera-oriented prompting.
- **OpenCut** for deterministic timeline assembly, captions, exact text, font sizing, positioning, cuts, transitions, and final edit control.

In simple terms:

```text
Nexlev / 1of10 / vidIQ / Viewstats
        ↓
research + outlier + niche intelligence

our additional layer
        ↓
semantic + creative + temporal intelligence

Higgsfield / OpenCut
        ↓
generation + editing execution
```

The goal is to make those capabilities callable through Hermes rather than requiring separate research dashboards and manual handoffs.

## Architecture

```text
Hermes
  ↓
Hermes Plugin Adapter
  ↓
YouTube Intelligence Engine
  ├── Discovery
  ├── Scoring
  ├── Transcript / Hook Analysis
  ├── Semantic Search / Clustering
  ├── Creative Intelligence
  ├── Temporal Observations
  ├── Validation / Backtesting
  ├── Watchlists
  └── CreativeSpec Generation
  ↓
Provider Layer
  ├── Official YouTube Data API
  ├── yt-dlp
  ├── Scrapetube fallback
  └── youtube-transcript-api
  ↓
Analytics / Memory
  ├── PostgreSQL + pgvector
  ├── DuckDB
  └── Polars
```

## Source Projects / Integration Strategy

We use upstream projects as dependencies, reference implementations, and selectively ported ideas—not as a pile of merged forks.

| Project / Library | Role | Strategy |
|---|---|---|
| `sentien-labs/youtube-niche` | Niche scoring, breakout logic, small-at-publish methodology, confidence, backtesting, forward validation | Primary reference; selectively port/adapt algorithms with attribution |
| `wassim249/YT-Navigator` | Transcript ingestion, semantic search, PostgreSQL/pgvector patterns | Selective architectural reference |
| `youtube-transcript-api` | Transcript retrieval | Direct dependency |
| `yt-dlp` | Robust metadata/extraction fallback | Direct dependency / provider adapter |
| `scrapetube` | Lightweight unofficial discovery | Fallback adapter only |
| `sentence-transformers` | Embeddings, semantic similarity, clustering support | Direct dependency |
| `pgvector` | Persistent vector similarity in PostgreSQL | Direct dependency |
| `DuckDB` + `Polars` | Fast analytics, snapshots, backtests, Parquet/CSV analysis | Direct dependencies |
| `APScheduler` | Recurring observations and watchlists | Direct dependency |

## Core Hermes Tools

Initial tool contract:

- `youtube_search`
- `youtube_find_outliers`
- `youtube_find_breakouts`
- `youtube_analyze_niche`
- `youtube_analyze_channel`
- `youtube_analyze_video`
- `youtube_get_transcript`
- `youtube_find_similar_content`
- `youtube_create_watchlist`
- `youtube_watch_niche`
- `youtube_create_video_plan` (planned)

## Bundled Skills

- `find-viral-shorts`
- `research-youtube-niche`
- `reverse-engineer-video`
- `competitor-research`
- `content-opportunity`
- `create-video-plan` (planned)

Skills teach Hermes how to combine tools. The plugin exposes the machinery.

## MVP Build Order

V0.1 vertical slices:

1. Search a niche.
2. Discover relevant channels and recent videos.
3. Identify Shorts.
4. Collect channel/video metrics.
5. Calculate channel-relative baselines.
6. Rank outliers and small-channel breakouts.
7. Fetch transcripts.
8. Extract hooks/topics.
9. Cluster similar breakout concepts.
10. Persist watchlists and timestamped observations.
11. Add velocity and temporal scoring.
12. Add creative-feature extraction.
13. Generate an evidence-backed CreativeSpec.
14. Add Higgsfield / OpenCut exporters.

## Key Data Model

```text
channels
videos
video_observations
channel_observations
transcripts
topics
clusters
creative_features
outlier_scores
niche_scores
watchlists
predictions
prediction_results
creative_specs
```

## Outlier Philosophy

Do not rely on a single `video views / channel median views` ratio. A production score should combine:

- absolute views
- views/day
- velocity / acceleration
- channel median and recent median
- subscriber count
- estimated subscriber count at publish when available
- content age
- upload frequency
- Shorts vs long-form
- topic baseline
- channel baseline
- replication across independent creators
- confidence/provenance

Every score should be explainable and should expose its evidence.

## Provider Boundary

All data acquisition lives behind provider interfaces so YouTube frontend/API changes do not infect scoring logic.

```text
ContentPlatform
  └── YouTubeProvider
       ├── OfficialYouTubeAPIProvider
       ├── YtDlpProvider
       ├── ScrapetubeProvider
       └── TranscriptProvider
```

The platform-neutral boundary also leaves room for future TikTok, Instagram, X, and Reddit adapters without rebuilding the core intelligence system.

## Compliance

The official YouTube API provider must enforce applicable YouTube API Services policies, including data retention rules. Raw API-derived metrics should carry provenance and observation timestamps. Retention jobs must be dry-run by default and destructive cleanup must be explicit.

## Development

```bash
./scripts/bootstrap.sh
cp .env.example .env
# add YOUTUBE_API_KEY when using the official API
source .venv/bin/activate
pytest
```

## Repository Layout

```text
youtube_intelligence/        core engine
hermes_plugin/               Hermes-specific adapter
skills/                      bundled Hermes skills
scripts/                     bootstrap and operational scripts
docs/                        architecture and upstream notes
tests/                       offline tests
```

## Status

**Phase 1 / verified foundation.** The environment and smoke tests pass. The next vertical slice is the first live `youtube_find_outliers` implementation.