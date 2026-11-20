# IELTS Practice Quest

A browser game built from the IELTS class materials for 11–19 November:

- **Homework (11 Nov):** prepositions *in / on / at* and food vocabulary
- **Lecture 2 (12 Nov):** advertising vocabulary, collocations and grammar
- **Speaking slides + Part 1 recording (18 Nov):** test format, A-R-E, OREO, tidiness questions
- **Writing slides (19 Nov):** essay types, PEEL, overviews, linkers, formal style

It has five lessons and 30 activities:

| Type | What students do |
|---|---|
| Q&A | Multiple choice, with keys A–D or 1–4 |
| Fill | Type the missing word, or tap it from a word box |
| Drag | Sort, match or order items. Works with a mouse, touch, or tap-to-place |
| Speak | Answer Part 1, 2 and 3 questions out loud or by typing |
| Write | Short Task 1 and Task 2 writing tasks |

- Public site: https://sang-ute.github.io/ielts-bich-game/
- Class version on claude.ai: https://claude.ai/artifact/WfkyKywkapCviNqJuL7cLR (opens for people the owner shares it with)

## The class script: scores and AI judge

The public site talks to one Google Apps Script ([`apps-script/Code.gs`](apps-script/Code.gs)),
attached to the class sheet **IELTS Practice Quest scores** in the IELTS_Bich Drive folder. It does two jobs:

1. **Scores.** Students type their first name once. Every finished activity, quick check and AI check
   adds a row to the sheet. The *By student* and *By activity* tabs summarise them.
   Only names and scores are saved: no answers, recordings or transcripts.
2. **AI judge.** When the script has an Anthropic API key, the speaking and writing tasks get a band
   estimate, fixes and a stronger version of the answer. The key stays in the script's private
   settings; the website never sees it. The script builds the judging prompt itself, so the
   endpoint only scores IELTS answers.

Without a key, the site falls back to the quick check (structure, length and key words).

### Set it up (once)

1. Open the sheet, then **Extensions > Apps Script**.
2. Replace the editor's contents with `apps-script/Code.gs` and save.
3. **Project Settings** (gear icon) > **Script properties** > add:

   | Property | Value |
   |---|---|
   | `ANTHROPIC_API_KEY` | A key from [console.anthropic.com](https://console.anthropic.com). Leave it out to keep only score tracking. |
   | `CLASS_CODE` | Optional. Students type it once before using the AI judge. |
   | `MODEL` | Optional. Default `claude-opus-5-5`. `claude-haiku-5-5` costs far less. |
   | `DAILY_LIMIT` | Optional. AI checks per day for the whole class. Default 300. |
   | `DEVICE_LIMIT` | Optional. AI checks per device every 6 hours. Default 40. |

4. **Deploy > New deployment**, choose **Web app**, set *Execute as: Me* and *Who has access: Anyone*, then **Deploy**.
5. Allow access when Google asks. Because the script is your own and unverified, Google shows a warning; choose **Advanced > Go to project**.
6. Copy the **Web app URL** (it ends in `/exec`) into `site/config.js` as `scriptUrl`, then push.

After changing the code later, use **Deploy > Manage deployments > Edit > Version: New version**
so the same URL serves it. Changing script properties needs no redeploy.

### Cost

Each AI check is one request to the Anthropic API, billed to the key's account. With the default
model (Claude Opus 5.5, $4 / $20 per million input / output tokens) a check uses roughly 1,500
input and 1,000 output tokens, about **$0.03**. The daily limit caps spending at about $9 a day with
the defaults. Setting `MODEL` to `claude-haiku-5-5` ($0.10 / $0.50) brings a check under $0.01.

Students don't log in, so anyone with the site can use it. The class code, the daily limit and the
per-device limit keep that in check; delete stray rows in the sheet if needed.

## Edit the content

All questions are in [`site/content.js`](site/content.js). Each activity has a `kind`
(`mcq`, `fill`, `sort`, `match`, `order`, `speak` or `write`), and the file header
describes the fields. Push to `main` and GitHub Actions publishes the site.

## Run locally

Open `site/index.html` in a browser, or serve the folder:

```bash
npx serve site
```

Progress (XP, best scores, drafts) is also stored in the browser's `localStorage`.
