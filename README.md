# YouTube Intelligence Plugin

A self-contained YouTube/content intelligence engine with a thin Hermes plugin adapter and bundled agent skills.

## Mission

Turn public YouTube data into actionable intelligence: discover small-channel breakouts, measure outliers and velocity, analyze transcripts/hooks, cluster repeatable formats, score niche opportunity, and maintain watchlists that Hermes can query conversationally.

This repository is intentionally **not** coupled to Hermes internally. The intelligence engine is the durable asset; Hermes is one adapter.

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
  ├── Clustering
  ├── Temporal Observations
  ├── Validation / Backtesting
  └── Watchlists
  ↓
Provider Layer
  ├── Official YouTube Data API
  ├── Scrapetube fallback
  └── youtube-transcript-api
  ↓
PostgreSQL / pgvector
```

## Source Projects / Integration Strategy

We use upstream projects as dependencies, reference implementations, and selectively ported ideas—not as a pile of merged forks.

| Project | Role | Strategy |
|---|---|---|
| `sentien-labs/youtube-niche` | Niche scoring, breakout logic, confidence, backtesting, forward validation | Primary reference; selectively port/adapt algorithms with attribution |
| `wassim249/YT-Navigator` | Transcript ingestion, semantic search, PostgreSQL/pgvector patterns | Selective architectural reference |
| `jdepoix/youtube-transcript-api` | Transcript retrieval | Direct Python dependency |
| `dermasmid/scrapetube` | Unofficial discovery fallback | Adapter dependency only; never a hard architectural dependency |

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

## Bundled Skills

- `find-viral-shorts`
- `research-youtube-niche`
- `reverse-engineer-video`
- `competitor-research`
- `content-opportunity`

Skills teach Hermes how to combine tools. The plugin exposes the machinery.

## MVP

V0.1 should:

1. Search a niche.
2. Discover relevant channels and recent videos.
3. Identify Shorts.
4. Collect channel/video metrics.
5. Calculate channel-relative baselines.
6. Rank outliers and small-channel breakouts.
7. Fetch transcripts.
8. Extract hooks/topics.
9. Cluster similar breakout concepts.
10. Return structured results through Hermes tools.
11. Persist watchlists and timestamped observations.
12. Retain prediction records for forward validation.

## Key Data Model

```text
channels
videos
video_observations
channel_observations
transcripts
topics
clusters
outlier_scores
niche_scores
watchlists
predictions
prediction_results
```

The compounding asset is the temporal observation layer. Repeated observations let the system estimate velocity, acceleration, breakout timing, and eventual prediction quality rather than merely report historical totals.

## Outlier Philosophy

Do not rely on a single `video views / channel median views` ratio. A production score should combine:

- absolute views
- views/day
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

**Phase 0 / foundation.** Interfaces and scaffolding first; implementation follows behind tests and provider contracts.
