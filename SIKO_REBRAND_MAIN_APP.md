# Siko rebrand — main macOS app

**Paste this entire file as the first message of a fresh Claude session started from `/Users/rohan/DeskCoach`.** It is self-contained — the receiving session has no knowledge of the prior brand-rename work and needs all of this context.

---

## Context

The macOS app at `/Users/rohan/DeskCoach` (working codename: "DeskCoach") is the actual product. Its public-facing brand has just been changed from **Magi** to **Siko**.

**Why the rename:** "Magi" turned out to be unsalvageable as a public brand in the AI space — the top Google result for "magi ai" is an AI-girlfriend generator, plus collisions with Sand AI's video model and a market-analytics platform called MAGI. Hard no for a K-12 product where parents are the buyer. After a multi-day brand search rejecting ~10 alternatives (Soch, Chalu, Padh, Padhai, and others — all already taken by Indian edtech brands or carrying slang baggage), the founder picked **Siko** — coined from ***sikhānā*** (Hindi: "to teach") using the Suno-style smoothing pattern (drop the difficult palatal cluster, end on a clean vowel).

**Canonical etymology — use this anywhere the name's origin is referenced:**

> The name **Siko** comes from *sikhānā* — Hindi for "to teach." A patient teacher, in software.

**What's already done:** The marketing site at `/Users/rohan/siko-web` (formerly `/Users/rohan/magi-web` — the directory was renamed) has been fully rebranded. Every "Magi" → "Siko" across all section components, code comments, CSS class names (`.magi-mark` → `.siko-mark`, `.magi-bubble` → `.siko-bubble`, `magiInlinePulse` → `sikoInlinePulse` keyframe), and the FAQ name-origin + About founder-note etymology rewritten using the sikhānā story above. Domain canonicalized to `trysiko.com`. Build passes clean.

**This task:** Apply the same rebrand to the macOS app codebase. The codebase internal codename ("DeskCoach") can stay — it's not user-visible. Every USER-VISIBLE "Magi" needs to become "Siko."

---

## Scope

### In scope (must change)

1. Every user-visible string in the app that says "Magi"
2. **All LLM prompts in `lib/prompts.js`** — these establish the AI's character as Magi; must become Siko. The voice itself is unchanged; only the name.
3. Email template branding (subject, body, footer in `main.js` → search `formatReportEmail`)
4. Onboarding screens — first-run experience that explains the app
5. Window titles (dashboard window, main window, any other Electron windows)
6. Menu bar / tray accessory label
7. Bubble copy, hint card meta, walkthrough cards — wherever the brand name literally appears
8. App display name: `package.json` (`productName` field) + electron-builder config + the generated `Info.plist`
9. README.md and all `.md` documentation (V1_SPEC, MISTAKE_DETECTION, STUCK_DETECTION, TESTING, etc.) — prose that's user-facing
10. CSS classes and animation names — match the renames already done in the web repo for visual-system consistency:
    - `.magi-bubble` → `.siko-bubble`
    - `.magi-mark` → `.siko-mark`
    - `magiInlinePulse` keyframe → `sikoInlinePulse`
    - Any other `magi-` prefixed identifier
11. Code comments referencing "Magi" — for consistency
12. Test fixtures and scenarios in `test/scenarios/` — search for "Magi" in expected outputs and assertions; tests will break otherwise

### Out of scope (do NOT change without explicit founder approval)

1. **The macOS bundle identifier.** Changing this makes the app look like a brand-new app to macOS — users would lose Screen Recording / Accessibility permissions, lose login-item status, and the app data folder would orphan. **Keep the existing bundle ID exactly as it is.**
2. **The Application Support data directory.** `~/Library/Application Support/Magi/` is where existing users have their session history, settings, and Patterns cache. **Do NOT just rename it to `Siko/`** — that orphans every existing user's data. Two options:
    - **(Preferred for now)** Keep using `Magi/` as the directory name. It's never user-visible. The rebrand is brand-level, not file-system-level.
    - **(Alternative, more work)** Add a one-time migration: on app start, if `~/Library/Application Support/Magi/` exists and `Siko/` doesn't, rename it. Test both fresh-install and upgrade paths.
    - **Recommendation: do option 1.** Surface this decision to the founder before doing option 2.
3. **The internal codename "DeskCoach."** Keep it for the repo name, branch names, internal architecture docs, the `package.json` `name` field, build script labels. Only the *public-facing* brand is Siko.
4. **App icon image files** (PNG/ICNS). The visual icon doesn't need to change. If filenames contain "magi" you can rename them for consistency, but the user can also defer that.
5. **Code-signing certificate name** — separate legal / Apple-Developer-account concern, not a rebrand task.

