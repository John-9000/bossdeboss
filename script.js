const ICONS = {
  crown:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l4 6 5-7 5 7 4-6v13H3V7z"></path><path d="M3 20h18"></path></svg>',
  sparkles:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"></path><path d="M5 13l.8 2.4L8 16l-2.2.6L5 19l-.8-2.4L2 16l2.2-.6L5 13z"></path><path d="M19 13l.8 2.4L22 16l-2.2.6L19 19l-.8-2.4L16 16l2.2-.6L19 13z"></path></svg>',
  zap:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>',
  target:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
  trophy:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10v3a5 5 0 0 1-10 0V4z"></path><path d="M17 4h3v2a4 4 0 0 1-4 4"></path><path d="M7 4H4v2a4 4 0 0 0 4 4"></path></svg>',
  megaphone:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a2 2 0 0 0 2 2h2l5 4V5L7 9H5a2 2 0 0 0-2 2z"></path><path d="M16 8a3 3 0 0 1 0 8"></path><path d="M19 5a7 7 0 0 1 0 14"></path></svg>',
};
// ===== Signed link helpers =====
const SHARE_SECRET = "bossdeboss_static_secret_v1";
function checksum(str){
  let h = 0;
  for(let i=0;i<str.length;i++){ h = (h * 31 + str.charCodeAt(i)) >>> 0; }
  return h.toString(36);
}
function makeToken(score){
  const payload = String(score) + "|" + Date.now().toString(36);
  const sig = checksum(payload + "|" + SHARE_SECRET);
  return btoa(payload + "|" + sig);
}
function parseToken(token){
  try{
    const raw = atob(token);
    const parts = raw.split("|");
    if(parts.length !== 3) return null;
    const [scoreStr, ts, sig] = parts;
    const check = checksum(scoreStr + "|" + ts + "|" + SHARE_SECRET);
    if(check !== sig) return null;
    const score = parseInt(scoreStr,10);
    if(!Number.isInteger(score) || score < 1 || score > 100) return null;
    return { score };
  }catch(e){ return null; }
}
function createSignedUrl(score){
  // Use your real domain even if testing locally
  return BASE_URL + "/index.html?s=" + encodeURIComponent(makeToken(score));
}


function tierFor(level) {
  if (level >= 90) return { title: "LEGENDARY BOSS", colorVar: "--yellow", icon: "trophy" };
  if (level >= 70) return { title: "ELITE BOSS", colorVar: "--purple", icon: "crown" };
  if (level >= 50) return { title: "RISING BOSS", colorVar: "--blue", icon: "zap" };
  if (level >= 30) return { title: "APPRENTICE BOSS", colorVar: "--green", icon: "target" };
  return { title: "NOVICE BOSS", colorVar: "--gray", icon: "sparkles" };
}


