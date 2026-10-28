# projectcampus.org — landing page

The front door of Project CAMPUS: a short summary of the project and links to its parts (D-154). An independent proposal by one alumnus, not affiliated with Visayas State University.

**Status:** live at projectcampus.org. Built from the [master doc](https://github.com/Ywcxz/projectcampus-docs), which wins wherever the two differ (D-082), and made to look like it.

## What it links, and what it doesn't yet

| Part | Address | On this page |
| --- | --- | --- |
| Master doc | docs.projectcampus.org | Linked, along with the two chapters the page summarizes: the network (Chapter 3) and the intranet (Chapter 2) |
| Interactive site | explore.projectcampus.org | Shown as **Not public yet**, with no link, until Q-71 settles how students reach it only after the survey (D-084, D-154). |
| Network prototype | none yet | Shown as **Planned**, with no link, until it runs somewhere public (D-099, Q-09). |
| Student survey | survey.projectcampus.org/student-life | Not shown (D-161). Its link goes out through the channels VSU approves (D-136), and the test fails if the page links it before it opens (D-114). |

When a part opens, edit `index.html` and add its address to `ALLOWED_LINKS` in `tests/site.test.js`, in the same pull request.

## Layout

```
index.html        the page: plain HTML, no script; its drawings are inline SVG
css/site.css      the master doc's palette and type, light and dark (system setting), phone first, and all the motion
fonts/            Newsreader and IBM Plex, Latin only, with their licences (D-160)
img/, favicon.ico the project's icon, shared with the interactive site, and the link preview card
vercel.json       strict security policy (no script at all), no referrer, no indexing
tests/            the rules test, no dependencies: cd tests && npm test
scripts/hooks/    the name guard as a local pre-commit hook
.github/workflows the site test and the name guard on every pull request
```

## Rules

- The not-affiliated notice stays at the top and bottom of the HTML. No VSU seal or logo.
- No claim tags or register IDs on the page (D-161): they live in the master doc. The wording carries the status instead ("would", "designed", "planned", "not yet"), so a claim is never stronger than its source, and each idea links the chapter it summarizes. The test fails if a tag word or an ID shows on the page.
- Motion is CSS only and stops under the system's reduced-motion setting. Each drawing's resting state is the finished picture, so keep that true when you change an animation. The test checks that the reduced-motion rule is there.
- The page collects nothing and loads nothing from another site. No script, form, cookie, or analytics. Its only fonts are the copies in `fonts/` (D-160): Newsreader 500, 600, and italic; IBM Plex Sans 400 and 500; IBM Plex Mono 500. Use those weights, or add a file with its licence.
- `img/og-card.png` is the preview Messenger and other apps show when the link is shared. Change it if the page's title or subtitle changes.
- The footer's "Checked against it on" date changes only when someone has re-read every claim against the master doc.

## Deploy (owner, on Vercel)

1. New Vercel project from this repository, framework preset "Other", no build command.
2. Add `projectcampus.org` and `www.projectcampus.org` (www redirecting to the apex). Remove them from the master doc's project first, where they were a temporary redirect.
3. Check the live headers: `curl -sI https://projectcampus.org/ | grep -i -e content-security -e robots`.

Before it goes live, run the campus-review skill on the page.

## Licence

Code is under the [MIT License](LICENSE). Writing and pictures are under [CC BY 4.0](LICENSE-CONTENT.md), which says which files are which. Copyright © 2026 Leo M. Subingsubing (D-159). The fonts in `fonts/` are not the project's: they are under the SIL Open Font License 1.1, whose text sits beside them.
