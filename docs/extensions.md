# Tale UI extensions

Extensions can contribute exactly five classes:

- components with structured docs;
- recipes and templates;
- validations and pitfalls;
- codemods; and
- A2UI types.

Discovery reads and validates a package manifest without importing package
code. Every artifact ID begins with the declared third-party namespace, so an
extension can never become indistinguishable from a `tale:*` artifact.

Declarative records remain provenance-visible in a virtual registry.
Executable validators, codemods, and adapters are denied unless all of these
local checks pass:

1. package and extension contract versions are compatible;
2. the tarball matches npm or lockfile SHA-512 integrity supplied outside the
   package (the extension manifest cannot self-attest its own tarball);
3. required npm provenance is present;
4. the publisher/package pair is trusted and not revoked;
5. the trust registry is no more than 30 days old; and
6. the project has an exact, non-revoked approval for package, publisher,
   version, integrity, and requested capabilities.

Trust is not inferred from installation and is never global. A trust registry
older than seven days warns; one older than 30 days fails closed. Hosted
runtimes cannot execute extensions. Revocation is evaluated before every
local authorization.