---

## Recommended workflow

1. **Read first, edit later.** Open `README.md`, `V1_SPEC.md`, and `lib/prompts.js` end-to-end before changing anything. The voice in those files is load-bearing — you need to understand it before doing a mass rename that risks disturbing tone.
2. **Run this grep** to get the full inventory:
   ```bash
   grep -rEni "\b(magi|miyagi)\b" /Users/rohan/DeskCoach \
     --include="*.js" --include="*.ts" --include="*.tsx" \
     --include="*.html" --include="*.css" --include="*.json" \
     --include="*.md" --include="*.plist" --include="*.yml" \
     2>/dev/null | grep -v node_modules | grep -v dist | grep -v build
   ```
3. **Categorize the hits** by file type before editing:
    - Docs/comments → safest, batch with `replace_all`
    - UI strings (HTML/JS) → batch with `replace_all`
    - **LLM prompts → manual review per prompt.** The character framing needs to translate cleanly to "Siko"; if any prompt currently references the Karate Kid / Mr. Miyagi etymology, replace it with the sikhānā etymology above.
    - `formatReportEmail` in `main.js` → manual; pay attention to the footer line and the email subject.
    - Test scenarios → likely to need test-expected-output updates.
4. **Replace systematically by case:**
    - Replace `Magi` (capital) → `Siko`
    - Replace `magi` (lowercase, only where it's the brand name — e.g., CSS classes; **do not blindly rename `magi.study` URLs** since they're being changed separately to `trysiko.com`)
    - Replace `Miyagi` / `Mr. Miyagi` → use the new etymology
5. **The email-sender address** changes too:
    - Old: `Magi <reports@magi.study>`
    - New: `Siko <reports@trysiko.com>`
    - **Caveat:** `trysiko.com` is the founder's planned new domain (registered on Cloudflare Registrar). Until the founder also (a) buys it and (b) verifies it in Resend with DNS records, this `From` address will bounce. **Flag this prominently in your final report.** Either keep the old `reports@magi.study` until DNS is set up, or change the code now and tell the founder the email is broken until DNS lands.
6. **Run the test suite** (`npm test` or whatever the convention is in this codebase). Fix any tests that broke on the string changes.
7. **Launch the app** if you can. Verify the menu bar, dashboard window title, and bubble copy all show "Siko."

---

## Detailed inventory by file category

### Category 1: LLM prompts (`lib/prompts.js`) — highest stakes

This file establishes the AI's character. Every prompt that frames the AI as "Magi" (e.g., system prompts like "You are Magi, a patient Socratic teacher...") needs to become "You are Siko..." The pedagogical posture and voice are unchanged.

**Specifically watch for:**
- Character-framing system prompts (highest priority)
- Any prompt that includes the etymology — replace any Mr. Miyagi / Karate Kid mention with the sikhānā etymology
- Few-shot examples that have "Magi" in the assistant outputs
- The "refuses to give answers" framing — keep it exactly, just swap the name

### Category 2: Email report (`main.js`)

Search for `formatReportEmail`. The footer line specifically:

- Old: *"Magi refuses to give answers — every hint above is a Socratic question or nudge that asks [name] to do the thinking."*
- New: *"Siko refuses to give answers — every hint above is a Socratic question or nudge that asks [name] to do the thinking."*

The email subject line, the email "From" name, the eyebrow "Magi · Study session report" line.

### Category 3: UI surfaces

`overlay.html`, `overlay.js`, `dashboard.html`, `dashboard.js`, `onboarding.html` (or wherever the first-run flow lives).

- Bubble copy: most state copy is generic ("here when you need me") and doesn't reference the brand name. But search for any hardcoded "Magi" in string concatenations or template literals.
- Hint card meta tag (top-left), footer copy ("press ⌘⇧Space for a deeper hint")
- Walkthrough card title and finish lines
- Dashboard window: title was "Magi — Patterns" → "Siko — Patterns"
- Menu bar / tray accessory: if the title literally says "Magi", change to "Siko"

### Category 4: Onboarding

The first-run flow likely has an explainer screen and possibly a name-etymology mention. Use the sikhānā story.

### Category 5: Package metadata

