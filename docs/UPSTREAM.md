# Upstream Strategy

This project does not vendor entire upstream applications by default. We take dependencies where appropriate and selectively adapt algorithms or architecture with attribution and license preservation.

## sentien-labs/youtube-niche

Role: primary reference for niche opportunity scoring, small-at-publish breakout detection, confidence-aware scoring, evidence ledgers, temporal backtesting, forward snapshots, and retention discipline.

Action: inspect individual modules before porting. Prefer adapting tested scoring primitives and validation concepts rather than importing the whole CLI application.

## wassim249/YT-Navigator

Role: reference for transcript ingestion, PostgreSQL/pgvector storage, semantic retrieval, BM25 + embedding search, and channel-content indexing.

Action: reuse architecture patterns selectively. Do not inherit Django unless the engine later needs that web stack.

## jdepoix/youtube-transcript-api

Role: transcript acquisition.

Action: use as a package dependency behind `TranscriptProvider`.

## dermasmid/scrapetube

Role: unofficial discovery fallback.

Action: use behind an adapter only. Never let its output structure leak into engine/domain models.

## Rules

1. Preserve upstream license notices for copied/adapted code.
2. Record provenance for adapted algorithms.
3. Keep all provider-specific response parsing outside scoring/domain layers.
4. Add fixture tests before replacing an upstream behavior.
5. Treat external scraping methods as replaceable and failure-prone.
6. Prefer official APIs when policy, stability, or correctness makes them materially safer.
