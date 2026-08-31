# Video Discovery Analytics — Canonical Spec

This document defines the analytics, evidence, and ranking signals that power the Pulse video-discovery experience. It is the source of truth for dashboard metrics, niche discovery, outlier ranking, small-channel breakout detection, competitor analysis, and downstream creative recommendations.

## Product goal

Pulse should answer four questions in order:

1. Where is attention moving now?
2. Which niches/sub-niches are worth entering?
3. Which videos/channels are abnormal winners inside those spaces?
4. Why are they winning, and what should be created next?

The dashboard is not a collection of disconnected tools. `Start from money`, `Start from business`, and `Start from topic` are three entry paths into the same analysis pipeline.

## Core discovery outputs

Every niche/sub-niche row should expose:

- Opportunity score
- Growth / momentum
- Competition / saturation
- Breakout count
- Breakout rate
- Small-channel win rate
- Monetization / earning band
- Demand
- Freshness
- Creator accessibility
- Confidence / evidence coverage
- Shorts vs long-form mix
- Median views
- Median VPH / velocity where observed
- Median channel size
- Median outlier multiplier
- Replication count across independent creators
- Topic-cluster breadth
- New-channel / new-creator participation

## Canonical opportunity model

Use an explainable composite score. Do not hide the components behind one opaque number.

Recommended structure:

`opportunity = confidence × demand_gate × geomean(demand, low_supply, monetization, thin_content)`

Adapted from `sentien-labs/youtube-niche`, with Pulse-specific additions for temporal momentum, creator accessibility, replication, and format fit.

Important rules:

- Confidence is evidence coverage, not win probability.
- Missing signals reduce confidence; they must never be silently treated as positive evidence.
- Medians are preferred over maxima for niche-level summaries.
- A high outlier rate is more useful than simply low competition.
- Sub-niches should be ranked separately from broad categories.

## Demand and momentum

Demand should be built from multiple signals where available:

- Search/query relevance
- Current view velocity
- Recent view growth
- Breakout frequency
- Number of independent creators succeeding
- Topic-cluster growth
- Upload volume growth
- Recency-weighted video performance
- Related-query expansion / autocomplete coverage
- Trend consistency across several query phrasings

Dashboard charts should distinguish:

- absolute demand
- direction of travel
- acceleration/deceleration
- confidence

## Competition and saturation

Competition is not just creator count.

Include:

- established-channel count
- median channel size
- concentration of views among top channels
- upload density
- number of active creators
- percentage of views controlled by incumbents
- small-channel breakout rate
- age of dominant channels
- number of new channels entering successfully
- topic repetition / content redundancy
- title/thumbnail/format homogeneity

A crowded niche can still be attractive when outlier rate and small-channel wins remain high.

## Outlier analytics

Commercial tools such as vidIQ and 1of10 validate the core outlier pattern: compare a video's performance against its channel baseline rather than using raw views alone.

Every outlier result should expose:

- Outlier multiplier
- Outlier score
- Views
- Views per hour (VPH) / current velocity where observable
- Views per day
- Video age
- Publish date
- Channel subscriber count
- Channel median views
- Recent-channel median views
- Baseline sample size
- Engagement
- Video duration
- Shorts vs long-form
- Topic cluster
- Replication count
- Confidence
- Evidence / provenance

## Baseline methodology

Never use one naive `views / channel median` comparison as the production score.

Comparable baseline should prefer:

- same format: Shorts vs long-form
- recent N uploads
- similar publication era
- exclude the candidate video from its own baseline
- median rather than mean
- minimum sample-size threshold
- optional duration bucket
- optional topic/format similarity bucket

Expose the sample size so the user can see whether the comparison is robust.

## Small-at-publish methodology

A core Pulse advantage is identifying creators that were small when the breakout occurred rather than filtering only by their current subscriber count.

Where historical subscriber snapshots are unavailable:

- estimate subscribers at publish conservatively
- store the estimation method
- expose estimation confidence
- keep current subscriber count separately
- retain a `small_at_publish` flag

The upstream `youtube-niche` methodology explicitly treats channels that later grew large as valid small-channel winners if they were estimated to be small at publication.

## Temporal observation layer

Timestamped observations are mandatory for the long-term moat.

Store repeated observations of:

- views
- likes
- comments
- subscriber count where available
- views/hour
- views/day
- acceleration
- deceleration
- rank movement

Derived signals:

- breakout onset
- breakout velocity
- acceleration
- viral half-life
- persistence
- plateau timing
- late resurgence
- entering-a-viral-regime probability

Do not equate lifetime-average views/day with true current velocity when timestamped observations are available.

## Prediction validation

Every predictive recommendation should be testable.

Flow:

`prediction → timestamp → future observation → hit/miss → calibration`

Retain 30/60/90-day checkpoints for forward testing. Use AUC, hit rate by score band, precision, recall, and top-quartile lift to evaluate whether high opportunity scores actually predict future breakouts.

Backtests are directional because public YouTube APIs do not provide complete historical view/subscriber snapshots. Forward tests are the cleanest validation path.

## Niche discovery

Pulse should not require the user to already know the niche.

For `Start from money`, discovery should:

