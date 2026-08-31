# Find Viral Shorts

Use this skill when the user wants breakout YouTube Shorts, especially videos outperforming small-channel baselines.

## Objective

Return a ranked set of evidence-backed breakout candidates, not merely high-view videos.

## Procedure

1. Call `youtube_search` for the requested niche.
2. Prefer Shorts and recent uploads when the request is about emerging content.
3. Call `youtube_find_outliers` using a default minimum multiplier of 5 unless the user specifies another threshold.
4. Prefer channels below 50,000 subscribers for small-channel discovery.
5. Call `youtube_find_breakouts` to rank candidates using relative performance, age, velocity when available, and replication.
6. For the strongest candidates, call `youtube_analyze_video` and `youtube_get_transcript`.
7. Extract the opening hook, topic, format, framing, and structural pattern.
8. Separate one-off virality from patterns replicated across multiple independent creators.
9. Report confidence and the evidence behind every recommendation.

## Output

For each candidate include: title, channel, subscriber count when available, views, age, channel baseline, outlier multiplier, views/day or velocity when available, replication evidence, hook summary, and confidence.

End with the most repeatable pattern discovered and what evidence would falsify that conclusion.
