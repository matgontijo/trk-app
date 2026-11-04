# trk-app — technical portfolio notes

Source reviewed: `e268d9d5dc27ee6a4fb5c25f7a56a4854afe8973` · 2026-11-04. These notes distinguish implemented behavior from next steps; they do not certify a production deployment.

## Purpose

Spreadsheet-backed property and payment dashboard.

**Stack:** Python, FastAPI, pandas, Next.js, TypeScript.

**AI scope:** ETL and dashboard; no ML or LLM implementation found.

## Evidence in this repository

- [backend/sync.py](../backend/sync.py): Spreadsheet ingestion, date normalization and aggregation.
- [backend/main.py](../backend/main.py): Read APIs and scheduled refresh.
- [frontend/lib/api.ts](../frontend/lib/api.ts): Frontend API integration.

## Validation

```text
python -m unittest discover -s backend/tests -p test_sync_offline.py -q
```

Use an isolated environment and synthetic data. Never run operational ingestion, scheduled jobs or live provider calls merely to demonstrate the project. Test presence is not the same as a successful test run.

## Known limits and next steps

- Financial read endpoints have no authentication in the inspected backend; spreadsheet identifiers are embedded in source.
- The manual test_sync.py previously contacted Google Sheets on import and had no assertions. It is now explicitly invoked; offline regression tests live under backend/tests/.
- The audit branch adds HTTP status validation and finite request timeouts.
- No learned model, model evaluation or CI was found.

## Portfolio positioning

ETL example only; use synthetic spreadsheets and review access controls before a public demo.

A reproducible AI evaluation should document a synthetic or anonymized dataset, baseline, expected outputs, failure cases, quality metrics, latency and cost. Training and evaluating a predictive model would be separate work; it is not claimed here.