1. scan broad domains/categories
2. expand queries into related subtopics
3. mine recent small-at-publish winners
4. cluster breakout titles/transcripts
5. derive candidate sub-niches from those winners
6. score each candidate
7. rank by opportunity and confidence
8. show evidence rows behind every score

This winners-first path reduces dependence on guessed niche lists.

## Semantic intelligence

Use YT-Navigator patterns plus SentenceTransformers/pgvector for:

- transcript embeddings
- title/topic embeddings
- semantic clustering
- related-video discovery
- related-topic discovery
- duplicate/near-duplicate concept detection
- cross-channel pattern matching
- natural-language retrieval
- Ask Pulse contextual explanations

Hybrid retrieval should support semantic similarity plus lexical/BM25-style matching where useful.

## Transcript-derived discovery signals

Using `youtube-transcript-api`, extract:

- core topic
- opening hook
- promise/payoff
- recurring concepts
- named products/tools/entities
- CTA type
- audience/problem language
- sentiment shifts
- section structure
- semantic similarity to other winners

Transcript analysis belongs to discovery as well as creation because it helps explain why clusters of videos are winning.

## Metadata and public YouTube data

Use official YouTube Data API data where possible for:

- title
- description
- tags where available
- category
- channel ID
- publish timestamp
- duration
- public statistics
- thumbnails

Use `videos.batchGetStats` for quota-efficient public statistics observation where applicable.

Provider fallback order should remain abstracted so scoring logic is not coupled to one acquisition method:

- Official YouTube API
- yt-dlp
- Scrapetube
- transcript provider

## Commercial-tool parity checklist

Pulse should cover or exceed the useful discovery capabilities seen across current creator-research products.

### vidIQ parity

- outlier score
- VPH
- subscriber/channel-size filters
- publish-date filters
- duration filters
- Shorts/long-form toggle
- engagement
- average views / channel baseline
- related videos
- competitor tracking
- idea handoff

### 1of10 parity

- outlier finder
- niche explorer
- Shorts outliers
- advanced filtering
- tracked channels
- similar titles
- similar thumbnails
- repeat-pattern detection across several independent winners
- outlier rate
- competition depth
- earning band
- median-focused niche evaluation

### NexLev parity

- continuously updated niche discovery
- long-form and Shorts niche discovery
- real-time/48-hour channel activity concepts
- recently added outlier channels
- future-competition estimation
- viral videos on small channels over selectable recent windows

### Viewstats parity

- trends
- competitor analysis
- outlier discovery
- channel/video performance
- thumbnail-pattern research

### Social Blade concepts worth retaining

- daily/weekly channel deltas
- historical charts
- comparable-channel views/subscriber movement
- projections only when clearly marked as estimates

## Pulse-specific metrics beyond commercial parity

These should differentiate the product:

- small-at-publish win rate
- replication across independent creators
- breakout onset / acceleration
- viral-regime detection
- topic-cluster freshness
- winner-derived niche discovery
- prediction confidence and calibration
- evidence coverage
- historical score accuracy
- creator accessibility
- incumbent concentration
- semantic concept saturation
- creative-pattern replication
- opportunity score with visible component breakdown

## Dashboard organization

The discovery page should remain visually simple even though the engine is deep.

Top-level user-visible metrics:

- Opportunity
- Growth
- Competition
- Breakouts
- Small-channel wins
- Monetization

Secondary drill-down metrics can live behind cards, charts, row expansion, Help, or Ask Pulse.

Recommended panels:

- Market momentum
- Growth vs competition opportunity map
- Market signal breakdown
- Format mix
- Top emerging niches
- Recent small-channel breakouts
- Winner clusters
- Creator landscape
- Evidence / confidence
- Watchlist activity

## UX rules

- Three entry paths: Start from money, Start from business, Start from topic.
- One shared sequential analysis pipeline after entry.
- Do not make users manually select every analytical stage.
- Pulse should automatically surface recommendations after each completed analysis.
- `Ask Pulse` explains, compares, and acts on the current screen/context; it is not a duplicate search button.
- `Analyze Winners` appears after winners have been identified and deepens the creative diagnosis.
- Every composite score must have a visible explanation and evidence path.
- Help remains a lightweight contextual flyout; detailed questions go to Ask Pulse.

## Data/analytics stack

Current stack and roles:

- `youtube-niche` — opportunity methodology, winners-first discovery, small-at-publish logic, confidence, backtesting, forward validation
- `YT-Navigator` — transcript ingestion, semantic retrieval, PostgreSQL/pgvector architecture, BM25/hybrid-search concepts
- `youtube-transcript-api` — transcript retrieval
- `yt-dlp` — resilient metadata/extraction fallback
- `scrapetube` — lightweight discovery fallback
- `SentenceTransformers` — semantic embeddings/clustering
- `pgvector` — persistent similarity search
- `DuckDB` — analytical queries/backtests/snapshots
- `Polars` — fast dataframe/lazy transformations
- `APScheduler` — recurring watch/observation jobs
- YouTube Data API — canonical public metadata/statistics provider when available

## Non-negotiable quality bar

A metric is not production-ready merely because it is visually attractive. Every dashboard metric must have:

- definition
- source
- observation timestamp
- calculation method
- sample size where relevant
- confidence
- format scope
- historical-version awareness where required
- explanation text for Ask Pulse / Help

The dashboard should be easy to use; the evidence underneath it should be rigorous.