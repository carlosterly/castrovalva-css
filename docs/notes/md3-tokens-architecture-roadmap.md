# MD3 Token Strategy Note (Archived)

This note captures future considerations for the token system. It is not an active implementation roadmap.

## Current Source of Truth

- Current implementation: `src/tokens/tokens.css`
- Current guidance: `docs/tokens.md`
- Change and stability context: `docs/md3-component-plan.md`

## Ideas Worth Preserving

- Keep a clear distinction between semantic tokens used by components and lower-level implementation details.
- Prefer additive token changes over disruptive renames.
- Introduce new modes such as contrast or density only when there is a concrete product need.
- Treat external token tooling as optional future infrastructure, not a current requirement.

## What This Does Not Commit To

- A full migration to `md.ref`, `md.sys`, and `md.comp` naming layers.
- A W3C Design Tokens or Style Dictionary pipeline.
- Dynamic color generation or multi-mode expansion.
- A scheduled token-system rewrite.

## When To Revisit

Revisit this note only if one of these becomes a real project requirement:

- token export to multiple platforms or tools
- high-contrast or density modes
- more formal token governance and validation
- repeated token drift that current docs and CSS conventions cannot manage

If those needs do not materialize, this file should remain archival only.
