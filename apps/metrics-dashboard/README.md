# Tale UI adoption and health dashboard

Static dashboard generated from repository-owned health evidence and
checkpointed public aggregate providers.

No project telemetry, user identifiers, cookies, analytics scripts, ingestion
service, or authenticated event endpoint exists. Unobserved data is displayed
as `unavailable`, never as zero. The source snapshot, coverage report, and
rollback digest are retained under `registry/metrics/`.

Run `pnpm metrics:collect` only when network collection is intended. A failed
provider retains its last successful value and records the collection error.
`pnpm metrics:build` is deterministic from the retained checkpoint.
