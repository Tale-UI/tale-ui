# Lifecycle and governance

The artifact registry is the canonical inventory for Tale UI components, foundations, hooks,
recipes, templates, migrations, A2UI types, and guidance. Every artifact has one lifecycle state
and one accountable functional owner.

## Lifecycle

- **Experimental:** available for evidence gathering. Changes remain possible, but removal or
  promotion requires a recorded decision and release notes.
- **Stable:** passed every promotion gate and follows semantic-versioning compatibility.
- **Deprecated:** remains supported during the notice window and names a replacement plus migration
  treatment.
- **Retired:** removed from current packages while its stable ID, historical documentation, and
  replacement record remain discoverable.

Stable promotion requires the approved proposal, named owner, API and compatibility review,
accessibility evidence, security and privacy review, SSR and hydration coverage, a maintained
performance budget, documentation and examples, migration and rollback treatment, and correct
packaging and generated artifacts.

Deprecation provides at least 180 days of notice. Retirement is a major-release action. It must
archive documentation and preserve the stable artifact ID.

## Ownership

Functional ownership is defined in `registry/governance/ownership.json`. Rules are evaluated in
order and then fall back to Design Systems. Ownership means maintaining the contract, triaging
regressions, supplying review evidence, and driving lifecycle decisions; it does not grant
unreviewed release authority.

The generated ownership report proves complete registry coverage. Changes that leave an unknown
owner or an uncovered artifact fail `governance:check`.

## Proposals and review

Use the design-system proposal issue template for a new public contract or a material stable API
change. The proposal links evidence, alternatives, lifecycle intent, migration and rollback, and
the relevant review domains. Accepted decisions belong in an RFC or ADR under `docs/architecture`.

The review rubric is risk-scaled. Experimental additions still require security, accessibility,
SSR, packaging, and ownership boundaries; stable promotion additionally requires all ten promotion
gates.

## Exceptions

An exception is a temporary, explicit release-gate variance. It requires a scope, gate, accountable
owner, substantive rationale, approval date, expiry no more than 180 days later, and preferably a
tracking issue. Expired, unknown-owner, or overlong exceptions fail CI. Exceptions cannot silently
change a public contract or authorize destructive operations.

Current exceptions and their state are generated into `registry/reports/exceptions.json`.
