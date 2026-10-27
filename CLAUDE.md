# projectcampus.org landing page: notes for Claude

This repository is the landing page of Project CAMPUS (D-154). It is built from the master doc, `Ywcxz/projectcampus-docs`, which is the reference layer (D-082). The master doc's `CLAUDE.md` and `content/README.md` apply here too; this file adds what is particular to the page.

## Before you edit

- Read the live `index.html` and the master doc rows and chapters a claim rests on, at main. Never write a claim from memory or from a brief alone.
- A new claim goes into the master doc before it goes on this page.
- Don't link the interactive site until Q-71 is settled, or the survey until it opens (D-084, D-114, D-154). The test enforces both.

## Never

- Name stakeholders or describe private conversations (D-030).
- Name or link a community-run Facebook page or group (D-044), or open any Meta site (D-041).
- Use the retired expansion of the name (D-040).
- Add a script, form, or anything loaded from another site. The only fonts are the copies in `fonts/` (D-160).

## Before you push

```bash
cd tests && npm test
```

- Changed `css/`? Bump the `?v=` key in `index.html`.
- The owner checks visuals himself.
- Work on a branch named `claude/` plus a short topic and open a pull request; the owner merges.