const FUNNY_TEXTS = {
  novice: [
    "Every boss starts somewhere.",
    "Still reading the boss manual.",
    "Coffee break boss energy.",
    "Boss in training mode.",
    "Keyboard louder than confidence.",
    "Assistant to the regional boss.",
    "Wi‑Fi stronger than power.",
    "Still unlocking boss skills.",
    "Boss vibes buffering…",
    "Learning the secret handshake.",
    "Boss shoes still shiny.",
    "Power nap certified.",
    "Boss alarm snoozed.",
    "Spreadsheet warrior.",
    "Boss aura loading…",
    "Motivation pending approval.",
    "Office chair CEO.",
    "Almost intimidating.",
    "Boss energy on airplane mode.",
    "Practicing the stare.",
    "Budget boss.",
    "Boss level: tutorial.",
    "Confidence warming up.",
    "Boss instincts downloading…",
    "Legend pending.",
    "Small boss, big dreams.",
    "Not bossy—just ambitious.",
    "CEO of “maybe later.”",
  ],
  apprentice: [
    "Boss with potential.",
    "Confidence upgraded.",
    "People starting to notice.",
    "Boss energy rising.",
    "Office legend rumors.",
    "Still humble, mostly.",
    "Boss handshake unlocked.",
    "Voice carries further.",
    "Meetings fear you.",
    "Keyboard respected.",
    "Coffee obeys you.",
    "Promotion aura detected.",
    "Boss mode warming.",
    "Authority increasing.",
    "Decisions slightly faster.",
    "Boss instincts sharp.",
    "Desk presence strong.",
    "Leadership beta.",
    "Power stance improving.",
    "Boss shoes broken in.",
    "Respect installing…",
    "Boss playlist curated.",
    "Confidence compiling…",
    "Boss brain online.",
    "Almost legendary.",
    "You’re not late—you’re dramatic.",
    "Rising like fresh toast.",
    "CEO of “good enough.”",
  ],
  rising: [
    "People listen now.",
    "Boss energy undeniable.",
    "Meetings end faster.",
    "Decisions land hard.",
    "Boss presence felt.",
    "Power suit energy.",
    "Confidence at scale.",
    "Voice carries weight.",
    "Room temperature changes.",
    "Boss aura stable.",
    "Respect delivered.",
    "Authority unlocked.",
    "Boss instincts sharp.",
    "Momentum building.",
    "Eyes follow you.",
    "Keyboard obeys.",
    "Boss energy certified.",
    "Leadership activated.",
    "No nonsense detected.",
    "Commanding presence.",
    "Boss level rising.",
    "Strategy installed.",
    "Confidence overflow.",
    "Boss energy flex.",
    "Legend forming.",
    "Walking KPI.",
    "You negotiate with gravity.",
    "Meetings request *you*.",
  ],
  elite: [
    "Room goes quiet.",
    "Boss energy intimidating.",
    "Decisions shape reality.",
    "Authority unquestioned.",
    "Power walks louder.",
    "Boss aura maxed.",
    "Respect guaranteed.",
    "Leadership absolute.",
    "Meetings obey.",
    "Confidence unstoppable.",
    "Boss instincts elite.",
    "Commanding silence.",
    "Strategy flawless.",
    "Boss presence heavy.",
    "Eyes locked.",
    "Influence detected.",
    "Boss energy peaks.",
    "Power undeniable.",
    "Leadership refined.",
    "Elite mindset active.",
    "Boss moves decisive.",
    "Authority mastered.",
    "Confidence lethal.",
    "Boss legend near.",
    "Feared politely.",
    "Your calendar fears you.",
    "You don’t chase goals—goals chase you.",
    "Handshake is a contract.",
  ],
  legendary: [
    "Boss mythology confirmed.",
    "Legend walks among us.",
    "Reality bends slightly.",
    "Boss energy absolute.",
    "Power unmatched.",
    "History remembers this.",
    "Authority unquestionable.",
    "Boss aura eternal.",
    "Legends whisper.",
    "Respect infinite.",
    "Power level capped.",
    "Boss final form.",
    "Legacy activated.",
    "Influence timeless.",
    "Boss energy god-tier.",
    "Legend certified.",
    "Myth unlocked.",
    "Boss presence iconic.",
    "Power perfected.",
    "History rewritten.",
    "Boss energy complete.",
    "Ultimate authority.",
    "Legend status permanent.",
    "Reality approves.",
    "Boss achieved.",
    "Your name is a strategy.",
    "Even luck takes notes.",
    "The room pays rent to you.",
  ],
};

