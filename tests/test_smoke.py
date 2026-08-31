from youtube_intelligence import __version__
from youtube_intelligence.scoring import calculate_outlier_multiplier


def test_package_version():
    assert __version__ == "0.1.0"


def test_outlier_multiplier():
    assert calculate_outlier_multiplier(video_views=500_000, channel_median_views=50_000) == 10.0
