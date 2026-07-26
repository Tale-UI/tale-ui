# Security policy

## Supported versions

The versions of the project that are currently supported with security updates.

| Tale UI version | Release line   | Security updates   | Minimum Node guidance |
| --------------: | :------------- | :----------------- | :-------------------- |
|           3.x.x | Current major  | :white_check_mark: | Node 18+              |
|           2.x.x | Previous major | :white_check_mark: | Node 18+              |
|           1.x.x | Archived       | :x:                | Upgrade Node and Tale |

Versioned v2 documentation is retained for supported previous-major consumers,
and v1 documentation remains available as an immutable archive. New features
and normal maintenance target v3.

The historical React 2 and React 1.3.56 manifests declared Node 14 while
depending on an MCP SDK whose runtime floor was Node 18. Those manifests do not
prove Node 14 or Node 16 support. Users on Node 14 or 16 must upgrade Node; Tale
UI does not recommend a historical release line for those runtimes.

## Reporting a vulnerability

You can report a vulnerability by opening a [GitHub Security Advisory](https://github.com/Tale-UI/tale-ui/security/advisories/new).
