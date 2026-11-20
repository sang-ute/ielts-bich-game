/* IELTS Practice Quest: game engine.
 * Runs as a plain static site (GitHub Pages) and as a claude.ai artifact.
 * Inside claude.ai it lights up the AI judge (sample), dictation and voice (tts);
 * elsewhere it falls back to the browser's speech recognition and a quick, non-AI check. */
(function () {
  "use strict";
  var Q = window.QUEST;
  var CFG = window.QUEST_CONFIG || {};
  var app = document.getElementById("app");

  // ------------------------------------------------------------ helpers
  function h(tag, props) {
    var el = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v == null || v === false) return;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k.slice(0, 2) === "on" && typeof v === "function") el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { append(el, k); }); return; }
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function norm(s) {
    return String(s || "").toLowerCase().replace(/[‘’`]/g, "'").replace(/[.!?,;:]+$/g, "").replace(/\s+/g, " ").trim();
  }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function starsFor(ratio) { return ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.4 ? 1 : 0; }
  function starEl(n, of) {
    var s = h("span", { class: "stars", "aria-label": n + " of " + (of || 3) + " stars" });
    for (var i = 0; i < (of || 3); i++) s.append(h("span", { class: i < n ? "" : "off" }, "★"));
    return s;
  }
  function fmtTime(sec) { sec = Math.max(0, Math.floor(sec)); return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0"); }
  function roundBand(x) { return Math.round(x * 2) / 2; }
  function wordsOf(text) { return (String(text).match(/[A-Za-z][A-Za-z'\-]*/g) || []); }

  // ------------------------------------------------------------ storage (per browser)
  var KEY = "ielts-quest-v1";
  var S = (function () {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s && typeof s === "object") return { xp: s.xp | 0, best: s.best || {}, drafts: s.drafts || {}, name: typeof s.name === "string" ? s.name : "", pid: typeof s.pid === "string" ? s.pid : "", code: typeof s.code === "string" ? s.code : "" };
    } catch (e) { /* storage blocked */ }
    return { xp: 0, best: {}, drafts: {}, name: "", pid: "", code: "" };
  })();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }
  function addXP(n) { S.xp += n; save(); var p = document.getElementById("xp-pill"); if (p) p.textContent = "★ " + S.xp + " XP"; }

  // ------------------------------------------------------------ class score sheet (public site only)
  // Pages inside claude.ai can't reach other sites, so only the public site reports scores.
  var SCRIPT_URL = CFG.scriptUrl || CFG.scoresUrl || "";
  var TRACK = !!SCRIPT_URL && !(window.claude && typeof window.claude.use === "function");
  var editName = false;
  function report(row) {
    if (!TRACK || !S.name) return Promise.resolve(false);
    var body = JSON.stringify(Object.assign({ name: S.name, pid: devicePid() }, row));
    try {
      return fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: body })
        .then(function () { return true; }, function () { return false; });
    } catch (e) { return Promise.resolve(false); }
  }
  function devicePid() { if (!S.pid) { S.pid = Math.random().toString(36).slice(2, 8); save(); } return S.pid; }
  function cleanName(v) { return String(v || "").replace(/\s+/g, " ").trim().slice(0, 40); }
  function nameForm(onSaved, label) {
    var input = h("input", { class: "name-input", id: "player-name", type: "text", maxlength: "40", autocomplete: "given-name", placeholder: "Your first name", "aria-label": "Your name" });
    input.value = S.name || "";
    return h("form", { class: "name-form", onsubmit: function (e) {
      e.preventDefault();
      var v = cleanName(input.value);
      if (!v) { input.focus(); return; }
      S.name = v; save(); paintNamePill();
      if (onSaved) onSaved(v);
    } }, input, h("button", { class: "btn primary", type: "submit" }, label || "Save"));
  }
  function paintNamePill() {
    var p = document.getElementById("name-pill");
    if (!p) return;
    p.hidden = !S.name;
    p.textContent = S.name ? S.name + " · change" : "";
  }
  function sendStatus(row) {
    if (!TRACK) return null;
    var el = h("div", { class: "send-status", "aria-live": "polite" });
    function send() {
      el.replaceChildren(h("span", { class: "note" }, "Sending to your teacher…"));
      report(row).then(function (ok) {
        el.replaceChildren(ok ? h("p", { class: "hand sent" }, "Sent to your teacher ✓")
          : h("p", { class: "note" }, "This score didn't send. Check your internet connection, then play again."));
      });
    }
    if (S.name) send();
    else el.replaceChildren(h("p", { class: "note" }, "Add your name to send this score to your teacher."), nameForm(send, "Send score"));
    return el;
  }
  function cheer(ratio) {
    var n = S.name ? ", " + S.name : "";
    return ratio >= 0.9 ? "Brilliant" + n + "!" : ratio >= 0.7 ? "Nice work" + n + "!" : ratio >= 0.4 ? "Getting there" + n + "!" : "Keep going" + n + ". You've got this!";
  }

  // ------------------------------------------------------------ claude.ai capabilities
  var AI = { status: window.claude && typeof window.claude.use === "function" ? "pending" : "off", sample: null, dictation: null, tts: null };
  var aiListeners = [];
  function aiChanged() { aiListeners.slice().forEach(function (f) { try { f(); } catch (e) { /* view gone */ } }); }
  if (AI.status === "pending") {
    window.claude.use("sample").then(function (s) { AI.sample = s; AI.status = s ? "on" : "off"; aiChanged(); }, function () { AI.status = "off"; aiChanged(); });
    window.claude.use("dictation").then(function (d) { AI.dictation = d; aiChanged(); }, function () {});
    window.claude.use("tts").then(function (t) { AI.tts = t; }, function () {});
  }
  var SRClass = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  if (TRACK) {
    AI.status = "pending";
    fetch(SCRIPT_URL + "?action=status").then(function (r) { return r.json(); }).then(function (st) {
      AI.remote = !!(st && st.ai); AI.needsCode = !!(st && st.needsCode);
      AI.status = AI.remote ? "on" : "off"; aiChanged();
    }, function () { AI.status = "off"; aiChanged(); });
  }

  // ------------------------------------------------------------ index
  var UNITS = Q.units, ACT = {}, ACT_UNIT = {}, TASK = {}, TASK_UNIT = {}, TASK_ACT = {};
  UNITS.forEach(function (u) {
    u.activities.forEach(function (a) {
      ACT[a.id] = a; ACT_UNIT[a.id] = u;
      (a.tasks || []).forEach(function (t) { TASK[t.id] = t; TASK_UNIT[t.id] = u; TASK_ACT[t.id] = a; t.kind = a.kind; });
    });
  });
  var TAGS = { mcq: "Q&A", fill: "Fill", sort: "Drag", match: "Match", order: "Order", speak: "Speak", write: "Write" };
  function unitVars(u) { return "--u: var(--" + u.color + ")"; }
  function isAuto(a) { return a.kind !== "speak" && a.kind !== "write"; }
  function bestStars(id) { var b = S.best[id]; return b && b.total ? starsFor(b.score / b.total) : 0; }

  // ------------------------------------------------------------ shell + routing
  var disposers = [];
  function cleanup() {
    var d = disposers; disposers = []; d.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); aiListeners = [];
    setKeys(null);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
  function aiPill() {
    var p = h("span", { id: "ai-pill", class: "pill" });
    function paint() {
      if (AI.status === "on") { p.className = "pill ai"; p.textContent = "AI judge on"; p.hidden = false; }
      else if (AI.status === "off") { p.className = "pill noai"; p.textContent = "Quick check mode"; p.hidden = false; }
      else p.hidden = true;
    }
    paint(); aiListeners.push(paint);
    return p;
  }
  function shell() {
    var kids = Array.prototype.slice.call(arguments);
    var top = h("header", { class: "topbar" },
      h("button", { class: "brand", type: "button", "aria-label": Q.title + ", home", onclick: function () { go("home"); } },
        h("span", { class: "brand-mark", "aria-hidden": "true" }, h("i"), h("i"), h("i")),
        h("span", { class: "brand-name" }, Q.title)),
      h("div", { class: "top-meta" },
        h("button", { class: "pill name", id: "name-pill", type: "button", hidden: !S.name, onclick: function () { editName = true; go("home"); } }, S.name ? S.name + " · change" : ""),
        h("span", { class: "pill" }, Q.dates), aiPill(), h("span", { class: "pill xp", id: "xp-pill" }, "★ " + S.xp + " XP")));
    var foot = h("footer", { class: "footer" },
      "Built from the class slides, homework and lecture notes. " + (TRACK ? "When you finish an activity, your score goes to your teacher's sheet." : "Progress is saved in this browser only."),
      AI.status === "off" && CFG.classUrl ? [" ", h("a", { href: CFG.classUrl, target: "_blank", rel: "noopener" }, "Open the class version with the AI judge.")] : null,
      AI.status !== "off" && CFG.siteUrl ? [" Public version: ", h("a", { href: CFG.siteUrl, target: "_blank", rel: "noopener" }, CFG.siteUrl.replace(/^https?:\/\//, ""))] : null);
    app.replaceChildren(top, h("main", { id: "main" }, kids), foot);
    window.scrollTo(0, 0);
  }
  function go(hash) { if (location.hash === "#" + hash) route(); else location.hash = hash; }
  function backBtn(hash, label) { return h("button", { class: "back", type: "button", onclick: function () { go(hash); } }, "← ", label); }
  function route() {
    cleanup();
    var r = location.hash.replace(/^#/, ""), m;
    if (!r || r === "home") return renderHome();
    if ((m = r.match(/^unit-([a-z0-9-]+)$/))) return renderUnit(m[1]);
    if ((m = r.match(/^play-([a-z0-9-]+)$/))) return startActivity(m[1]);
    if ((m = r.match(/^task-([a-z0-9-]+)$/))) return renderTask(m[1]);
    if (r === "judge") return renderJudgeHub();
    if (r === "mixed") return startMixed();
    renderHome();
  }

  // ------------------------------------------------------------ home
  function renderHome() {
    var acts = 0; UNITS.forEach(function (u) { acts += u.activities.length; });
    var judgeSub = h("span", { class: "action-sub" });
    function paintSub() {
      judgeSub.textContent = AI.status === "on" ? "Speak or type an answer. The AI judge gives a band estimate, fixes and a better version."
        : "Speak or type an answer and check its structure, length and key words.";
    }
    paintSub(); aiListeners.push(paintSub);
    var greet;
    if (!S.name || editName) {
      var changing = !!S.name;
      editName = false;
      greet = h("div", { class: "name-card" },
        h("p", { class: "hand big" }, changing ? "Who's playing now?" : "Hi there! What's your name?"),
        nameForm(function () { go("home"); }, changing ? "Save" : "Let's go"),
        h("p", { class: "note" }, TRACK ? "Your teacher will see your name next to your scores." : "We'll use it to cheer you on. It stays in this browser."));
    } else greet = h("p", { class: "hand big greet" }, "Hi, " + S.name + "!");
    shell(
      h("section", { class: "hero" }, greet, h("h1", null, "This week's lessons"),
        h("p", { class: "lede" }, "Every round comes from the class slides, the homework and the lecture notes. Play a lesson, beat your best score, then practise speaking with the judge.")),
      h("div", { class: "actions" },
        h("button", { class: "action", type: "button", onclick: function () { go("mixed"); } },
          h("span", { class: "action-title" }, "Mixed challenge"), h("span", { class: "action-sub" }, "10 random questions from every lesson. A quick warm-up for class.")),
        h("button", { class: "action judge", type: "button", onclick: function () { go("judge"); } },
          h("span", { class: "action-title" }, "Speaking judge"), judgeSub)),
      h("div", { class: "section-head" }, h("h2", null, "Lessons"), h("span", { class: "note" }, UNITS.length + " lessons · " + acts + " activities")),
      h("div", { class: "units" }, UNITS.map(function (u, i) {
        var auto = u.activities.filter(isAuto), got = 0;
        auto.forEach(function (a) { got += bestStars(a.id); });
        return h("button", { class: "unit-card", type: "button", style: unitVars(u), onclick: function () { go("unit-" + u.id); } },
          h("span", { class: "unit-num", "aria-hidden": "true" }, String(i + 1)),
          h("span", { class: "unit-title" }, u.title),
          h("span", { class: "unit-sub" }, u.subtitle),
          h("span", { class: "unit-meta" }, h("span", null, u.source), h("span", null, u.activities.length + " activities"),
            h("span", { "aria-label": got + " of " + auto.length * 3 + " stars" }, h("span", { class: "stars" }, "★"), " " + got + "/" + auto.length * 3)));
      })));
  }

  // ------------------------------------------------------------ unit page
  function renderUnit(id) {
    var u = UNITS.filter(function (x) { return x.id === id; })[0];
    if (!u) return renderHome();
    shell(h("div", { style: unitVars(u) },
      backBtn("home", "All lessons"),
      h("div", { class: "unit-head" }, h("span", { class: "unit-num", "aria-hidden": "true" }, String(UNITS.indexOf(u) + 1)),
        h("div", null, h("p", { class: "eyebrow" }, u.source), h("h1", null, u.title), h("p", { class: "lede" }, u.subtitle))),
      h("div", { class: "act-list" }, u.activities.map(function (a) { return actRow(u, a); }))));
  }
  function actRow(u, a) {
    var tag = h("span", { class: "tag " + a.kind }, TAGS[a.kind]);
    if (!isAuto(a)) {
      return h("div", { class: "act" }, tag,
        h("div", { class: "act-body" }, h("div", { class: "act-title" }, a.title), h("div", { class: "act-intro" }, a.intro)),
        h("span"),
        h("div", { class: "tasks" }, a.tasks.map(function (t) {
          var b = S.best["task:" + t.id];
          return h("button", { class: "task-chip", type: "button", onclick: function () { go("task-" + t.id); } }, t.title, b && b.band != null ? " · " + b.band.toFixed(1) : "");
        })));
    }
    var b = S.best[a.id];
    return h("div", { class: "act" }, tag,
      h("div", { class: "act-body" }, h("div", { class: "act-title" }, a.title), h("div", { class: "act-intro" }, a.intro),
        b ? h("div", { class: "act-best" }, starEl(bestStars(a.id)), " Best " + b.score + "/" + b.total) : null),
      h("button", { class: "btn small primary", type: "button", onclick: function () { go("play-" + a.id); } }, b ? "Play again" : "Play"));
  }

  // ------------------------------------------------------------ runner
  function stepsFor(a) {
    if (a.kind === "mcq" || a.kind === "fill") return a.items.map(function (it) { return { kind: a.kind, item: it, bank: a.bank, points: 1 }; });
    return a.rounds.map(function (r) {
      return { kind: a.kind, round: r, points: a.kind === "sort" ? r.items.length : a.kind === "match" ? r.pairs.length : r.items.length };
    });
  }
  function startActivity(id) {
    var a = ACT[id];
    if (!a) return renderHome();
    var u = ACT_UNIT[id];
    if (!isAuto(a)) return go("unit-" + u.id);
    var i = u.activities.indexOf(a), next = null;
    for (var k = i + 1; k < u.activities.length; k++) { if (isAuto(u.activities[k])) { next = u.activities[k]; break; } }
    runSteps({ title: a.title, intro: a.intro, unit: u, steps: stepsFor(a), back: "unit-" + u.id, backLabel: u.title, saveId: a.id, again: "play-" + a.id, next: next, type: TAGS[a.kind] });
  }
  function startMixed() {
    var pool = [];
    UNITS.forEach(function (u) {
      u.activities.forEach(function (a) {
        if (a.kind === "mcq" || a.kind === "fill") a.items.forEach(function (it) { pool.push({ kind: a.kind, item: it, bank: a.bank, points: 1, label: u.title, unit: u }); });
      });
    });
    runSteps({ title: "Mixed challenge", intro: "Questions from every lesson.", steps: shuffle(pool).slice(0, 10), back: "home", backLabel: "Home", saveId: "mixed", again: "mixed", type: "Mixed" });
  }
  function runSteps(cfg) {
    var total = cfg.steps.reduce(function (s, x) { return s + x.points; }, 0);
    var st = { i: 0, score: 0, wrong: [] };
    var meta = h("div", { class: "play-meta" }), fill = h("i"), stage = h("div");
    var bar = h("div", { class: "bar", role: "progressbar", "aria-label": "Progress", "aria-valuemin": "0", "aria-valuemax": String(cfg.steps.length) }, fill);
    var wrap = h("div", { style: cfg.unit ? unitVars(cfg.unit) : null },
      backBtn(cfg.back, cfg.backLabel),
      h("div", { class: "play-head" }, h("h2", null, cfg.title), meta, bar),
      stage);
    shell(wrap);
    function paint() {
      meta.replaceChildren(h("span", null, "Step " + Math.min(st.i + 1, cfg.steps.length) + " of " + cfg.steps.length), h("span", null, "Score " + st.score + " / " + total));
      fill.style.width = (st.i / cfg.steps.length) * 100 + "%";
      bar.setAttribute("aria-valuenow", String(st.i));
    }
    function next() {
      if (st.i >= cfg.steps.length) return finish();
      paint();
      var step = cfg.steps[st.i];
      if (step.unit) wrap.setAttribute("style", unitVars(step.unit));
      var view = renderStep(step, function (pts, wrong) { st.score += pts; if (wrong) st.wrong.push(wrong); paint(); },
        function () { st.i++; next(); }, st.i === cfg.steps.length - 1);
      stage.replaceChildren(view);
      var first = view.querySelector("input, .option, .chip");
      if (first) first.focus({ preventScroll: true });
    }
    function finish() {
      fill.style.width = "100%";
      meta.replaceChildren(h("span", null, "Finished"), h("span", null, "Score " + st.score + " / " + total));
      if (cfg.unit) wrap.setAttribute("style", unitVars(cfg.unit)); else wrap.removeAttribute("style");
      var ratio = total ? st.score / total : 0, gained = st.score * 10;
      var prev = S.best[cfg.saveId], isBest = !prev || st.score / total > prev.score / prev.total;
      if (isBest) S.best[cfg.saveId] = { score: st.score, total: total };
      addXP(gained);
      var msg = ratio >= 0.9 ? "Excellent work." : ratio >= 0.7 ? "A few to review below." : ratio >= 0.4 ? "Review the answers below and try again." : "Read the explanations, then play again.";
      stage.replaceChildren(h("div", { class: "card result" },
        h("p", { class: "eyebrow" }, isBest && prev ? "New best score" : "Your score"),
        h("div", { class: "score-big" }, String(st.score), h("small", null, " / " + total)),
        starEl(starsFor(ratio)),
        h("p", { class: "hand big" }, cheer(ratio)),
        h("p", null, msg + " +" + gained + " XP."),
        sendStatus({ lesson: cfg.unit ? cfg.unit.title : "Mixed", activity: cfg.title, type: cfg.type || "", score: st.score, total: total, details: st.wrong.length ? st.wrong.length + " to review" : "all correct" }),
        st.wrong.length ? h("div", { class: "review" }, h("h3", null, "Review"), st.wrong.map(function (w) {
          return h("div", { class: "review-item" }, h("div", null, w.q), h("div", null, "You: " + w.your + " · ", h("span", { class: "right" }, w.right)));
        })) : null,
        h("div", { class: "next-row" },
          h("button", { class: "btn", type: "button", onclick: function () { go(cfg.back); } }, "Back to " + cfg.backLabel.toLowerCase()),
          h("button", { class: "btn", type: "button", onclick: function () { go(cfg.again); } }, "Play again"),
          cfg.next ? h("button", { class: "btn primary", type: "button", onclick: function () { go("play-" + cfg.next.id); } }, "Next: " + cfg.next.title) : null)));
      stage.querySelector(".btn.primary, .btn").focus({ preventScroll: true });
    }
    next();
  }
  function renderStep(step, onScore, onNext, isLast) {
    var view = step.kind === "mcq" ? mcqStep(step, onScore, onNext, isLast)
      : step.kind === "fill" ? fillStep(step, onScore, onNext, isLast)
      : boardStep(step, onScore, onNext, isLast);
    if (step.label) view.prepend(h("p", { class: "eyebrow" }, step.label));
    return view;
  }
  function nextButton(isLast, onNext) { return h("button", { class: "btn primary", type: "button", onclick: onNext }, isLast ? "See results" : "Next →"); }
  function blankify(text) {
    var parts = String(text).split("___"), out = [];
    parts.forEach(function (p, i) { out.push(p); if (i < parts.length - 1) out.push(h("span", { class: "blank", "aria-label": "blank" }, "?")); });
    return out;
  }
  function feedback(el, ok, explain, extra) {
    el.hidden = false;
    el.className = "feedback " + (ok ? "good" : "bad");
    el.replaceChildren(h("span", { class: "verdict" }, ok ? "Correct. " : "Not quite. "), extra ? h("strong", null, extra + " ") : null, explain || "");
  }

  // ---- multiple choice
  var keyHandler = null;
  function setKeys(fn) {
    if (keyHandler) document.removeEventListener("keydown", keyHandler);
    keyHandler = fn;
    if (fn) document.addEventListener("keydown", fn);
  }
  function mcqStep(step, onScore, onNext, isLast) {
    var it = step.item, right = [].concat(it.answer), done = false;
    var fb = h("div", { class: "feedback", hidden: true, role: "status" });
    var nb = nextButton(isLast, function () { setKeys(null); onNext(); });
    var nextRow = h("div", { class: "next-row", hidden: true }, nb);
    var opts = it.options.map(function (o, idx) {
      return h("button", { class: "option", type: "button", onclick: function () { choose(idx); } },
        h("span", { class: "key", "aria-hidden": "true" }, String.fromCharCode(65 + idx)), h("span", null, o));
    });
    function choose(idx) {
      if (done) return;
      done = true; setKeys(null);
      var ok = right.indexOf(idx) >= 0;
      opts.forEach(function (b, j) {
        b.disabled = true;
        if (right.indexOf(j) >= 0) b.classList.add("correct"); else if (j === idx) b.classList.add("wrong"); else b.classList.add("dim");
      });
      var rightText = right.map(function (j) { return it.options[j]; }).join(" or ");
      feedback(fb, ok, it.explain, ok ? null : "Answer: " + rightText + ".");
      onScore(ok ? 1 : 0, ok ? null : { q: it.q, your: it.options[idx], right: rightText });
      nextRow.hidden = false; nb.focus({ preventScroll: true });
    }
    setKeys(function (e) {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      var k = e.key.toUpperCase(), idx = "ABCDEF".indexOf(k);
      if (idx < 0) idx = "123456".indexOf(e.key);
      if (idx >= 0 && idx < opts.length) { e.preventDefault(); choose(idx); }
    });
    return h("div", { class: "card" }, h("p", { class: "q-text" }, blankify(it.q)), h("div", { class: "options" }, opts), fb, nextRow);
  }

  // ---- fill in the blank
  function fillStep(step, onScore, onNext, isLast) {
    setKeys(null);
    var it = step.item, done = false, parts = it.q.split("___");
    var input = h("input", { class: "gap-input", type: "text", id: "gap-input", autocomplete: "off", autocapitalize: "off", spellcheck: "false", "aria-label": "Your answer" });
    var fb = h("div", { class: "feedback", hidden: true, role: "status" });
    var nb = nextButton(isLast, onNext);
    var nextRow = h("div", { class: "next-row", hidden: true }, nb);
    var check = h("button", { class: "btn primary", type: "button", onclick: submit }, "Check");
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); if (!done) submit(); } });
    function submit() {
      if (done) return;
      if (!norm(input.value)) { input.focus(); return; }
      done = true;
      var ok = it.answers.some(function (a) { return norm(a) === norm(input.value); });
      input.readOnly = true; input.classList.add(ok ? "ok" : "no"); check.hidden = true;
      var also = it.answers.length > 1 ? " (also accepted: " + it.answers.slice(1).join(", ") + ")" : "";
      feedback(fb, ok, it.explain, ok ? (also ? "Also accepted: " + it.answers.filter(function (a) { return norm(a) !== norm(input.value); }).join(", ") + "." : null) : "Answer: " + it.answers[0] + also + ".");
      onScore(ok ? 1 : 0, ok ? null : { q: it.q, your: input.value, right: it.answers[0] });
      nextRow.hidden = false; nb.focus({ preventScroll: true });
    }
    return h("div", { class: "card" },
      h("p", { class: "q-text" }, parts[0], input, parts.slice(1).join("___")),
      step.bank ? h("div", { class: "bank", "aria-label": "Word box" }, step.bank.map(function (w) {
        return h("button", { type: "button", onclick: function () { if (!done) { input.value = w; input.focus(); } } }, w);
      })) : null,
      h("div", { class: "next-row" }, check), fb, nextRow);
  }

  // ---- drag and drop: sort (buckets), match and order (single slots)
  function boardStep(step, onScore, onNext, isLast) {
    setKeys(null);
    var kind = step.kind, r = step.round, multi = kind === "sort", zones, chips;
    if (kind === "sort") {
      zones = r.buckets.map(function (b, i) { return { id: "z" + i, label: b }; });
      chips = r.items.map(function (p, i) { return { id: "c" + i, text: p[0], bucket: p[1] }; });
    } else if (kind === "match") {
      zones = r.pairs.map(function (p, i) { return { id: "z" + i, label: p[0], accept: [p[1]].concat(p[2] || []), main: p[1] }; });
      chips = r.pairs.map(function (p, i) { return { id: "c" + i, text: p[1] }; });
    } else {
      zones = r.items.map(function (t, i) { return { id: "z" + i, label: r.slots ? r.slots[i] : String(i + 1), accept: [t], main: t }; });
      chips = r.items.map(function (t, i) { return { id: "c" + i, text: t }; });
    }
    var order = shuffle(chips);
    if (order.length > 1 && order.every(function (c, i) { return c === chips[i]; })) order = order.slice(1).concat(order[0]);
    chips = order;
    var place = {}, results = null, selected = null, locked = false, lastDrag = 0;
    chips.forEach(function (c) { place[c.id] = null; });

    var pool = h("div", { class: "pool", "data-zone": "pool", role: "group", "aria-label": "Items to place" });
    var zoneBoxes = {};
    var zonesEl = multi ? h("div", { class: "buckets" }) : h("div", { class: "slots" });
    zones.forEach(function (z) {
      if (multi) {
        var items = h("div", { class: "bucket-items" });
        var b = h("div", { class: "bucket", "data-zone": z.id, role: "button", tabindex: "0", "aria-label": "Box " + z.label }, h("span", { class: "bucket-label" }, z.label), items);
        zoneBoxes[z.id] = { el: b, box: items };
        zonesEl.append(b);
      } else {
        var s = h("div", { class: "slot", "data-zone": z.id, role: "button", tabindex: "0", "aria-label": "Slot for " + z.label });
        zoneBoxes[z.id] = { el: s, box: s };
        zonesEl.append(h("div", { class: "slot-row" }, h("div", { class: "slot-label" }, z.label), s));
      }
    });
    function zoneActivate(zid) {
      if (locked || !selected) return;
      placeChip(selected, zid);
    }
    Object.keys(zoneBoxes).forEach(function (zid) {
      var el = zoneBoxes[zid].el;
      el.addEventListener("click", function (e) { if (e.target.closest(".chip")) return; zoneActivate(zid); });
      el.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && !e.target.closest(".chip")) { e.preventDefault(); zoneActivate(zid); } });
    });
    pool.addEventListener("click", function (e) { if (e.target.closest(".chip")) return; if (!locked && selected && place[selected]) placeChip(selected, "pool"); });

    var fb = h("div", { class: "feedback", hidden: true, role: "status" });
    var nb = nextButton(isLast, onNext);
    var nextRow = h("div", { class: "next-row", hidden: true }, nb);
    var resetBtn = h("button", { class: "btn", type: "button", onclick: function () { if (locked) return; chips.forEach(function (c) { place[c.id] = null; }); selected = null; render(); } }, "Reset");
    var checkBtn = h("button", { class: "btn primary", type: "button", onclick: check }, "Check");
    var checkRow = h("div", { class: "next-row" }, resetBtn, checkBtn);

    function placeChip(cid, zid) {
      if (zid === "pool") zid = null;
      if (zid && !multi) {
        Object.keys(place).forEach(function (k) { if (place[k] === zid && k !== cid) place[k] = place[cid]; });
      }
      place[cid] = zid; selected = null; render();
      var moved = document.querySelector('.chip[data-chip="' + cid + '"]');
      if (moved) moved.focus({ preventScroll: true });
    }
    function chipEl(c) {
      var el = h("button", { class: "chip", type: "button", "data-chip": c.id, "aria-pressed": selected === c.id ? "true" : "false" }, c.text);
      if (selected === c.id) el.classList.add("selected");
      if (results) el.classList.add(results[c.id] ? "ok" : "no");
      el.addEventListener("click", function () {
        if (locked || performance.now() - lastDrag < 350) return;
        selected = selected === c.id ? null : c.id; render();
        var again = document.querySelector('.chip[data-chip="' + c.id + '"]'); if (again) again.focus({ preventScroll: true });
      });
      attachDrag(el, c.id);
      return el;
    }
    function attachDrag(el, cid) {
      var pid = null, sx = 0, sy = 0, ox = 0, oy = 0, dragging = false, ghost = null, hot = null;
      el.addEventListener("pointerdown", function (e) {
        if (locked || (e.pointerType === "mouse" && e.button !== 0)) return;
        pid = e.pointerId; sx = e.clientX; sy = e.clientY; dragging = false;
        var rect = el.getBoundingClientRect(); ox = e.clientX - rect.left; oy = e.clientY - rect.top;
        try { el.setPointerCapture(pid); } catch (err) { /* ignore */ }
      });
      el.addEventListener("pointermove", function (e) {
        if (e.pointerId !== pid) return;
        if (!dragging) {
          if (Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) < 7) return;
          dragging = true;
          ghost = el.cloneNode(true); ghost.classList.add("ghost"); ghost.classList.remove("selected");
          ghost.style.width = el.getBoundingClientRect().width + "px";
          document.body.append(ghost); el.classList.add("lifting");
        }
        ghost.style.transform = "translate(" + (e.clientX - ox) + "px," + (e.clientY - oy) + "px)";
        var z = zoneAt(e.clientX, e.clientY);
        if (z !== hot) { if (hot) hot.classList.remove("zone-hot"); hot = z; if (hot) hot.classList.add("zone-hot"); }
      });
      function end(e, cancel) {
        if (e.pointerId !== pid) return;
        pid = null;
        if (!dragging) return;
        dragging = false; lastDrag = performance.now();
        if (hot) hot.classList.remove("zone-hot");
        var z = cancel ? null : zoneAt(e.clientX, e.clientY);
        hot = null; if (ghost) ghost.remove(); ghost = null; el.classList.remove("lifting");
        if (z) placeChip(cid, z.getAttribute("data-zone"));
      }
      el.addEventListener("pointerup", function (e) { end(e, false); });
      el.addEventListener("pointercancel", function (e) { end(e, true); });
    }
    function zoneAt(x, y) { var el = document.elementFromPoint(x, y); return el && board.contains(el) ? el.closest("[data-zone]") : null; }
    function render() {
      pool.replaceChildren();
      Object.keys(zoneBoxes).forEach(function (zid) { zoneBoxes[zid].box.replaceChildren(); });
      var placed = 0;
      chips.forEach(function (c) {
        var zid = place[c.id];
        if (zid) { placed++; zoneBoxes[zid].box.append(chipEl(c)); } else pool.append(chipEl(c));
      });
      if (!multi) zones.forEach(function (z) { if (!zoneBoxes[z.id].box.firstChild) zoneBoxes[z.id].box.append(h("span", { class: "slot-empty" }, selected ? "Tap to place here" : "Drop here")); });
      pool.classList.toggle("empty", placed === chips.length);
      checkBtn.disabled = placed !== chips.length;
    }
    function check() {
      if (locked) return;
      locked = true; results = {}; var pts = 0;
      chips.forEach(function (c) {
        var z = zones.filter(function (x) { return x.id === place[c.id]; })[0];
        var ok = !!z && (multi ? z.label === c.bucket : z.accept.indexOf(c.text) >= 0);
        results[c.id] = ok; if (ok) pts++;
      });
      selected = null; render();
      checkRow.hidden = true;
      var all = pts === chips.length, key;
      if (multi) key = h("ul", { class: "answer-key" }, zones.map(function (z) {
        return h("li", null, h("strong", null, z.label + ": "), chips.filter(function (c) { return c.bucket === z.label; }).map(function (c) { return c.text; }).join(", "));
      }));
      else if (kind === "match") key = h("ul", { class: "answer-key" }, zones.map(function (z) { return h("li", null, h("strong", null, z.label), " → " + z.main + (z.accept.length > 1 ? " (also: " + z.accept.slice(1).join(", ") + ")" : "")); }));
      else key = h("ol", { class: "answer-key" }, zones.map(function (z) { return h("li", null, r.slots ? h("strong", null, z.label + ": ") : null, z.main); }));
      fb.hidden = false; fb.className = "feedback " + (all ? "good" : "bad");
      fb.replaceChildren(h("span", { class: "verdict" }, all ? "All correct. " : pts + " of " + chips.length + " correct. "), all ? null : key);
      onScore(pts, all ? null : { q: r.prompt, your: pts + " of " + chips.length + " correct", right: "see the answer key in the lesson" });
      nextRow.hidden = false; nb.focus({ preventScroll: true });
    }
    var board = h("div", { class: "card" },
      h("p", { class: "board-prompt" }, r.prompt),
      h("p", { class: "board-help" }, "Drag each item into place, or tap an item and then tap where it goes."),
      pool, zonesEl, checkRow, fb, nextRow);
    render();
    return board;
  }

  // ------------------------------------------------------------ judge hub
  function renderJudgeHub() {
    var groups = [];
    UNITS.forEach(function (u) {
      u.activities.forEach(function (a) { if (a.kind === "speak" || a.kind === "write") groups.push({ u: u, a: a }); });
    });
    shell(backBtn("home", "Home"),
      h("section", { class: "hero" }, h("p", { class: "eyebrow" }, "Speaking and writing"), h("h1", null, "Judge"),
        h("p", { class: "lede" }, AI.status === "on"
          ? "Pick a question, then speak or type your answer. The AI judge scores Fluency, Vocabulary and Grammar on the IELTS scale, fixes mistakes and shows a stronger version."
          : "Pick a question, then speak or type your answer. You'll get a quick check of structure, length and key words.")),
      h("div", { class: "act-list" }, groups.map(function (g) {
        return h("div", { class: "act", style: unitVars(g.u) },
          h("span", { class: "tag " + g.a.kind }, TAGS[g.a.kind]),
          h("div", { class: "act-body" }, h("div", { class: "act-title" }, g.a.title), h("div", { class: "act-intro" }, g.u.title + " · " + g.u.source)),
          h("span"),
          h("div", { class: "tasks" }, g.a.tasks.map(function (t) {
            var b = S.best["task:" + t.id];
            return h("button", { class: "task-chip", type: "button", onclick: function () { go("task-" + t.id); } }, t.title, b && b.band != null ? " · " + b.band.toFixed(1) : "");
          })));
      })));
  }

  // ------------------------------------------------------------ target words
  var STEMS = {
    "smelly": "smell(y|s|ed|ing)?|odou?rs?", "flavour": "flavou?rs?", "in-season": "in[- ]season", "GMO": "gmos?|genetically modified",
    "taste": "tast(e|es|ed|y|ing)", "texture": "textures?", "ripe": "ripe", "unripe": "unripe", "organic": "organic", "juicy": "juic(y|ier|iest)",
    "promote": "promot(e|es|ed|ing|ion|ions)", "advertisement": "advertisements?|adverts?|ads?", "advertising": "advertising",
    "brand": "brands?|branding", "campaign": "campaigns?", "target audience": "target(ed|s|ing)? (an |the )?audiences?", "engagement": "engag(e|es|ed|ing|ement)",
    "influencer": "influencers?", "billboard": "billboards?", "tidy": "tid(y|ier|iest|ied|ies|ying|iness)", "messy": "mess(y|ier|iest)?",
    "organised": "organi[sz](ed|e|ing|ation)", "clean up": "clean(s|ed|ing)? (it |them |everything )?up", "put away": "put(s|ting)? (it |them |things |everything )?away",
    "toys": "toys?", "parents": "parents?", "focus": "focus(ed|es|ing)?", "responsible": "responsib(le|ility)", "habit": "habits?"
  };
  function targetRe(w) { return new RegExp("\\b(" + (STEMS[w] || escRe(w.toLowerCase()) + "(s|es|ed|ing)?") + ")\\b", "i"); }
  function targetsUsed(list, text) { return (list || []).filter(function (w) { return targetRe(w).test(text); }); }
  function targetChips(t) {
    if (!t.targetWords || !t.targetWords.length) return null;
    var row = h("div", { class: "targets" }, h("span", { class: "note" }, "Key words" + (t.minTarget ? " (use " + t.minTarget + "+)" : "") + ":"));
    t.targetWords.forEach(function (w) { row.append(h("span", { class: "target", "data-word": w }, w)); });
    return row;
  }
  function paintTargets(row, t, text) {
    if (!row) return;
    var used = targetsUsed(t.targetWords, text);
    row.querySelectorAll(".target").forEach(function (el) { el.classList.toggle("used", used.indexOf(el.getAttribute("data-word")) >= 0); });
  }

  // ------------------------------------------------------------ method definitions
  var METHODS = {
    ARE: { name: "A-R-E", steps: ["Answer", "Reason", "Example"], hint: "Answer → Reason → Example. 2–3 sentences, about 30 seconds.", words: [20, 80], explain: "A-R-E: give a direct Answer, then a Reason, then a personal Example (2-3 sentences)." },
    OREO: { name: "OREO", steps: ["Opinion", "Reason", "Example", "Opinion again"], hint: "Opinion → Reason → Example → Opinion. 3–5 sentences, about a minute.", words: [40, 150], explain: "OREO: Opinion, Reason, Example, then restate the Opinion (3-5 sentences, about people in general)." },
    P2: { name: "Part 2 plan", steps: ["Introduce", "Describe", "Story", "Why it matters", "All cue points"], hint: "Introduce → Describe → Tell a story → Explain why. Cover every cue point. Up to 2 minutes.", words: [130, 340], explain: "Part 2 plan: Introduce (~10s), Describe where/when/what (~30s), Tell a story (~50s), Explain why it matters (~30s). Cover every cue-card point." },
    DESCRIBE: { name: "Description", steps: ["2-3 full sentences", "Key words used correctly", "Look, smell, taste or feel described"], hint: "2–3 sentences. Use the key words to describe how it looks, smells, tastes and feels.", words: [20, 90], explain: "Describe the food in 2-3 sentences using the class vocabulary correctly." },
    ESSAY: { name: "Discussion essay", steps: ["Introduction with opinion", "View 1 explained", "View 2 explained", "Clear own opinion", "Conclusion"], explain: "Discussion essay: introduction with opinion, one paragraph per view (point, explain, example), conclusion that restates the opinion." },
    OVERVIEW: { name: "Task 1 overview", steps: ["Starts with Overall", "Two main features", "No numbers", "Accurate trend words"], explain: "A Task 1 overview: starts with 'Overall', gives the 2 main features, uses no numbers." },
    INTRO: { name: "Task 2 introduction", steps: ["Paraphrases the question", "Clear position", "Two reasons"], explain: "A Task 2 introduction: paraphrase the question (don't copy it), then a thesis with a clear position and two reasons." }
  };
  function partLabel(t) { return t.kind === "write" ? "Writing" : typeof t.part === "number" ? "Part " + t.part : t.part; }

  // ------------------------------------------------------------ recorder (dictation or browser speech)
  function createRecorder(on) {
    var subs = [], sr = null;
    function wire() {
      if (subs.length || !AI.dictation) return;
      var d = AI.dictation;
      subs.push(d.onPartial(function (e) { on.partial(e.text || ""); }));
      subs.push(d.onFinal(function (e) { on.final(e.text || ""); }));
      subs.push(d.onState(function (e) { on.state(e.state !== "idle", e.reason); }));
    }
    return {
      kind: function () { return AI.dictation ? "claude" : SRClass ? "browser" : null; },
      start: function () {
        if (AI.dictation) {
          wire();
          AI.dictation.start().catch(function (err) { on.error(err && err.code); });
          return;
        }
        if (!SRClass) return on.error("unavailable");
        sr = new SRClass();
        sr.lang = "en-GB"; sr.continuous = true; sr.interimResults = true;
        sr.onresult = function (e) {
          var interim = "";
          for (var i = e.resultIndex; i < e.results.length; i++) {
            var res = e.results[i];
            if (res.isFinal) on.final(res[0].transcript); else interim += res[0].transcript;
          }
          on.partial(interim);
        };
        sr.onerror = function (e) { on.error(e.error === "not-allowed" ? "not_granted" : e.error); };
        sr.onend = function () { on.partial(""); on.state(false, "stopped"); sr = null; };
        try { sr.start(); on.state(true); } catch (err) { on.error("upstream_error"); }
      },
      stop: function () {
        if (AI.dictation) return AI.dictation.stop().catch(function () {});
        if (sr) { try { sr.stop(); } catch (err) { /* ignore */ } }
      },
      dispose: function () {
        subs.forEach(function (f) { try { f(); } catch (err) { /* ignore */ } }); subs = [];
        if (sr) { try { sr.abort(); } catch (err) { /* ignore */ } sr = null; }
        if (AI.dictation && AI.dictation.active && AI.dictation.active()) AI.dictation.stop().catch(function () {});
      }
    };
  }
  function speakText(text) {
    if (AI.tts) { AI.tts.speak(text, { language: "en" }).catch(function () {}); return; }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text); u.lang = "en-GB"; u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  }
  function canSpeakAloud() { return !!(AI.tts || window.speechSynthesis); }

  // ------------------------------------------------------------ task screen
  function renderTask(id) {
    var t = TASK[id];
    if (!t) return renderHome();
    var u = TASK_UNIT[id], a = TASK_ACT[id], isWrite = t.kind === "write";
    var method = METHODS[t.method];
    var out = h("div", { class: "verdict-host", "aria-live": "polite" });
    var targets = targetChips(t);
    var draftKey = "task:" + t.id;
    var box = h("textarea", { class: "answer-box", id: "answer-" + t.id, rows: isWrite ? "10" : "6",
      placeholder: isWrite ? "Write your answer here." : "Press Speak and answer out loud, or type your answer here.", "aria-label": "Your answer" });
    if (S.drafts[draftKey]) box.value = S.drafts[draftKey];
    var count = h("span", { class: "note" });
    function onText() {
      var n = wordsOf(box.value).length;
      count.textContent = n + " words" + (isWrite ? " · aim " + t.minWords + "–" + t.maxWords : method ? " · aim " + method.words[0] + "–" + method.words[1] : "");
      paintTargets(targets, t, box.value);
      S.drafts[draftKey] = box.value; save();
    }
    box.addEventListener("input", onText);

    // --- examiner card
    var qBlock;
    if (t.cue) {
      qBlock = h("div", { class: "cue-card" }, h("div", { class: "cue-head" }, "Candidate task card"), h("p", null, t.question),
        h("div", null, "You should say:"), h("ul", null, t.cue.map(function (c) { return h("li", null, c); })));
    } else qBlock = h("p", { class: "question" }, isWrite ? t.prompt : t.question);
    var table = t.table ? h("div", { class: "table-scroll" }, h("table", { class: "data-table" },
      h("thead", null, h("tr", null, t.table.head.map(function (c) { return h("th", { scope: "col" }, c); }))),
      h("tbody", null, t.table.rows.map(function (row) { return h("tr", null, row.map(function (c, i) { return i === 0 ? h("th", { scope: "row" }, c) : h("td", null, c); })); })))) : null;

    // --- recording controls (speaking only)
    var controls = null, interim = h("div", { class: "interim", "aria-live": "polite" }), timerEl = h("span", { class: "timer", "aria-label": "Timer" }, "0:00");
    var rec = null, recOn = false, tStart = 0, tick = null, planTick = null;
    if (!isWrite) {
      var recBtn = h("button", { class: "btn", type: "button" }, "● Speak");
      var planBtn = t.prep ? h("button", { class: "btn", type: "button" }, "Plan " + fmtTime(t.prep)) : null;
      var readBtn = h("button", { class: "btn", type: "button", onclick: function () { speakText(t.question + (t.cue ? ". You should say: " + t.cue.join(", ") + "." : "")); } }, "Read aloud");
      readBtn.hidden = !canSpeakAloud();
      var clearBtn = h("button", { class: "btn", type: "button", onclick: function () { box.value = ""; onText(); out.replaceChildren(); } }, "Clear");
      var recNote = h("span", { class: "note" });
      rec = createRecorder({
        partial: function (txt) { interim.textContent = txt; },
        final: function (txt) {
          txt = String(txt).trim(); if (!txt) return;
          box.value = (box.value.trim() ? box.value.replace(/\s+$/, "") + " " : "") + txt;
          onText();
        },
        state: function (active, reason) {
          recOn = active;
          recBtn.className = active ? "btn rec" : "btn";
          recBtn.replaceChildren(active ? h("span", { class: "dot", "aria-hidden": "true" }) : "●", active ? " Stop" : " Speak");
          if (active && !tick) {
            tStart = Date.now();
            tick = setInterval(function () {
              var sec = (Date.now() - tStart) / 1000;
              timerEl.textContent = fmtTime(sec) + (t.time ? " / " + fmtTime(t.time) : "");
              timerEl.classList.toggle("over", t.time && sec > t.time);
              if (t.method === "P2" && sec > t.time + 3) rec.stop();
            }, 250);
          }
          if (!active) { clearInterval(tick); tick = null; interim.textContent = ""; if (reason === "not_granted") recNote.textContent = "Microphone access was declined. You can type your answer instead."; }
        },
        error: function (code) {
          recOn = false; recBtn.className = "btn"; recBtn.replaceChildren("● Speak"); clearInterval(tick); tick = null;
          recNote.textContent = code === "not_granted" ? "Microphone access was declined. You can type your answer instead."
            : code === "unavailable" ? "Speech input isn't available here. Type your answer instead."
            : code === "no-speech" ? "No speech heard. Press Speak and try again."
            : code === "dismissed" ? "" : "Speech input stopped. Press Speak to try again, or type.";
        }
      });
      recBtn.addEventListener("click", function () { if (recOn) rec.stop(); else { recNote.textContent = ""; rec.start(); } });
      if (planBtn) planBtn.addEventListener("click", function () {
        if (planTick) return;
        var left = t.prep;
        planBtn.disabled = true;
        planTick = setInterval(function () {
          left--; planBtn.textContent = "Plan " + fmtTime(left);
          if (left <= 0) { clearInterval(planTick); planTick = null; planBtn.textContent = "Time to speak"; recNote.textContent = "Planning time is over. Press Speak and talk for up to 2 minutes."; }
        }, 1000);
      });
      function paintRec() {
        var k = rec.kind();
        recBtn.hidden = !k;
        if (!k && !recNote.textContent) recNote.textContent = "Speech input works in Chrome or Edge. You can type your answer here.";
        readBtn.hidden = !canSpeakAloud();
      }
      paintRec(); aiListeners.push(paintRec);
      controls = h("div", { class: "row" }, readBtn, planBtn, recBtn, timerEl, clearBtn, recNote);
      disposers.push(function () { clearInterval(tick); clearInterval(planTick); rec.dispose(); });
    }

    // --- judge button
    var judgeBtn = h("button", { class: "btn primary", type: "button" });
    var stopBtn = h("button", { class: "btn", type: "button", hidden: true }, "Stop");
    var ctl = null;
    function paintJudge() { judgeBtn.textContent = AI.status === "on" ? "Get AI feedback" : AI.status === "pending" ? "Get feedback" : "Quick check"; }
    paintJudge(); aiListeners.push(paintJudge);
    judgeBtn.addEventListener("click", function () {
      if (recOn) rec.stop();
      var text = box.value.trim();
      if (wordsOf(text).length < 3) { out.replaceChildren(h("p", { class: "feedback bad" }, isWrite ? "Write your answer first." : "Speak or type your answer first.")); box.focus(); return; }
      if (AI.status === "on" && (AI.sample || AI.remote)) runAI(text); else showQuick(text);
    });
    stopBtn.addEventListener("click", function () { if (ctl) ctl.abort(); });
    disposers.push(function () { if (ctl) ctl.abort(); });

    function runAI(text, note) {
      if (!AI.sample && AI.remote) {
        if (!S.name) { out.replaceChildren(h("div", { class: "card name-card" }, h("p", { class: "hand" }, "Add your name to use the AI judge"), nameForm(function () { runAI(text); }, "Continue"))); return; }
        if (AI.needsCode && !S.code) { out.replaceChildren(codeCard(function () { runAI(text); }, note)); return; }
      }
      ctl = new AbortController();
      judgeBtn.disabled = true; stopBtn.hidden = false;
      out.replaceChildren(h("div", { class: "card thinking" }, h("span", { class: "spinner", "aria-hidden": "true" }), "The judge is reading your answer. This can take up to a minute."));
      askJudge(t, text, ctl.signal).then(function (res) {
        var band = renderVerdict(t, text, res, out);
        var st = sendStatus({ lesson: u.title, activity: t.title, type: TAGS[t.kind] + " AI", score: band == null ? 0 : band, total: 9,
          details: "AI band " + (band == null ? "?" : band.toFixed(1)) + ", " + wordsOf(text).length + " words" });
        if (st) out.append(st);
      }, function (e) {
        var code = e && e.code;
        if (code === "cancelled") { out.replaceChildren(); return; }
        if (code === "bad_code") { S.code = ""; save(); runAI(text, "That code didn't work. Check it with your teacher."); return; }
        if (code === "need_name") { S.name = ""; save(); paintNamePill(); runAI(text); return; }
        if (code === "not_configured" || code === "not_granted" || code === "sampling_disabled" || code === "not_declared" || code === "capability_disabled" || code === "capability_removed") {
          AI.status = "off"; aiChanged();
          out.replaceChildren(h("p", { class: "feedback bad" }, "The AI judge isn't available for this account here, so this is a quick check instead."));
          out.append(quickView(t, text));
          return;
        }
        if (code === "daily_limit" || code === "device_limit") {
          out.replaceChildren(h("p", { class: "feedback bad" }, code === "daily_limit" ? "The class has used today's AI checks. Here's a quick check instead; the AI judge is back tomorrow." : "You've used a lot of AI checks on this device. Here's a quick check instead; try the AI judge again later."));
          out.append(quickView(t, text));
          return;
        }
        var msg = code === "rate_limited" || code === "busy" ? "The judge is busy. Wait a minute, then try again."
          : code === "refused" ? "The judge couldn't score this answer. Try rewording it."
          : code === "invalid_json" ? "The feedback came back in the wrong format. Press the button to try again."
          : code === "session_expired" ? "Your claude.ai session expired. Sign in again, then try again."
          : "The judge couldn't be reached. Try again in a moment.";
        out.replaceChildren(h("p", { class: "feedback bad" }, msg));
      }).then(function () { judgeBtn.disabled = false; stopBtn.hidden = true; ctl = null; });
    }
    function showQuick(text) {
      var view = quickView(t, text);
      out.replaceChildren(view);
      var st = sendStatus({ lesson: u.title, activity: t.title, type: TAGS[t.kind], score: view.qcGood, total: view.qcTotal, details: wordsOf(text).length + " words, quick check" });
      if (st) out.append(st);
      addXP(5);
    }

    shell(h("div", { style: unitVars(u) },
      backBtn("unit-" + u.id, u.title),
      h("div", { class: "card examiner" },
        h("div", { class: "row" }, h("span", { class: "part-label" }, partLabel(t)), h("span", { class: "note" }, a.title + " · " + u.source)),
        qBlock, table,
        method && method.hint ? h("p", { class: "note" }, "Method: " + method.hint) : t.notes ? h("p", { class: "note" }, t.notes) : null,
        isWrite && t.notes && method && method.hint ? h("p", { class: "note" }, t.notes) : null,
        targets),
      h("div", { class: "card examiner", style: "margin-top: 14px" },
        controls, interim, box,
        h("div", { class: "row" }, judgeBtn, stopBtn, count),
        isWrite ? null : h("p", { class: "note" }, "The judge reads a transcript, so pronunciation is not scored.")),
      h("div", { style: "margin-top: 14px" }, out)));
    onText();
  }

  // ------------------------------------------------------------ AI judge
  function buildPrompt(t, text) {
    var m = METHODS[t.method], isWrite = t.kind === "write";
    var lines = [];
    if (isWrite) {
      lines.push("You are a friendly, experienced IELTS Writing examiner and teacher. The student is a Vietnamese learner at about band 5.0-6.0.");
      lines.push("Judge ONE piece of writing.");
      lines.push("", "Task: " + t.prompt);
      if (t.table) lines.push("Data: " + t.table.head.join(" | ") + " ; " + t.table.rows.map(function (r) { return r.join(" | "); }).join(" ; "));
      if (t.notes) lines.push("Teacher's requirements: " + t.notes);
      lines.push("Expected length: " + t.minWords + "-" + t.maxWords + " words.");
    } else {
      lines.push("You are a friendly, experienced IELTS Speaking examiner and teacher. The student is a Vietnamese learner at about band 5.0-6.0.");
      lines.push("Judge ONE spoken answer. You only see a speech-to-text transcript: ignore punctuation and capital letters, do not judge pronunciation, and do not punish small transcription mistakes.");
      lines.push("", "Test part: " + partLabel(t) + (t.part === 1 ? " (short answer about the student's own life)" : t.part === 2 ? " (long turn, up to 2 minutes)" : t.part === 3 ? " (discussion about people and society in general)" : " (2-3 sentence description practising class vocabulary)"));
      lines.push("Question: \"" + t.question + "\"" + (t.cue ? " You should say: " + t.cue.join("; ") + "." : ""));
      lines.push("Expected length: about " + t.time + " seconds of speech.");
    }
    if (m) lines.push("Method taught in class: " + m.explain);
    if (t.targetWords && t.targetWords.length) lines.push("Class vocabulary to use" + (t.minTarget ? " (at least " + t.minTarget + ")" : "") + ": " + t.targetWords.join(", ") + ".");
    lines.push("", "Student's " + (isWrite ? "text" : "transcript") + ":", "\"\"\"", text.slice(0, 6000), "\"\"\"", "");
    if (isWrite) lines.push("Score Task Response (or Task Achievement), Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy on the IELTS 0-9 scale in half bands. A short practice task (one paragraph) is judged as that paragraph, not as a full essay.");
    else lines.push("Score Fluency and Coherence, Lexical Resource, and Grammatical Range and Accuracy on the IELTS 0-9 scale in half bands. An answer under 15 words cannot score above 4 for Fluency and Coherence.");
    lines.push("Be realistic, not generous. If the answer is off-topic, say so in the comments.");
    lines.push("Write every comment in short, simple English (B1 level). In \"fixes\", quote the student's real words; give at most 3 fixes, only real mistakes or clearly weak phrases.");
    var steps = m ? m.steps : [];
    var crit = isWrite ? '"task": {"band": 6, "comment": "..."}, "coherence": {"band": 6, "comment": "..."}, "lexical": {"band": 5.5, "comment": "..."}, "grammar": {"band": 6, "comment": "..."}'
      : '"fluency": {"band": 6, "comment": "..."}, "lexical": {"band": 5.5, "comment": "..."}, "grammar": {"band": 6, "comment": "..."}';
    lines.push("Reply with only JSON in exactly this shape:");
    lines.push("{" + crit + ', "method": [{"step": "' + (steps[0] || "Structure") + '", "done": true, "note": "..."}], "targetWords": {"used": ["..."], "misused": ["..."]}, "strengths": ["..."], "fixes": [{"original": "...", "better": "...", "why": "..."}], "upgrade": "...", "nextStep": "...", "nextStepVi": "..."}');
    lines.push("\"method\" must have exactly one entry per step, in this order: " + steps.join(", ") + ".");
    lines.push("\"upgrade\" is a better version of the same answer: the student's own ideas, natural, about band 7, similar length.");
    lines.push("\"nextStep\" is one thing to practise next; \"nextStepVi\" is the same advice in Vietnamese.");
    return lines.join("\n");
  }
  function bandOf(x) { var n = Number(x && typeof x === "object" ? x.band : x); return isFinite(n) ? Math.min(9, Math.max(0, roundBand(n))) : null; }
  function str(x) { return typeof x === "string" ? x : x == null ? "" : String(x); }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function renderVerdict(t, text, res, out) {
    if (!res || typeof res !== "object") { out.replaceChildren(h("p", { class: "feedback bad" }, "The feedback was empty. Try again.")); return null; }
    var isWrite = t.kind === "write";
    var keys = isWrite ? [["task", "Task Response"], ["coherence", "Coherence & Cohesion"], ["lexical", "Vocabulary (Lexical Resource)"], ["grammar", "Grammar"]]
      : [["fluency", "Fluency & Coherence"], ["lexical", "Vocabulary (Lexical Resource)"], ["grammar", "Grammar"]];
    var bands = keys.map(function (k) { return bandOf(res[k[0]]); }).filter(function (b) { return b != null; });
    var overall = bands.length ? roundBand(bands.reduce(function (s, b) { return s + b; }, 0) / bands.length) : null;
    if (overall != null) {
      var prev = S.best["task:" + t.id];
      if (!prev || prev.band == null || overall > prev.band) { S.best["task:" + t.id] = { band: overall }; save(); }
    }
    addXP(20);
    var ticks = h("div", { class: "meter-ticks", "aria-hidden": "true" });
    for (var i = 0; i <= 9; i++) ticks.append(h("span", null, String(i)));
    var used = targetsUsed(t.targetWords, text), misused = arr(res.targetWords && res.targetWords.misused).map(str).filter(Boolean);
    var steps = arr(res.method);
    var card = h("div", { class: "card verdict-card" },
      h("div", { class: "overall" },
        h("div", null, h("div", { class: "eyebrow" }, "Estimated band"), h("div", { class: "overall-band" }, overall == null ? "–" : overall.toFixed(1))),
        h("div", { class: "meter" }, h("div", { class: "meter-track" }, h("div", { class: "meter-fill", style: "width:" + (overall == null ? 0 : (overall / 9) * 100) + "%" })), ticks)),
      h("div", null, keys.map(function (k) {
        var c = res[k[0]] || {}, b = bandOf(c);
        return h("div", { class: "crit" }, h("span", { class: "crit-name" }, k[1]), h("span", { class: "crit-band" }, b == null ? "–" : b.toFixed(1)), h("span", { class: "crit-comment" }, str(c.comment)));
      }), isWrite ? null : h("div", { class: "crit" }, h("span", { class: "crit-name" }, "Pronunciation"), h("span", { class: "crit-band note" }, "not scored"), h("span", { class: "crit-comment" }, "The judge only sees the words, not your voice."))),
      steps.length ? h("div", null, h("h3", null, "Method check: " + (METHODS[t.method] ? METHODS[t.method].name : "structure")), h("div", { class: "steps", style: "margin-top:8px" }, steps.map(function (s) {
        return h("span", { class: "step" + (s && s.done ? " done" : ""), title: str(s && s.note) }, (s && s.done ? "✓ " : "✗ ") + str(s && s.step));
      })), h("ul", { class: "note" }, steps.filter(function (s) { return s && s.note; }).map(function (s) { return h("li", null, str(s.step) + ": " + str(s.note)); }))) : null,
      t.targetWords && t.targetWords.length ? h("div", null, h("h3", null, "Key words"),
        h("p", { class: "note" }, "Used: " + (used.length ? used.join(", ") : "none") + (t.minTarget ? " (" + used.length + " of " + t.minTarget + " needed)" : "")),
        misused.length ? h("p", { class: "note" }, "Check how you used: " + misused.join(", ")) : null) : null,
      arr(res.strengths).length ? h("div", null, h("h3", null, "What went well"), h("ul", null, arr(res.strengths).map(function (s) { return h("li", null, str(s)); }))) : null,
      arr(res.fixes).length ? h("div", { style: "display:grid;gap:8px" }, h("h3", null, "Fix these"), arr(res.fixes).map(function (f) {
        return h("div", { class: "fix" }, h("div", null, h("span", { class: "was" }, str(f && f.original)), " → ", h("span", { class: "now" }, str(f && f.better))), f && f.why ? h("div", { class: "note" }, str(f.why)) : null);
      })) : null,
      res.upgrade ? h("div", { style: "display:grid;gap:8px" }, h("div", { class: "row" }, h("h3", null, "A stronger version"),
        !isWrite && canSpeakAloud() ? h("button", { class: "btn small", type: "button", onclick: function () { speakText(str(res.upgrade)); } }, "Listen") : null),
        h("div", { class: "upgrade" }, str(res.upgrade))) : null,
      res.nextStep ? h("div", null, h("h3", null, "Practise next"), h("p", { style: "margin:4px 0" }, str(res.nextStep)), res.nextStepVi ? h("p", { class: "vi", lang: "vi" }, str(res.nextStepVi)) : null) : null,
      h("p", { class: "note" }, "AI estimate for practice only. Real IELTS scores come from trained examiners."));
    out.replaceChildren(card);
    return overall;
  }

  // Ask the AI judge: claude.ai's built-in Claude, or the class Apps Script on the public site.
  function askJudge(t, text, signal) {
    if (AI.sample) return AI.sample.json(buildPrompt(t, text), { signal: signal });
    var task = { kind: t.kind, method: t.method, part: t.part, question: t.question, prompt: t.prompt, notes: t.notes, cue: t.cue,
      targetWords: t.targetWords, minTarget: t.minTarget, time: t.time, minWords: t.minWords, maxWords: t.maxWords, table: t.table };
    var body = JSON.stringify({ action: "judge", name: S.name, pid: devicePid(), code: S.code || "", text: text.slice(0, 6000), task: task });
    return fetch(SCRIPT_URL, { method: "POST", body: body, signal: signal })
      .then(function (r) { return r.json(); }, function (e) { throw { code: e && e.name === "AbortError" ? "cancelled" : "upstream_error" }; })
      .then(function (res) {
        if (res && res.ok && res.result) return res.result;
        throw { code: (res && res.error) || "upstream_error" };
      });
  }
  function codeCard(onSaved, note) {
    var input = h("input", { class: "name-input", id: "class-code", type: "text", maxlength: "40", autocomplete: "off", placeholder: "Class code", "aria-label": "Class code" });
    return h("div", { class: "card name-card" },
      h("p", { class: "hand" }, note || "Enter the class code from your teacher"),
      h("form", { class: "name-form", onsubmit: function (e) {
        e.preventDefault();
        var v = input.value.trim();
        if (!v) { input.focus(); return; }
        S.code = v.slice(0, 40); save(); onSaved();
      } }, input, h("button", { class: "btn primary", type: "submit" }, "Continue")),
      h("p", { class: "note" }, "You only need to enter it once on this device."));
  }

  // ------------------------------------------------------------ quick check (no AI)
  function has(text, phrases) { return phrases.some(function (p) { return new RegExp("\\b" + escRe(p) + "\\b", "i").test(text); }); }
  var STOP = "a an the and or but so to of in on at for with is are was were be been am i you he she it we they my your our their this that these those very really just do does did not no yes have has had can will would there here me them his her its what when where why how all also some more most than then because like".split(" ");
  function quickView(t, text) {
    var m = METHODS[t.method], words = wordsOf(text), n = words.length, items = [];
    var lower = text.toLowerCase();
    function add(ok, label, tip) { items.push({ ok: ok, label: label, tip: tip }); }
    var R = ["because", "as", "since", "so", "that's why", "the reason", "due to"];
    var E = ["for example", "for instance", "such as", "like when", "once", "last week", "last month", "last year", "last summer", "yesterday", "when i was", "i remember"];
    var O = ["i think", "i'd say", "i would say", "in my view", "i believe", "personally", "in my opinion", "from my point of view", "i agree", "i disagree"];
    var range = t.kind === "write" ? [t.minWords, t.maxWords] : m ? m.words : [20, 120];
    add(n >= range[0] && n <= range[1], "Length: " + n + " words (aim " + range[0] + "–" + range[1] + ")", n < range[0] ? "Add a reason or an example to say more." : n > range[1] ? "Too long. Keep to the point." : "Good length.");
    if (t.method === "ARE") {
      add(/^\s*(yes|no|not really|definitely|of course|sure|well|actually|i(\s|'m|'d)|to be honest|kind of|sometimes|usually|absolutely)/i.test(text), "Answer first", "Start with a direct answer: \"Yes, quite a lot.\" / \"Not really.\"");
      add(has(lower, R), "Reason", "Add a reason with because / so / that's why.");
      add(has(lower, E) || /\b(my|last|every|when)\b/i.test(text), "Example or personal detail", "Add a real detail: \"For example, every Sunday I…\"");
    } else if (t.method === "OREO") {
      add(has(lower, O), "Opinion", "Start with I'd say… / In my view…");
      add(has(lower, R), "Reason", "Explain why with because / since.");
      add(has(lower, E), "Example", "Add an example: For example… / For instance…");
      add(has(lower, ["so", "that's why", "overall", "all in all", "in short", "to sum up"]) && n > 30, "Opinion again at the end", "Finish with So, … to restate your view.");
    } else if (t.method === "P2") {
      add(has(lower, ["i'd like to", "i would like to", "i'm going to", "i am going to", "i want to talk", "i'd like to describe"]), "Introduce the topic", "Begin: \"I'd like to describe…\"");
      add(has(lower, ["one time", "once", "last", "i remember", "what i remember", "one day"]), "Tell a story", "Add a short story: \"What I remember most is…\"");
      add(has(lower, R.concat(["matters", "special", "love", "important"])), "Explain why", "End with why it matters to you.");
      add(n >= 150, "Speak for the full 2 minutes", "Aim for 150+ words. Use \"Another thing is…\" to keep going.");
    } else if (t.method === "OVERVIEW") {
      add(/^\s*(overall|in general|generally)/i.test(text), "Starts with Overall", "Begin with \"Overall,\".");
      add(!/\d/.test(text), "No numbers", "Keep numbers for the detail paragraphs.");
      add(has(lower, ["rose", "increased", "grew", "fell", "declined", "decreased", "dropped", "overtook", "steadily", "gradually", "sharply"]), "Trend words", "Use rose / fell / overtook / steadily.");
      add(/coffee/i.test(text) && /tea/i.test(text), "Both drinks mentioned", "Compare coffee and tea.");
    } else if (t.method === "INTRO") {
      add(!/university should be free/i.test(text), "Paraphrased (not copied)", "Rewrite the question in your own words.");
      add(has(lower, ["agree", "disagree", "believe", "in my opinion", "i think"]), "Clear position", "Say clearly whether you agree.");
      add(has(lower, ["because", "as", "since", "due to"]) || / and /.test(lower), "Two reasons", "Give two reasons: \"…, as it creates X and Y.\"");
    } else if (t.method === "ESSAY") {
      var paras = text.split(/\n\s*\n|\n/).filter(function (p) { return p.trim(); }).length;
      add(paras >= 3, "Paragraphs: " + paras, "Use 4 paragraphs: intro, view 1, view 2, conclusion.");
      add(has(lower, ["in conclusion", "to sum up", "overall"]), "Conclusion", "Finish with In conclusion, …");
      var structs = [/\b(in order to|so as to)\b|\b(use|uses|used|hire|hires|hired|spend|spends|spent|run|runs|ran|launch|launched)\b[^.]{0,50}\bto [a-z]+/i, /\b(more|less) \w+ than\b|\b\w+er than\b|\bbetter than\b|\bworse than\b/i, /\b(as a result|consequently|this leads to|therefore)\b/i].filter(function (re) { return re.test(text); }).length;
      add(structs >= 2, "Lecture structures: " + structs + " of 3", "Use at least two: in order to + verb, more … than, as a result.");
      add(!/\b(don't|can't|it's|isn't|won't|kids|a lot of)\b/i.test(text), "Formal style", "Avoid contractions and informal words (kids, a lot of).");
    } else if (t.method === "DESCRIBE") {
      var sentences = text.split(/[.!?]+/).filter(function (s) { return wordsOf(s).length > 2; }).length;
      add(sentences >= 2 || n >= 25, "2–3 sentences", "Write or say 2–3 full sentences.");
    }
    if (t.targetWords && t.targetWords.length) {
      var used = targetsUsed(t.targetWords, text);
      add(used.length >= (t.minTarget || 1), "Key words: " + used.length + " used" + (t.minTarget ? " (need " + t.minTarget + ")" : ""), used.length ? "Used: " + used.join(", ") + "." : "Try: " + t.targetWords.slice(0, 4).join(", ") + ".");
    }
    var freq = {}, top = null;
    words.forEach(function (w) { w = w.toLowerCase(); if (w.length < 4 || STOP.indexOf(w) >= 0) return; freq[w] = (freq[w] || 0) + 1; if (!top || freq[w] > freq[top]) top = w; });
    if (top && freq[top] >= 4) add(false, "Variety: \"" + top + "\" used " + freq[top] + " times", "Swap some for a synonym.");
    var good = items.filter(function (i) { return i.ok; }).length;
    var card = h("div", { class: "card verdict-card" },
      h("div", { class: "overall" }, h("div", null, h("div", { class: "eyebrow" }, "Quick check · not AI"), h("div", { class: "overall-band" }, good + "/" + items.length)),
        h("p", { class: "note", style: "max-width:46ch" }, "Checks structure, length and key words. It can't judge grammar or meaning." + (CFG.classUrl && AI.status === "off" ? " For a band estimate, use the class version with the AI judge." : ""))),
      h("ul", { class: "check-list" }, items.map(function (i) {
        return h("li", null, h("span", { class: "mark" + (i.ok ? " yes" : ""), "aria-label": i.ok ? "done" : "to do" }, i.ok ? "✓" : "✗"), h("div", null, h("strong", null, i.label), h("div", { class: "note" }, i.tip)));
      })));
    card.qcGood = good; card.qcTotal = items.length;
    return card;
  }

  // ------------------------------------------------------------ boot
  window.addEventListener("hashchange", route);
  route();
})();
