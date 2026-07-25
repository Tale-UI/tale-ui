# Design-system review rubric

Score each applicable domain as **pass**, **changes required**, or **not applicable with rationale**.
The proposal owner retains the evidence links in its RFC or ADR.

| Domain                | Review questions                                                                                   | Required evidence                                            |
| --------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| User and system fit   | Is repeated demand demonstrated? Is this owned by a design system?                                 | Candidate disposition, alternatives, ownership boundary      |
| API and compatibility | Is the smallest composable contract used? Are controlled, default, and server modes clear?         | Types, compatibility tests, deprecation and migration plan   |
| Accessibility         | Do semantics, keyboard, focus, announcements, zoom, contrast, RTL, and reduced motion hold?        | Automated checks plus retained manual evidence               |
| Security and privacy  | Is content ordinary data? Are trust, HTML, execution, storage, and disclosure boundaries explicit? | Threat analysis and negative tests                           |
| SSR and hydration     | Is output deterministic and free of browser-only initialization?                                   | SSR and hydration tests                                      |
| Performance           | Does the change stay inside maintained surface budgets?                                            | Baseline comparison and any expiring exception               |
| Documentation         | Can a consumer choose, compose, migrate, and avoid pitfalls?                                       | Docs, stories, goldens, registry and A2UI decision           |
| Operations            | Can release, rollback, replay, and generated artifacts be verified?                                | Package checks, deterministic generation, recovery treatment |

Reviewers should request evidence proportional to risk. A “not applicable” result needs a concrete
reason; it is not a substitute for missing evidence.
