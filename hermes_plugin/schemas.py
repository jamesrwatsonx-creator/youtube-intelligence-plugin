def _schema(description: str, properties: dict, required: list[str] | None = None) -> dict:
    return {
        "name": "",
        "description": description,
        "parameters": {
            "type": "object",
            "properties": properties,
            "required": required or [],
            "additionalProperties": False,
        },
    }


TOOL_SCHEMAS = {
    "youtube_search": _schema(
        "Search YouTube content for a topic or niche.",
        {"query": {"type": "string"}, "limit": {"type": "integer", "default": 25}},
        ["query"],
    ),
    "youtube_find_outliers": _schema(
        "Rank videos that materially outperform their channel baseline.",
        {
            "query": {"type": "string"},
            "min_multiplier": {"type": "number", "default": 5},
            "max_channel_subscribers": {"type": "integer", "default": 50000},
        },
        ["query"],
    ),
    "youtube_find_breakouts": _schema(
        "Find small-channel breakout videos and explain the evidence.",
        {"query": {"type": "string"}, "limit": {"type": "integer", "default": 20}},
        ["query"],
    ),
    "youtube_analyze_niche": _schema(
        "Score a YouTube niche for demand, supply, breakout activity, and confidence.",
        {"niche": {"type": "string"}},
        ["niche"],
    ),
    "youtube_analyze_channel": _schema(
        "Analyze a YouTube channel's baseline, recent performance, and breakout history.",
        {"channel": {"type": "string"}},
        ["channel"],
    ),
    "youtube_analyze_video": _schema(
        "Analyze one YouTube video, its relative performance, transcript, hook, and topic.",
        {"video": {"type": "string"}},
        ["video"],
    ),
    "youtube_get_transcript": _schema(
        "Fetch the available transcript for a YouTube video.",
        {"video": {"type": "string"}, "languages": {"type": "array", "items": {"type": "string"}}},
        ["video"],
    ),
    "youtube_find_similar_content": _schema(
        "Find semantically or structurally similar YouTube content.",
        {"video": {"type": "string"}, "limit": {"type": "integer", "default": 20}},
        ["video"],
    ),
    "youtube_create_watchlist": _schema(
        "Create a persistent watchlist for a niche, channel, or breakout condition.",
        {"name": {"type": "string"}, "query": {"type": "string"}},
        ["name", "query"],
    ),
    "youtube_watch_niche": _schema(
        "Inspect the latest observations for a watched niche and surface new breakouts.",
        {"niche": {"type": "string"}},
        ["niche"],
    ),
}

for tool_name, schema in TOOL_SCHEMAS.items():
    schema["name"] = tool_name
