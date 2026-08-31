#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import math
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from statistics import median
from typing import Any

from yt_dlp import YoutubeDL


@dataclass
class RankedOutlier:
    rank: int
    title: str
    video_id: str
    url: str
    channel: str
    channel_id: str | None
    views: int
    channel_median_views: float
    outlier_multiplier: float
    subscriber_count: int | None
    duration_seconds: int | None
    upload_date: str | None
    observed_at: str


def ydl_opts(*, flat: bool = False, playlist_end: int | None = None) -> dict[str, Any]:
    opts: dict[str, Any] = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "extract_flat": "in_playlist" if flat else False,
        "socket_timeout": 20,
        "retries": 2,
    }
    if playlist_end:
        opts["playlistend"] = playlist_end
    return opts


def extract(url: str, *, flat: bool = False, playlist_end: int | None = None) -> dict[str, Any]:
    with YoutubeDL(ydl_opts(flat=flat, playlist_end=playlist_end)) as ydl:
        return ydl.extract_info(url, download=False)


def normalize_url(entry: dict[str, Any]) -> str | None:
    url = entry.get("webpage_url") or entry.get("url")
    if isinstance(url, str) and url.startswith("http"):
        return url
    video_id = entry.get("id")
    if video_id:
        return f"https://www.youtube.com/watch?v={video_id}"
    return None


def search_candidates(query: str, limit: int) -> list[dict[str, Any]]:
    payload = extract(f"ytsearch{limit}:{query}", flat=False)
    return [e for e in payload.get("entries", []) if e]


def recent_channel_views(channel_id: str, sample_size: int, exclude_video_id: str) -> list[int]:
    channel_url = f"https://www.youtube.com/channel/{channel_id}/videos"
    try:
        listing = extract(channel_url, flat=True, playlist_end=sample_size + 3)
    except Exception:
        return []

    views: list[int] = []
    for entry in listing.get("entries", []) or []:
        if len(views) >= sample_size:
            break
        if entry.get("id") == exclude_video_id:
            continue
        url = normalize_url(entry)
        if not url:
            continue
        try:
            info = extract(url)
        except Exception:
            continue
        value = info.get("view_count")
        if isinstance(value, int) and value >= 0:
            views.append(value)
    return views


def looks_like_short(info: dict[str, Any]) -> bool:
    # Approximation for the first vertical slice. YouTube's Shorts product
    # classification is not perfectly represented by duration alone.
    duration = info.get("duration")
    return isinstance(duration, (int, float)) and duration <= 180


def score(query: str, limit: int, baseline_sample: int, shorts_only: bool) -> list[RankedOutlier]:
    candidates = search_candidates(query, limit)
    scored: list[RankedOutlier] = []

    for info in candidates:
        video_id = info.get("id")
        channel_id = info.get("channel_id")
        views = info.get("view_count")
        if not video_id or not channel_id or not isinstance(views, int):
            continue
        if shorts_only and not looks_like_short(info):
            continue

        history = recent_channel_views(channel_id, baseline_sample, video_id)
        if len(history) < 3:
            continue

        baseline = float(median(history))
        multiplier = (views / baseline) if baseline > 0 else 0.0
        url = info.get("webpage_url") or f"https://www.youtube.com/watch?v={video_id}"

        scored.append(
            RankedOutlier(
                rank=0,
                title=info.get("title") or video_id,
                video_id=video_id,
                url=url,
                channel=info.get("channel") or info.get("uploader") or channel_id,
                channel_id=channel_id,
                views=views,
                channel_median_views=baseline,
                outlier_multiplier=multiplier,
                subscriber_count=info.get("channel_follower_count"),
                duration_seconds=int(info["duration"]) if info.get("duration") is not None else None,
                upload_date=info.get("upload_date"),
                observed_at=datetime.now(timezone.utc).isoformat(),
            )
        )

    scored.sort(key=lambda item: item.outlier_multiplier, reverse=True)
    for index, item in enumerate(scored, start=1):
        item.rank = index
    return scored


def print_table(items: list[RankedOutlier], minimum: float) -> None:
    visible = [x for x in items if x.outlier_multiplier >= minimum]
    if not visible:
        print(f"No candidates met the {minimum:.1f}x threshold in this sample.")
        return

    print()
    print(f"{'#':>2}  {'OUTLIER':>8}  {'VIEWS':>10}  {'BASELINE':>10}  CHANNEL / VIDEO")
    print("-" * 110)
    for item in visible:
        title = item.title.replace("\n", " ")[:62]
        channel = item.channel.replace("\n", " ")[:28]
        print(
            f"{item.rank:>2}  {item.outlier_multiplier:>7.1f}x  "
            f"{item.views:>10,}  {int(item.channel_median_views):>10,}  {channel} — {title}"
        )
        print(f"    {item.url}")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Find sampled YouTube videos outperforming their channel baseline."
    )
    parser.add_argument("query", help="YouTube topic/niche to search")
    parser.add_argument("--limit", type=int, default=12, help="Candidate videos to inspect")
    parser.add_argument(
        "--baseline-sample", type=int, default=8, help="Recent channel videos used for median"
    )
    parser.add_argument("--min-multiplier", type=float, default=2.0, help="Minimum result threshold")
    parser.add_argument("--shorts", action="store_true", help="Approximate Shorts-only filter (<=180s)")
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of a table")
    args = parser.parse_args()

    try:
        items = score(args.query, args.limit, args.baseline_sample, args.shorts)
    except KeyboardInterrupt:
        print("Cancelled.", file=sys.stderr)
        return 130
    except Exception as exc:
        print(f"Live outlier scan failed: {exc}", file=sys.stderr)
        return 1

    visible = [x for x in items if x.outlier_multiplier >= args.min_multiplier]
    if args.json:
        print(json.dumps([asdict(x) for x in visible], indent=2))
    else:
        print_table(items, args.min_multiplier)
        print()
        print(
            "V0 note: this is a sampled channel-relative outlier scan. "
            "Velocity, replication, small-at-publish estimates and temporal confidence come next."
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