- `package.json` → likely `productName: "Magi"` or `name: "magi"` — change to `productName: "Siko"`. The `name` field can stay as the internal codename (`deskcoach` if that's what it is).
- `electron-builder.yml` / `electron-builder.json` / `electron-builder.config.js` → `productName` field controls what shows in the Applications folder and the About dialog
- Any generated `Info.plist` → `CFBundleDisplayName: "Siko"`. `CFBundleName` typically follows.

### Category 6: Documentation

`README.md`, `V1_SPEC.md`, `MISTAKE_DETECTION.md`, `STUCK_DETECTION.md`, `TESTING.md`, anything in a `docs/` folder, anything in a `notes/` folder.

User-facing prose: "Magi" → "Siko." Internal architecture notes that say "DeskCoach observer cadence" — that can stay because DeskCoach is the kept internal codename.

### Category 7: CSS class names

Search for `magi-` prefix. Most likely:
- `.magi-bubble` (corner bubble)
- `.magi-mark` (yellow highlight)
- Any keyframe with "magi" in its name

Match what was done in the web repo for cross-codebase consistency.

### Category 8: Tests

`test/scenarios/` and any unit-test files. Search for "Magi" in:
- Expected output assertions
- Fixture data
- Mocked LLM responses
- Test descriptions

Update so tests pass against the rebranded prompts.

---

## Verification checklist

After the rename, confirm:

- [ ] `grep -rEni "\b(magi|miyagi)\b" /Users/rohan/DeskCoach --include="*.js" --include="*.ts" --include="*.html" --include="*.css" --include="*.json" --include="*.md"` returns only:
    - The internal codename "DeskCoach" (kept)
    - The bundle ID (kept)
    - The Application Support folder path if you went with the "keep `Magi/` for now" option (intentional retain — comment to mark it)
    - Nothing else.
- [ ] The app launches.
- [ ] Menu bar / tray shows "Siko."
- [ ] Dashboard window title shows "Siko — Patterns."
- [ ] A test session end-to-end (boot → ⌘⇧Space → hint → walkthrough → close) shows "Siko" everywhere a brand string appears.
- [ ] The session-end report email subject + body + footer say "Siko."
- [ ] Onboarding (if you can trigger it in a fresh-state launch) shows "Siko" and the sikhānā etymology where the name origin is explained.
- [ ] `npm test` passes.
- [ ] App icon loads (no broken image references from filename renames).

---

## Things to flag to the founder when done

1. **Application Support directory decision** — confirm: keeping `Magi/` directory (recommended) or migrating to `Siko/` with one-time-rename code (more work, breakage risk)?
2. **Email infrastructure status** — `reports@trysiko.com` only works once the founder:
    - Buys `trysiko.com` from Cloudflare Registrar (planned ~$10.46/yr)
    - Verifies the domain in Resend (DNS records: SPF, DKIM, DMARC)
    - Until then: either keep using `reports@magi.study` (if that domain is still active) OR understand that report emails are broken until DNS lands.
3. **Bundle identifier** — left untouched; correct call for now; flag if revisit is ever wanted.
4. **App icon images** — if filenames contain "magi", confirm whether to rename or leave.
5. **GitHub repo name** — if the repo is `magi-app` or similar, the founder may want to rename to `siko-app` or `deskcoach` (matching the codename). Out of scope for this task, but flag.
6. **Code-signing / notarization** — if the existing certificate/profile is named for Magi LLC or similar, that's a separate legal-entity question. Not a rebrand task.

---

## Brand voice reminder

The voice is **unchanged** across the rename:

- Lowercase, em-dashed, kid-warm
- Calm + warm + specific. Never excited, never shouty, never patronizing
- Phrase as questions or gentle prompts, not declarations
- Signature lines (preserve verbatim):
    - "ready when you are"
    - "here when you need me" / "just say the word"
    - "done with that? tap to check"
    - "looks right — keep going"
    - "I noticed something — tap for a hint"
    - "Try one with me →"
    - "Let's come back to this once you've had a chance to review — I'll be here."

If you find yourself rewriting copy "to fit Siko better," **stop.** The voice predates the name; the rename should be invisible in tone.

---

## Founder collaboration preferences

(Carried over from the working relationship — these still apply.)

- Align on plans before code if the change is structural. For a mostly mechanical rename, you can plow ahead and report.
- Pull from the actual product files (`lib/prompts.js`, the email template in `main.js`, the bubble copy in `overlay.js`) rather than improvising tone.
- Decisive recommendations beat option-buffets. When a decision is genuinely the founder's call (e.g., the Application Support directory migration), surface it cleanly with a recommendation.
- Cut to short responses once the founder has said "ship it" or equivalent.
