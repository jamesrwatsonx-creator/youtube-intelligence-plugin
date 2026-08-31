from youtube_intelligence import __version__
from youtube_intelligence.scoring import basic_outlier_evidence


def test_package_version():
    assert __version__ == "0.1.0"


def test_basic_outlier_evidence():
    evidence = basic_outlier_evidence(
        video_id="video-1",
        channel_id="channel-1",
        views=500_000,
        historical_views=[40_000, 50_000, 60_000],
        age_days=2,
        subscriber_count=9_000,
        replication_count=4,
    )

    assert evidence.multiplier == 10.0
    assert evidence.views_per_day == 250_000
    assert evidence.channel_median_views == 50_000
    assert "small-channel candidate" in evidence.reasons
