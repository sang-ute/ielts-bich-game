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

## Two versions

| | Public site (GitHub Pages) | Class version (claude.ai) |
|---|---|---|
| Games | All | All |
| Speech input | Browser speech recognition (Chrome, Edge) | claude.ai dictation |
| Feedback on speaking and writing | Quick check of structure, length and key words | **AI judge**: band estimate, fixes, a stronger version |

- Public site: https://sang-ute.github.io/ielts-bich-game/
- Class version: https://claude.ai/artifact/WfkyKywkapCviNqJuL7cLR (opens for people the owner shares it with)

The AI judge runs on the viewer's own claude.ai account, so the public site doesn't need an API key.
`site/config.js` holds the link between the two versions.

## Edit the content

All questions are in [`site/content.js`](site/content.js). Each activity has a `kind`
(`mcq`, `fill`, `sort`, `match`, `order`, `speak` or `write`), and the file header
describes the fields. Push to `main` and GitHub Actions publishes the site.

## Run locally

Open `site/index.html` in a browser, or serve the folder:

```bash
npx serve site
```

Progress (XP, best scores, drafts) is stored in the browser's `localStorage`.
