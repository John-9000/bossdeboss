(() => {
  "use strict";

  // ========= Config =========
  const BASE_URL = "https://www.bossdeboss.co.uk"; // used for share links
  const STORAGE_LAST = "boss_last_result_v1";
  const STORAGE_HISTORY = "boss_history_v1";
  const STORAGE_COOKIE = "boss_cookie_consent_v1";

  // "Signed" links (best-effort on static sites)
  const SHARE_SECRET = "bossdeboss_static_secret_v1";

  // ========= Utilities =========
  const $ = (id) => document.getElementById(id);

  function safeOrigin() {
    // When testing via file://, location.origin is "null"
    if (typeof location === "undefined") return BASE_URL;
    if (location.origin && location.origin !== "null") return location.origin;
    return BASE_URL;
  }

  function checksum(str) {
    // lightweight checksum (not crypto). Good enough to block casual tampering.
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  function makeToken(score) {
    const payload = `${score}|${Date.now()}`;
    const sig = checksum(payload + SHARE_SECRET);
    return btoa(`${payload}|${sig}`);
  }

  function parseToken(token) {
    try {
      const raw = atob(token);
      const parts = raw.split("|");
      if (parts.length !== 3) return null;
      const [scoreStr, ts, sig] = parts;
      const check = checksum(`${scoreStr}|${ts}` + SHARE_SECRET);
      if (check !== sig) return null;
      const score = parseInt(scoreStr, 10);
      if (!Number.isInteger(score) || score < 1 || score > 100) return null;
      return { score };
    } catch (_) {
      return null;
    }
  }

  function signedUrlForScore(score) {
    const token = makeToken(score);
    return `${safeOrigin()}/?s=${encodeURIComponent(token)}`;
  }

  function clamp(n, a, b) {
    return Math.min(b, Math.max(a, n));
  }

  function formatWhen(ts) {
    // Simple: show date+time (stable, no "relative time" confusion)
    try {
      const d = new Date(ts);
      return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (_) {
      return "";
    }
  }

  // ========= Tier + icons =========
  const ICONS = {
    sparkles: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.4 5.3L19 9l-5.6 1.7L12 16l-1.4-5.3L5 9l5.6-1.7L12 2z"/></svg>`,
    target: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>`,
    zap: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>`,
    crown: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l4 6 5-7 5 7 4-6v13H3V7z"/><path d="M3 20h18"/></svg>`,
    trophy: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v3a5 5 0 0 1-10 0V4z"/><path d="M5 7h2a5 5 0 0 1-2 4V7z"/><path d="M19 7h-2a5 5 0 0 0 2 4V7z"/></svg>`,
  };

  function tierFor(level) {
    if (level <= 29) return { key: "novice", title: "NOVICE BOSS", colorVar: "--gray", icon: "sparkles", emoji: "✨" };
    if (level <= 49) return { key: "apprentice", title: "APPRENTICE BOSS", colorVar: "--green", icon: "target", emoji: "🎯" };
    if (level <= 69) return { key: "rising", title: "RISING BOSS", colorVar: "--blue", icon: "zap", emoji: "⚡" };
    if (level <= 89) return { key: "elite", title: "ELITE BOSS", colorVar: "--purple", icon: "crown", emoji: "👑" };
    return { key: "legendary", title: "LEGENDARY BOSS", colorVar: "--yellow", icon: "trophy", emoji: "🏆" };
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function applyTierColor(el, tier) {
    if (!el) return;
    el.style.color = cssVar(tier.colorVar);
  }

  // ========= Funny text =========
  const FUNNY = {
    novice: ["Junior boss vibes. You’ll get there.", "Still in tutorial mode 😄", "Small steps. Big boss later."],
    apprentice: ["Respectable boss energy.", "You're leveling up fast.", "Not bad… not bad at all."],
    rising: ["Boss momentum is real.", "People are starting to listen.", "Confidence: unlocked."],
    elite: ["Elite aura detected 😎", "CEO energy. No refunds.", "You walk in, the room changes."],
    legendary: ["Legend status confirmed.", "Absolute unit of boss.", "This is what power looks like."],
  };

  function pickFunny(tierKey) {
    const arr = FUNNY[tierKey] || FUNNY.novice;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ========= Storage helpers =========
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  }

  // ========= DOM bindings (works on both pages safely) =========
  const shareBtn = $("shareBtn");
  const historyBtn = $("historyBtn");
  const historyModal = $("historyModal");
  const historyClose = $("historyClose");
  const historyList = $("historyList");

  const checkBtn = $("checkBtn");
  const placeholder = $("placeholder");
  const result = $("result");
  const resultNumber = $("resultNumber");
  const resultTier = $("resultTier");
  const resultIcon = $("resultIcon");

  const progressBlock = $("progressBlock");
  const progressValue = $("progressValue");
  const progressFill = $("progressFill");

  const cookieBanner = $("cookieBanner");
  const cookieAccept = $("cookieAccept");
  const cookieDecline = $("cookieDecline");

  let currentLevel = null;
  let isRolling = false;
  let isSharedView = false;

  function ensureFunnyEl() {
    if (!result) return null;
    let el = $("funnyText");
    if (el) return el;
    el = document.createElement("div");
    el.id = "funnyText";
    el.className = "bossFunny";
    // Place it right under progressBlock (inside result card)
    if (progressBlock && progressBlock.parentElement === result) {
      progressBlock.insertAdjacentElement("afterend", el);
    } else {
      result.appendChild(el);
    }
    return el;
  }

  function setFunny(text, shared = false) {
    const el = ensureFunnyEl();
    if (!el) return;
    el.textContent = text || "";
    el.classList.toggle("bossFunny--shared", !!shared);
  }

  // ========= Cookie consent (shared across pages) =========
  function initCookies() {
    if (!cookieBanner) return;
    const state = localStorage.getItem(STORAGE_COOKIE);
    if (!state) cookieBanner.classList.remove("hidden");

    function setState(val) {
      localStorage.setItem(STORAGE_COOKIE, val);
      cookieBanner.classList.add("hidden");
    }

    cookieAccept?.addEventListener("click", () => setState("accepted"));
    cookieDecline?.addEventListener("click", () => setState("declined"));
  }

  // ========= History =========
  function openHistory() {
    if (!historyModal || !historyList) return;
    renderHistory();
    historyModal.classList.remove("hidden");
  }

  function closeHistory() {
    historyModal?.classList.add("hidden");
  }

  function renderHistory() {
    if (!historyList) return;
    const history = loadJSON(STORAGE_HISTORY, []);
    historyList.innerHTML = "";

    if (!history.length) {
      const empty = document.createElement("div");
      empty.className = "historyEmpty";
      empty.textContent = "No history yet. Roll your first boss level!";
      historyList.appendChild(empty);
      return;
    }

    for (const item of history) {
      const tier = tierFor(item.score);
      const row = document.createElement("div");
      row.className = "historyRow";

      const label = document.createElement("div");
      label.className = "historyLabel";
      label.textContent = `${String(item.score).padStart(2, "0")}  ${tier.title}`;
      applyTierColor(label, tier);

      const bar = document.createElement("div");
      bar.className = "historyBar";

      const fill = document.createElement("div");
      fill.className = "historyBarFill";
      fill.style.width = `${clamp(item.score, 0, 100)}%`;
      fill.style.background = cssVar(tier.colorVar);

      const barText = document.createElement("div");
      barText.className = "historyBarText";
      barText.textContent = `${item.score}`;

      bar.appendChild(fill);
      bar.appendChild(barText);

      const when = document.createElement("div");
      when.className = "historyWhen";
      when.textContent = formatWhen(item.ts);

      row.appendChild(label);
      row.appendChild(bar);
      row.appendChild(when);

      historyList.appendChild(row);
    }
  }

  function pushHistory(score) {
    const history = loadJSON(STORAGE_HISTORY, []);
    history.unshift({ score, ts: Date.now() });
    while (history.length > 15) history.pop();
    saveJSON(STORAGE_HISTORY, history);
  }

  // ========= UI helpers =========
  function showResultCard() {
    placeholder?.classList.add("hidden");
    result?.classList.remove("hidden");
  }

  function setProgress(val) {
    if (!progressBlock || !progressValue || !progressFill) return;
    progressBlock.classList.remove("hidden");
    const v = clamp(Math.round(val), 0, 100);
    progressValue.textContent = String(v);
    progressFill.style.width = `${v}%`;

    const tier = tierFor(v || 1);
    progressFill.style.background = cssVar(tier.colorVar);
  }

  function setMainResult(level) {
    const tier = tierFor(level);
    if (resultNumber) resultNumber.textContent = String(level);
    if (resultTier) resultTier.textContent = tier.title;
    if (resultIcon) resultIcon.innerHTML = ICONS[tier.icon] || "";
    applyTierColor(resultNumber, tier);
    applyTierColor(resultTier, tier);
  }

  function disableCheck(disabled) {
    if (!checkBtn) return;
    checkBtn.disabled = !!disabled;
  }

  // ========= Roll animation =========
  function startRoll() {
    if (!checkBtn || !result) return;
    if (isRolling) return;

    isRolling = true;
    isSharedView = false;
    currentLevel = null;

    showResultCard();
    setFunny("");
    setProgress(0);
    disableCheck(true);

    const duration = 2000;
    const start = performance.now();

    function frame(now) {
      const t = clamp((now - start) / duration, 0, 1);
      const val = Math.max(1, Math.round(t * 100));
      setProgress(val);
      setMainResult(val);
      if (t < 1) requestAnimationFrame(frame);
      else finishRoll();
    }
    requestAnimationFrame(frame);
  }

  function finishRoll() {
    const arr = new Uint32Array(1);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(arr);
    const level = (arr[0] % 100) + 1;

    currentLevel = level;
    setProgress(level);
    setMainResult(level);

    const tier = tierFor(level);
    const funny = pickFunny(tier.key);
    setFunny(funny, false);

    saveJSON(STORAGE_LAST, { score: level, funny, ts: Date.now() });
    pushHistory(level);

    disableCheck(false);
    isRolling = false;
  }

  // ========= Restore last result (normal browsing) =========
  function restoreLastIfAny() {
    if (isSharedView) return;
    const last = loadJSON(STORAGE_LAST, null);
    if (!last || typeof last.score !== "number") return;

    currentLevel = last.score;
    showResultCard();
    setMainResult(last.score);
    setProgress(last.score);
    setFunny(last.funny || "", false);
  }

  // ========= Shared link display =========
  function showShared(score) {
    isSharedView = true;
    currentLevel = score;

    showResultCard();
    setMainResult(score);
    setProgress(0); // keep empty bar with 0
    setFunny("Shared result", true);
  }

  function initSharedFromUrl() {
    const params = new URLSearchParams(location.search);
    const token = params.get("s");
    if (!token) return false;

    const parsed = parseToken(token);
    if (!parsed) return false;

    showShared(parsed.score);
    return true;
  }

  // ========= Sharing =========
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch (_) {
      return false;
    }
  }

  async function shareSite() {
    const url = safeOrigin() + "/";
    if (navigator.share) {
      await navigator.share({ url });
      return;
    }
    await copyToClipboard(url);
    alert("Link copied!");
  }

  async function shareResult() {
    if (typeof currentLevel !== "number") return shareSite();

    const tier = tierFor(currentLevel);
    const url = signedUrlForScore(currentLevel);

    // WhatsApp reliability: include link inside the text (no separate url field)
    const text = `🔥 ${currentLevel} – ${tier.title} ${tier.emoji}\n${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (_) {}
    }
    await copyToClipboard(text);
    alert("Copied!");
  }

  // ========= Wire up =========
  document.addEventListener("DOMContentLoaded", () => {
    initCookies();

    const shared = initSharedFromUrl();
    if (!shared) restoreLastIfAny();

    checkBtn?.addEventListener("click", startRoll);

    historyBtn?.addEventListener("click", openHistory);
    historyClose?.addEventListener("click", closeHistory);
    historyModal?.addEventListener("click", (e) => {
      if (e.target === historyModal) closeHistory();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeHistory();
    });

    shareBtn?.addEventListener("click", async () => {
      if (isRolling) return;
      try {
        if (typeof currentLevel === "number") await shareResult();
        else await shareSite();
      } catch (_) {}
    });
  });
})();  
