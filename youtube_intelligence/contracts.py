from __future__ import annotations

from datetime import datetime
from typing import Protocol

from pydantic import BaseModel, Field


class ChannelRecord(BaseModel):
    platform: str = "youtube"
    channel_id: str
    title: str
    subscriber_count: int | None = None
    observed_at: datetime
    provenance: str


class VideoRecord(BaseModel):
    platform: str = "youtube"
    video_id: str
    channel_id: str
    title: str
    published_at: datetime | None = None
    duration_seconds: int | None = None
    is_short: bool | None = None
    observed_at: datetime
    provenance: str


class VideoObservation(BaseModel):
    video_id: str
    observed_at: datetime
    views: int | None = None
    likes: int | None = None
    comments: int | None = None
    provenance: str


class OutlierEvidence(BaseModel):
    video_id: str
    channel_id: str
    multiplier: float = Field(ge=0)
    views_per_day: float | None = None
    channel_median_views: float | None = None
    subscriber_count: int | None = None
    replication_count: int | None = None
    confidence: float = Field(default=0.5, ge=0, le=1)
    reasons: list[str] = Field(default_factory=list)


class ContentPlatform(Protocol):
    async def search_videos(self, query: str, limit: int = 25) -> list[VideoRecord]: ...
    async def get_channel(self, channel_id: str) -> ChannelRecord: ...
    async def get_video(self, video_id: str) -> VideoRecord: ...
    async def get_observation(self, video_id: str) -> VideoObservation: ...


class TranscriptProvider(Protocol):
    async def get_transcript(self, video_id: str, languages: list[str] | None = None) -> str: ...
