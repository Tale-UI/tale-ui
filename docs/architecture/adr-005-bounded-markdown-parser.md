# ADR 005: Bounded Markdown parser

- Status: Accepted
- Date: 2026-07-27
- Approved by: Repository owner through delegated implementation authority
- Gate: Component-equivalence Gate A
- Review disciplines: Security, Packaging, Performance, and Accessibility

## Decision

Use exact `marked@13.0.3` as the private parser behind the experimental
`Markdown` component. Tale consumes only its synchronous lexer tokens and
converts them to a closed internal node model before producing React elements.
Tale never consumes Marked's HTML renderer and never injects parser output
with `dangerouslySetInnerHTML`.

The dependency is an ordinary declared runtime dependency of
`@tale-ui/react`, not a copied or build-only artifact. The package build
therefore preserves the declared runtime import and the packed-consumer test
must prove that the tarball installs and resolves it without an undeclared
import.

## Gate A evidence

The candidate review was performed on 2026-07-27:

| Candidate                        | Result |
| -------------------------------- | ------ |
| `marked@13.0.3`                  | Selected. Synchronous token API, Node `>=18`, ESM and CJS entry points, bundled declarations, MIT licence, and no runtime dependencies. |
| `markdown-it@14.1.1`             | Rejected. A synchronous token API is available, but declarations require a separate package and the parser adds six runtime dependencies. |
| `mdast-util-from-markdown@2.0.3` | Rejected. Its AST is suitable, but it is ESM-only and adds twelve direct runtime dependencies before transitive expansion. |
| `micromark@4.0.2`                | Rejected as the direct adapter. Its primary result is HTML and using it as a token-to-React boundary would require additional internal packages or the mdast stack. |

Registry metadata for `marked@13.0.3` reports an unpacked size of 1,036,940
bytes. A browser ESM bundle containing the selected synchronous lexer path,
minified with the lockfile's esbuild 0.27.7, measured 38,201 bytes and 11,556
bytes with gzip. This is the accepted Gate A dependency delta; Tale's
component-performance fixture separately measures the complete
validate → parse → filter → static-render operation.

The GitHub Advisory Database query for the npm package returned no advisory
whose vulnerable range includes 13.0.3. The current 2026
`GHSA-6v9c-7cg6-27q7` recursion advisory affects only Marked 18.0.0–18.0.1
and is patched in 18.0.2. Older listed advisories have patched ranges below
13.0.3. Dependency review must rerun before changing the exact pin.

## Frozen boundary

The adapter enforces these limits before export:

- 100,000 UTF-16 source units;
- 10,000 units per line;
- 32 token-nesting levels; and
- 10,000 parsed nodes before filtering.

The closed renderer supports paragraphs, headings, emphasis, strong text,
lists, thematic breaks, blockquotes, links, inline code, and fenced code.
Raw HTML is omitted. Images and resources become non-fetching text. Links are
limited to fragments, credential-free HTTP(S), `mailto:`, and relative links
resolved against an explicitly valid HTTP(S) base.

The tracked malicious corpus covers raw and nested HTML, executable and
credential-bearing URLs, malformed and protocol-relative links, and remote
or data resources. Focused tests cover every limit plus injected parser and
filter exceptions. Any validation, parser, or filtering failure discards the
entire result and renders only the caller's fallback.

`Markdown` exposes no parser, plugin, AST, renderer, URL-transformer,
highlighter, raw-HTML, or executable-extension API. `Chat` remains unchanged
and does not parse Markdown.

## Rollback

Rollback removes the `Markdown` source, CSS, exports, docs, golden prompt,
recipe coverage, malicious corpus, performance fixture/budget record, and
generated artifacts, then removes exact `marked@13.0.3` from the React
manifest and lockfile. Rebuild and pack React after removal and verify the
tarball has no `marked` import or dependency. No shared Chat behavior or API
changes are required to roll back Markdown.

Threshold policy for component performance is recorded with the component
performance schema: warning is
`max(baseline × 2, baseline + 5 ms)` and blocking is
`max(baseline × 3, baseline + 10 ms)`. A formula change requires a new ADR and
schema migration.