function setColor(el, cssVarName) {
  if (!el) return;
  const color = getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim();
  el.style.color = color || "";
}

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------
  // 1-hour cooldown (localStorage)
  // -------------------------
  const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
  const STORAGE_KEY = "boss_last_check_ms";
  const RESULT_KEY = "boss_last_result"; // JSON: { level }
  const HISTORY_KEY = "boss_history_v1"; // JSON array: [{ level, ts }], newest first (max 7)


  function getLastCheck() {
    const v = localStorage.getItem(STORAGE_KEY);
    const n = v ? Number(v) : 0;
    return Number.isFinite(n) ? n : 0;
  }
  function setLastCheck(ms) {
    localStorage.setItem(STORAGE_KEY, String(ms));
  }
  function formatRemaining(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    if (m <= 0) return `${s}s`;
    return `${m}m ${s}s`;
  }

  // -------------------------
  // Cookie consent + AdSense load gating (localStorage)
  // -------------------------
  const CONSENT_KEY = "boss_cookie_consent"; // "granted" | "denied"
  const cookieBanner = document.getElementById("cookieBanner");
  const cookieAccept = document.getElementById("cookieAccept");
  const cookieDecline = document.getElementById("cookieDecline");

  // Replace with your real Publisher ID later:
  const ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX";
  const ADSENSE_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

  let adsenseLoaded = false;

  function getCookie(name) {
    try {
      const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/\+^]/g, '\$&') + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : null;
    } catch {
      return null;
    }
  }
  function setCookie(name, value, days) {
    try {
      const maxAge = days ? `; max-age=${days * 24 * 60 * 60}` : "";
      document.cookie = `${name}=${encodeURIComponent(value)}${maxAge}; path=/; samesite=lax`;
    } catch { }
  }

  function getConsent() {
    // Prefer localStorage, but fall back to a cookie so the choice persists across pages
    // even in restrictive environments.
    return localStorage.getItem(CONSENT_KEY) || getCookie(CONSENT_KEY);
  }
  function setConsent(v) {
    localStorage.setItem(CONSENT_KEY, v);
    setCookie(CONSENT_KEY, v, 365);
  }
  function showCookieBanner(show) {
    if (!cookieBanner) return;
    cookieBanner.classList.toggle("hidden", !show);
  }

  function loadAdSenseOnce() {
    if (adsenseLoaded) return;
    // if script tag already exists (navigating between pages), mark loaded
    if (document.querySelector(`script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`)) {
      adsenseLoaded = true;
      return;
    }

    adsenseLoaded = true;
    const s = document.createElement("script");
    s.async = true;
    s.src = ADSENSE_SRC;
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  function tryRenderAds() {
    if (getConsent() !== "granted") return;
    loadAdSenseOnce();

    const units = document.querySelectorAll("ins.adsbygoogle");
    units.forEach((u) => {
      if (u.getAttribute("data-ads-init") === "1") return;
      u.setAttribute("data-ads-init", "1");
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }

  // Cookie banner logic (works on all pages)
  const consent = getConsent();
  if (consent !== "granted" && consent !== "denied") {
    showCookieBanner(true);
  } else {
    showCookieBanner(false);
    if (consent === "granted") loadAdSenseOnce();
  }

  cookieAccept?.addEventListener("click", () => {
    setConsent("granted");
    showCookieBanner(false);
    tryRenderAds();
  });

  cookieDecline?.addEventListener("click", () => {
    setConsent("denied");
    showCookieBanner(false);
  });

  // If this is the commercials page (has ad units), attempt render after consent.
  tryRenderAds();

  // -------------------------
  // Boss checker (only on index.html)
  // -------------------------
  const checkBtn = document.getElementById("checkBtn");
  if (!checkBtn) return; // not on the home page

  const placeholder = document.getElementById("placeholder");
  const placeholderText = document.getElementById("placeholderText");
  const result = document.getElementById("result");
  const resultNumber = document.getElementById("resultNumber");
  const resultTier = document.getElementById("resultTier");
  const resultIcon = document.getElementById("resultIcon");
  const bossImage = document.getElementById("bossImage");
  const progressBlock = document.getElementById("progressBlock");
  const progressValue = document.getElementById("progressValue");
  const progressFill = document.getElementById("progressFill");
  const btnIcon = document.getElementById("btnIcon");
  const btnText = document.getElementById("btnText");

  let cooldownTimer = null;

  function updateCooldownUI() {
    const last = getLastCheck();
    const now = Date.now();
    const remaining = last + COOLDOWN_MS - now;

    if (remaining > 0) {
      if (!checkBtn.disabled) checkBtn.disabled = true;
      if (btnText && btnText.textContent !== "Checking...") {
        btnText.textContent = `Come back in ${formatRemaining(remaining)}`;
      }
      return true;
    }

    if (btnText && btnText.textContent !== "Checking...") {
      btnText.textContent = "Check My Boss Level";
    }
    checkBtn.disabled = false;
    return false;
  }

  function startCooldownTicker() {
    if (cooldownTimer) clearInterval(cooldownTimer);
    cooldownTimer = setInterval(() => {
      const stillCooling = updateCooldownUI();
      if (!stillCooling) {
        clearInterval(cooldownTimer);
        cooldownTimer = null;
      }
    }, 1000);
  }

  function setAnimating(isAnimating) {
    if (isAnimating) checkBtn.disabled = true;

    // No "Calculating..." message; we show a progress bar instead.
    placeholder?.classList.toggle("pulse", false);

    if (btnText) btnText.textContent = isAnimating ? "Checking..." : "Check My Boss Level";

    if (btnIcon) {
      if (isAnimating) {
        btnIcon.innerHTML = ICONS.sparkles;
        btnIcon.querySelector("svg")?.classList.add("spin");
      } else {
        btnIcon.innerHTML = ICONS.target;
        btnIcon.querySelector("svg")?.classList.remove("spin");
      }
    }
  }

  function showPlaceholder() {
    placeholder?.classList.remove("hidden");
    result?.classList.add("hidden");
  }

  function showResult(level) {
    currentLevel = level;
    __sharedMode = false;
    document.getElementById('sharedLabel')?.remove();
    // No special cases: score 100 is treated like any other Legendary score.
    // Never load or show boss images.
    if (bossImage) {
      bossImage.removeAttribute("src");
      bossImage.classList.add("hidden");
    }
    result?.classList.remove("hasImage");

const info = tierFor(level);

    if (resultNumber) resultNumber.textContent = String(level);
    if (resultTier) resultTier.textContent = info.title;

    setColor(resultNumber, info.colorVar);
    setColor(resultTier, info.colorVar);

    if (resultIcon) {
      resultIcon.innerHTML = ICONS[info.icon] || ICONS.crown;
      const svg = resultIcon.querySelector("svg");
      if (svg) {
        svg.classList.add("icon");
        setColor(svg, info.colorVar);
      }
    }

    placeholder?.classList.add("hidden");
    result?.classList.remove("hidden");
  }

  function updateLiveResult(level) {
    const info = tierFor(level);

    // Always keep images hidden while animating (show at the very end only)
    if (bossImage) {
      bossImage.removeAttribute("src");
      bossImage.classList.add("hidden");
    }
    result?.classList.remove("hasImage");

    if (resultNumber) resultNumber.textContent = String(level);
    if (resultTier) resultTier.textContent = info.title;

    setColor(resultNumber, info.colorVar);
    setColor(resultTier, info.colorVar);

    if (resultIcon) {
      resultIcon.innerHTML = ICONS[info.icon] || ICONS.crown;
      const svg = resultIcon.querySelector("svg");
      if (svg) {
        svg.classList.add("icon");
        setColor(svg, info.colorVar);
      }
    }
  }

  function setProgress(value) {
    if (!progressBlock || !progressValue || !progressFill) return;

    progressBlock.classList.remove("hidden");

    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    progressValue.textContent = String(clamped);

    const info = tierFor(clamped);
    const color = getComputedStyle(document.documentElement).getPropertyValue(info.colorVar).trim() || "";
    progressValue.style.color = color;
    progressFill.style.background = color || "";
    progressFill.style.width = `${clamped}%`;
  }

  function hideProgress() {
    progressBlock?.classList.add("hidden");
  }

  function renderFunny(text) {
    if (!progressBlock) return;

    progressBlock.querySelectorAll(".bossFunny").forEach((n) => n.remove());
    if (!text) return;

    const funny = document.createElement("div");
    funny.className = "bossFunny";
    funny.textContent = text;
    progressBlock.appendChild(funny);
  }

  function saveLastResult(level, funnyText) {
    try {
      localStorage.setItem(RESULT_KEY, JSON.stringify({ level, funnyText }));
      sessionStorage.setItem(RESULT_KEY, JSON.stringify({ level, funnyText }));
    } catch { }
  }

  function restoreLastResult() {
    try{
      const _p=new URLSearchParams(location.search);
      if(_p.has("s")) return false;
    }catch(e){}
    try {
      const raw = localStorage.getItem(RESULT_KEY) || sessionStorage.getItem(RESULT_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      const level = Number(parsed?.level);
      if (!Number.isFinite(level) || level < 1 || level > 100) return false;

      showResult(level);
      setProgress(level); // keep progress bar + number under the result
      renderFunny(parsed?.funnyText || "");
      return true;

    } catch {
      return false;
    }
  }


  function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function saveHistory(level) {
    try {
      const ts = Date.now();
      const arr = loadHistory();

      // If the newest entry is identical and very recent, don't duplicate
      const newest = arr[0];
      if (newest && newest.level === level && typeof newest.ts === "number" && (ts - newest.ts) < 1500) {
        return;
      }

      const next = [{ level, ts }, ...arr].slice(0, 7);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch { }
  }

  function formatWhen(ts) {
    const now = Date.now();
    const diffMs = Math.max(0, now - ts);
    const hourMs = 60 * 60 * 1000;
    const dayMs = 24 * 60 * 60 * 1000;

    // < 1 hour
    if (diffMs < hourMs) return "Just now";

    // 1–23 hours
    const hours = Math.floor(diffMs / hourMs);
    if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;

    // 24–47 hours
    if (hours < 48) return "Yesterday";

    const days = Math.floor(diffMs / dayMs);
    // 2–13 days
    if (days < 14) return `${days} days ago`;

    try {
      return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(ts));
    } catch {
      const d = new Date(ts);
      return d.toLocaleDateString();
    }
  }

  function shortTierLabel(level) {
    const t = tierFor(level).title || "";
    return t.replace(/\s*BOSS\s*$/i, "");
  }

  function renderHistory() {
    const list = document.getElementById("historyList");
    if (!list) return;

    const items = loadHistory();
    if (!items.length) {
      list.innerHTML = '<div class="historyEmpty">No history yet.\n<br/>Check your Boss Level to create entries.</div>';
      return;
    }

    list.innerHTML = items.map((it) => {
      const lvl = Math.max(1, Math.min(100, Number(it.level) || 1));
      const info = tierFor(lvl);
      const label = shortTierLabel(lvl);
      const when = formatWhen(Number(it.ts) || Date.now());
      const color = getComputedStyle(document.documentElement).getPropertyValue(info.colorVar).trim() || "";

      const safeLabel = label.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const safeWhen = when.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      return `
        <div class="historyRow">
          <div class="historyLabel" style="color:${color}">${safeLabel}</div>
          <div class="historyBar" aria-label="Result ${lvl}">
            <div class="historyBarFill" style="width:${lvl}%; background:${color}"></div>
            <div class="historyBarText">${lvl}</div>
          </div>
          <div class="historyWhen" style="color:${color}">${safeWhen}</div>
        </div>
      `;
    }).join("");
  }

  // initial UI

  if (btnIcon) btnIcon.innerHTML = ICONS.target;
  updateCooldownUI();
  startCooldownTicker();

  // Restore last shown result/progress (e.g., after visiting Commercials and coming back)
  restoreLastResult();

  
  function emojiForLevel(level){
    const info = tierFor(level);
    const map = { sparkles:"✨", target:"🎯", zap:"⚡", crown:"👑", trophy:"🏆", megaphone:"📣" };
    return map[info.icon] || "👑";
  }
// Top actions (Share / Boss History)
  const shareBtn = document.getElementById("shareBtn");
  shareBtn?.addEventListener("click", async () => {
    // If no result yet → share homepage
    if (typeof currentLevel !== "number") {
      if (!navigator.share) return;
      await navigator.share({
        text: `Boss Level Checker
${BASE_URL}`
      });
      

  const historyBtn = document.getElementById("historyBtn");
  const historyModal = document.getElementById("historyModal");
  const historyClose = document.getElementById("historyClose");

  // --- Signed link: display shared result (no history), keep progress bar at 0 ---
  (function handleSharedLink(){
    const params = new URLSearchParams(location.search);
    const token = params.get("s");
    if(!token) return;

    const parsed = parseToken(token);
    if(!parsed) return;

    __sharedMode = true;
    currentLevel = parsed.score;

    // Show result card (score/tier/icon) but keep progress block visible at 0
    placeholder?.classList.add("hidden");
    result?.classList.remove("hidden");

    const info = tierFor(parsed.score);
    resultNumber.textContent = String(parsed.score);
    resultTier.textContent = info.title;
    resultIcon.innerHTML = ICONS[info.icon] || "";

    // Keep empty progress bar with 0
    setProgress(0);

    // Replace funny text with "Shared result" under the progress bar
    renderFunny("Shared result");

    // Ensure it stays even if other init code runs
    setTimeout(() => {
      renderFunny("Shared result");
      const funnyEl2 = progressBlock?.querySelector(".bossFunny");
      if(funnyEl2) funnyEl2.style.opacity = "0.7";
    }, 0);

    // Make it slightly grey (without changing CSS file)
    const funnyEl = progressBlock?.querySelector(".bossFunny");
    if(funnyEl) funnyEl.style.opacity = "0.7";
  })();

  // --- Share: before roll share homepage; after roll share signed link + score/tier/emoji in text ---
  return;
    }

    const token = makeToken(currentLevel);
    const signedUrl = `${BASE_URL}/index.html?s=${encodeURIComponent(token)}`;
    const tier = tierFor(currentLevel).title;
    const emojiMap = { Novice:"✨", Apprentice:"🎯", Rising:"⚡", Elite:"👑", Legendary:"🏆" };
    const emoji = emojiMap[tier] || "👑";

    if (!navigator.share) return;

    await navigator.share({
      text: `🔥 I rolled ${currentLevel} – ${tier} BOSS ${emoji}
Verified link 👇
${signedUrl}`
    });
  });


  function openHistory() {
    if (!historyModal) return;
    renderHistory();
    historyModal.classList.remove("hidden");
  }
  function closeHistory() {
    historyModal?.classList.add("hidden");
  }

  historyBtn?.addEventListener("click", openHistory);
  historyClose?.addEventListener("click", closeHistory);
  historyModal?.addEventListener("click", (e) => {
    if (e.target === historyModal) closeHistory();
  });

  return;
    }

    const token = makeToken(currentLevel);
    const signedUrl = `${BASE_URL}/index.html?s=${encodeURIComponent(token)}`;
    const tier = tierFor(currentLevel).title;
    const emojiMap = { Novice:"✨", Apprentice:"🎯", Rising:"⚡", Elite:"👑", Legendary:"🏆" };
    const emoji = emojiMap[tier] || "👑";

    if (!navigator.share) return;

    await navigator.share({
      text: `🔥 I rolled ${currentLevel} – ${tier} BOSS ${emoji}
Verified link 👇
${signedUrl}`
    });
  });




  let timer = null;

  checkBtn.addEventListener("click", () => {
    const last = getLastCheck();
    const now = Date.now();
    const remaining = last + COOLDOWN_MS - now;

    if (remaining > 0) {
      if (btnText) btnText.textContent = `Come back in ${formatRemaining(remaining)}`;
      startCooldownTicker();
      return;
    }

    // Decide the final result upfront so the progress can count toward it
    const level = Math.floor(Math.random() * 100) + 1;

    // Lock immediately to prevent spam
    setLastCheck(now);
    updateCooldownUI();
    startCooldownTicker();

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    setAnimating(true);

    // Use the result rectangle to display the progress bar (no text message)
    placeholder?.classList.add("hidden");
    result?.classList.remove("hidden");
    result?.classList.remove("hasImage");
    if (bossImage) {
      bossImage.removeAttribute("src");
      bossImage.classList.add("hidden");
    }

    setProgress(0);
    updateLiveResult(0);

    const duration = 720; // ~1.4 seconds
    const start = performance.now();

    function tick(t) {
      const p = Math.min(1, (t - start) / duration);
      // Ease-out: fast at start, slower near the end
      const eased = 1 - Math.pow(1 - p, 1.3);
      const current = Math.floor(level * eased);
      setProgress(current);
      updateLiveResult(current);

      if (p < 1) {
        requestAnimationFrame(tick);
        return;
      }

      // Finish
      setProgress(level); // ensure exact

      showResult(level);
      saveLastResult(level);
      saveHistory(level);
      const tierKey = tierFor(level).title.replace(/\s*BOSS/i, "").toLowerCase();
      const arr = FUNNY_TEXTS[tierKey] || [];
      const funnyText = (arr[Math.floor(Math.random() * arr.length)] || "");

      renderFunny(funnyText);

      showResult(level);
      saveLastResult(level, funnyText);
      saveHistory(level);



      setAnimating(false);
      timer = null;

      updateCooldownUI();
    }

    requestAnimationFrame(tick);
  });
});
