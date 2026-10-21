# Contributing

Thanks for helping with Neu. Use Bun only, never npm, yarn or pnpm.

## Run it

```bash
bun install
bun run dev
bun run lint
bunx playwright install chromium
bun run test
```

Install Chromium once before the first `bun run test`.

## Registry changes

After any registry change, run `bun run registry:build` and commit `public/r/`.

## Conventions

Read [AGENTS.md](AGENTS.md) for the structure and conventions.

## Questions and bugs

Ask in [GitHub issues](https://github.com/BeyondTheInnovation/bti4-neu/issues). For security reports, see [SECURITY.md](SECURITY.md).

## Sign off your commits

Every commit must be signed off:

```bash
git commit -s
```

The sign-off certifies the [Developer Certificate of Origin](https://developercertificate.org). There is no CLA. A check on pull requests fails when a commit has no `Signed-off-by:` line.
