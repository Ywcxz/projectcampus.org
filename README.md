# projectcampus.org — landing page

The front door of Project CAMPUS: a short summary of the project and links to its parts (D-154). An independent proposal by one alumnus, not affiliated with Visayas State University.

**Status:** draft, not yet live. Built from the [master doc](https://github.com/Ywcxz/projectcampus-docs), which wins wherever the two differ (D-082).

## What it links, and what it doesn't yet

| Part | Address | On this page |
| --- | --- | --- |
| Master doc | docs.projectcampus.org | Linked |
| Student survey | survey.projectcampus.org/student-life | Shown as **Not open yet**, with no link, until `OPEN = true` in VSUrvey (D-114). The survey page renders in full even while closed, so a link would invite students to fill in answers that are never sent. |
| Interactive site | explore.projectcampus.org | Shown as **Shown in person**, with no link, until Q-71 settles how students reach it only after the survey (D-084, D-154). |

When either changes, edit `index.html` and add the address to `ALLOWED_LINKS` in `tests/site.test.js`, in the same pull request.

## Layout

```
index.html        the page: plain HTML, no script
css/site.css      the master doc's palette, light and dark (system setting), phone first
img/, favicon.ico the project's icon, shared with the interactive site
vercel.json       strict security policy (no script at all), no referrer, no indexing
tests/            the rules test, no dependencies: cd tests && npm test
scripts/hooks/    the name guard as a local pre-commit hook
.github/workflows the site test and the name guard on every pull request
```

## Rules

- The not-affiliated notice stays at the top and bottom of the HTML. No VSU seal or logo.
- Every claim shows its tag (Established, Proposed, Unresolved) and links the register row or chapter it rests on. A claim is no stronger than its source.
- The page collects nothing and loads nothing from another site. No script, form, cookie, analytics, or web font.
- The footer's "Checked against it on" date changes only when someone has re-read every claim against the master doc.

## Deploy (owner, on Vercel)

1. New Vercel project from this repository, framework preset "Other", no build command.
2. Add `projectcampus.org` and `www.projectcampus.org` (www redirecting to the apex). Remove them from the master doc's project first, where they were a temporary redirect.
3. Check the live headers: `curl -sI https://projectcampus.org/ | grep -i -e content-security -e robots`.

Before it goes live, run the campus-review skill on the page.

## Licence

Code is under the [MIT License](LICENSE). Writing and pictures are under [CC BY 4.0](LICENSE-CONTENT.md), which says which files are which. Copyright © 2026 Leo M. Subingsubing (D-159).
