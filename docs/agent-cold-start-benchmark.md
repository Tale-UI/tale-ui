# Agent cold-start benchmark

Tale UI measures whether a clean project exposes the minimum discovery signals
an agent needs before and after `tale init --scripts`.

The benchmark is a deterministic instruction-discovery proxy, not a claim about
any particular model's quality. It exercises the real `initializeProject`
runtime in a temporary clean project and checks five tasks:

- registry-first guidance;
- local CLI discovery;
- local MCP discovery;
- validation command discovery; and
- recovery/doctor command discovery.

Context cost is reported as UTF-8 bytes and a stable estimate of one token per
four bytes. The committed history lives in
`analysis/baselines/agent-cold-start.json`. CI reruns the same fixture and fails
on unexplained drift.

Capture an intentional new baseline with:

```bash
pnpm agent:cold-start:capture
```

Verify the committed history with:

```bash
pnpm agent:cold-start:check
```
