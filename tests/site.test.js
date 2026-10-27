// The landing page's test: the rules every page follows (D-148, D-154),
// with no dependencies, since the page is plain HTML and CSS.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
let passed = 0;
const failures = [];
function check(ok, label) {
  if (ok) passed++;
  else failures.push(label);
}
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

function files(dir = ROOT, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if ([".git", "node_modules", "tests"].includes(name)) continue;
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) files(full, out);
    else out.push(path.relative(ROOT, full));
  }
  return out;
}
const ALL = files();
const TEXT = ALL.filter((f) => /\.(html|css|json|md|yml|svg|txt)$/.test(f) || f.endsWith("pre-commit"));
const PAGES = ALL.filter((f) => f.endsWith(".html"));
const NOTICE = "Not affiliated with Visayas State University";

// Addresses this page may link to. The interactive site is not among them
// until Q-71 settles how students reach it only after the survey (D-084, D-154),
// and the survey is not among them until it opens (D-114).
const ALLOWED_LINKS = [
  /^https:\/\/docs\.projectcampus\.org\//,
  /^https:\/\/github\.com\/Ywcxz\/projectcampus-docs$/,
  /^https:\/\/github\.com\/Ywcxz\/projectcampus\.org$/,
];
const ALLOWED_DECISION = /^https:\/\/docs\.projectcampus\.org\/decisions\.html#[dq]-\d{3}$|^https:\/\/docs\.projectcampus\.org\/decisions\.html#q-\d{2}$/;

for (const page of PAGES) {
  const html = read(page);
  const notices = html.split(NOTICE).length - 1;
  check(notices >= 2, `${page}: carries the not-affiliated notice at the top and the bottom (D-148)`);
  check(!/<(form|input|textarea|select|iframe)\b/i.test(html), `${page}: has no form, input, or frame, since the page collects nothing`);
  check(!/<script\b/i.test(html), `${page}: has no script; the security policy allows none`);
  check(!/\sstyle="/i.test(html), `${page}: has no inline style, which the security policy would block`);
  const loads = [...html.matchAll(/<(?:link|img|source|video|audio)\b[^>]*\b(?:src|href)="([^"]+)"/gi)].map((m) => m[1]);
  check(loads.every((r) => !/^(https?:)?\/\//i.test(r)), `${page}: loads nothing from another site`);
  check(/<meta name="robots" content="noindex, nofollow">/.test(html), `${page}: kept out of search results while the survey is closed`);

  const links = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)].map((m) => m[1]).filter((h) => !h.startsWith("#"));
  for (const href of links) {
    check(ALLOWED_LINKS.some((re) => re.test(href)), `${page}: link ${href} is to the master doc or its source`);
    if (href.includes("decisions.html")) check(ALLOWED_DECISION.test(href), `${page}: ${href} points at a register row`);
  }
  check(!/explore\.projectcampus\.org/i.test(html.replace(/<!--[\s\S]*?-->/g, "")), `${page}: does not link or name the interactive site's address before Q-71 is settled (D-154)`);
  check(!/survey\.projectcampus\.org|vsurvey.*vercel\.app/i.test(html), `${page}: does not link the survey before it opens (D-114)`);

  // Every claim carries a tag and at least one source, and every tag outside
  // the legend belongs to a claim (D-148, D-156).
  const claims = [...html.matchAll(/<(p|small) class="claim">([\s\S]*?)<\/\1>/g)].map((m) => m[2]);
  for (const c of claims) {
    check(/class="tag tag-(est|pro|unr)"/.test(c) && /class="src"/.test(c), `${page}: every claim has a tag and a source`);
  }
  const outsideLegend = html.replace(/<dl class="legend">[\s\S]*?<\/dl>/g, "");
  const tags = (outsideLegend.match(/class="tag tag-/g) || []).length;
  const claimed = claims.reduce((n, c) => n + (c.match(/class="tag tag-/g) || []).length, 0);
  check(tags === claimed, `${page}: every tag sits in a claim with its source (${tags - claimed} loose)`);
}

check(!ALL.some((f) => /seal|logo/i.test(path.basename(f))), "no file is named as a seal or logo (D-148)");

// The retired expansion of the name (D-040), built so this file doesn't contain it.
const RETIRED = new RegExp(["Connected", "Academic", "Matrix"].join("\\s+"), "i");
for (const f of TEXT) check(!RETIRED.test(read(f)), `${f}: does not use the retired name (D-040)`);

// The security headers.
const vercel = JSON.parse(read("vercel.json"));
const all = vercel.headers.find((h) => h.source === "/(.*)").headers;
const csp = all.find((h) => h.key === "Content-Security-Policy").value;
check(/default-src 'none'/.test(csp) && !/script-src/.test(csp), "the security policy allows no script");
check(/font-src 'self'(;|$)/.test(csp) && !/https?:/.test(csp), "the security policy allows fonts from this site only");
check(all.some((h) => h.key === "Referrer-Policy" && h.value === "no-referrer"), "no referrer is sent");
check(all.some((h) => h.key === "X-Robots-Tag" && /noindex/.test(h.value)), "the header keeps the page out of search results");

// Every local file a page refers to exists, and the CSS key matches across pages.
for (const page of PAGES) {
  for (const m of read(page).matchAll(/(?:href|src)="((?:css|img|fonts)\/[^"?]+|favicon\.ico)/g)) {
    check(fs.existsSync(path.join(ROOT, m[1])), `${page}: ${m[1]} exists`);
  }
}
// The stylesheets load only this site's own files: the bundled fonts (D-160),
// each with its licence beside it, and nothing by @import.
for (const css of ALL.filter((f) => f.endsWith(".css"))) {
  const text = read(css);
  check(!/@import/i.test(text), `${css}: imports nothing`);
  for (const m of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
    const ref = m[1];
    check(!/^(https?:)?\/\//i.test(ref) && !/^data:/i.test(ref), `${css}: ${ref} is one of this site's own files`);
    if (!/^(https?:)?\/\//i.test(ref)) check(fs.existsSync(path.join(ROOT, path.dirname(css), ref)), `${css}: ${ref} exists`);
  }
}
const fontFiles = ALL.filter((f) => f.startsWith("fonts" + path.sep));
check(fontFiles.filter((f) => !/\.(woff2|txt)$/.test(f)).length === 0, "fonts/ holds only .woff2 files and their licences");
for (const [family, licence] of [["newsreader-", "OFL-Newsreader.txt"], ["ibm-plex-sans-", "OFL-IBM-Plex-Sans.txt"], ["ibm-plex-mono-", "OFL-IBM-Plex-Mono.txt"]]) {
  if (fontFiles.some((f) => path.basename(f).startsWith(family))) {
    check(fontFiles.includes(path.join("fonts", licence)) && /SIL Open Font License/.test(read(path.join("fonts", licence))), `fonts/${licence} ships beside the ${family.slice(0, -1)} files`);
  }
}

const keys = new Set(PAGES.flatMap((p) => [...read(p).matchAll(/\.css\?v=([\w.]+)/g)].map((m) => m[1])));
check(keys.size === 1, `every page uses the same ?v= key (found ${[...keys].join(", ") || "none"})`);

if (failures.length) {
  console.error(`${failures.length} failed, ${passed} passed:`);
  for (const f of failures) console.error("  ✗ " + f);
  process.exit(1);
}
console.log(`All ${passed} checks passed.`);
