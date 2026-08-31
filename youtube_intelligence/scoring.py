from __future__ import annotations

from statistics import median

from youtube_intelligence.contracts import OutlierEvidence


def channel_baseline(view_counts: list[int]) -> float:
    clean = [v for v in view_counts if v >= 0]
    return float(median(clean)) if clean else 0.0


def basic_outlier_evidence(
    *,
    video_id: str,
    channel_id: str,
    views: int,
    historical_views: list[int],
    age_days: float | None = None,
    subscriber_count: int | None = None,
    replication_count: int | None = None,
) -> OutlierEvidence:
    """Transparent V0 scoring primitive.

    This is intentionally not the final production score. It creates an
    explainable baseline that later scoring modules can augment with velocity,
    recency, small-at-publish estimates, topic baselines and replication.
    """
    baseline = channel_baseline(historical_views)
    multiplier = (views / baseline) if baseline > 0 else 0.0
    views_per_day = (views / age_days) if age_days and age_days > 0 else None

    reasons: list[str] = []
    if multiplier >= 5:
        reasons.append(f"video is {multiplier:.1f}x the channel median")
    if subscriber_count is not None and subscriber_count < 50_000:
        reasons.append("small-channel candidate")
    if replication_count is not None and replication_count >= 3:
        reasons.append("pattern replicated across multiple creators")

    confidence = 0.35
    if len(historical_views) >= 10:
        confidence += 0.2
    if age_days is not None:
        confidence += 0.1
    if subscriber_count is not None:
        confidence += 0.1
    if replication_count is not None:
        confidence += 0.1

    return OutlierEvidence(
        video_id=video_id,
        channel_id=channel_id,
        multiplier=multiplier,
        views_per_day=views_per_day,
        channel_median_views=baseline,
        subscriber_count=subscriber_count,
        replication_count=replication_count,
        confidence=min(confidence, 1.0),
        reasons=reasons,
    )
