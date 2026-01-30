const ICONS = {"crown": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 7l4 6 5-7 5 7 4-6v13H3V7z\"></path><path d=\"M3 20h18\"></path></svg>", "sparkles": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z\"></path><path d=\"M5 13l.8 2.4L8 16l-2.2.6L5 19l-.8-2.4L2 16l2.2-.6L5 13z\"></path><path d=\"M19 13l.8 2.4L22 16l-2.2.6L19 19l-.8-2.4L16 16l2.2-.6L19 13z\"></path></svg>", "zap": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M13 2L3 14h9l-1 8 10-12h-9l1-8z\"></path></svg>", "target": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"6\"></circle><circle cx=\"12\" cy=\"12\" r=\"2\"></circle></svg>", "trophy": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 21h8\"></path><path d=\"M12 17v4\"></path><path d=\"M7 4h10v3a5 5 0 0 1-10 0V4z\"></path><path d=\"M17 4h3v2a4 4 0 0 1-4 4\"></path><path d=\"M7 4H4v2a4 4 0 0 0 4 4\"></path></svg>", "megaphone": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 11v2a2 2 0 0 0 2 2h2l5 4V5L7 9H5a2 2 0 0 0-2 2z\"></path><path d=\"M16 8a3 3 0 0 1 0 8\"></path><path d=\"M19 5a7 7 0 0 1 0 14\"></path></svg>"};

function tierFor(level) {
  if (level >= 90) return { title: "LEGENDARY BOSS", colorVar: "--yellow", icon: "trophy" };
  if (level >= 70) return { title: "ELITE BOSS", colorVar: "--purple", icon: "crown" };
  if (level >= 50) return { title: "RISING BOSS", colorVar: "--blue", icon: "zap" };
  if (level >= 30) return { title: "APPRENTICE BOSS", colorVar: "--green", icon: "target" };
  return { title: "NOVICE BOSS", colorVar: "--gray", icon: "sparkles" };
}

function setColor(el, cssVarName) {
  const color = getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim();
  el.style.color = color || "";
}

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("slider");

  // Boss checker elements
  const checkBtn = document.getElementById("checkBtn");
  const placeholder = document.getElementById("placeholder");
  const placeholderText = document.getElementById("placeholderText");
  const result = document.getElementById("result");
  const resultNumber = document.getElementById("resultNumber");
  const resultTier = document.getElementById("resultTier");
  const resultIcon = document.getElementById("resultIcon");

  const btnIcon = document.getElementById("btnIcon");
  const btnText = document.getElementById("btnText");

  // Ads navigation
  const toAdsBtn = document.getElementById("toAdsBtn");
  const backBtn = document.getElementById("backBtn");

  // -------------------------
  // 1-hour cooldown (localStorage)
  // -------------------------
  const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
  const STORAGE_KEY = "boss_last_check_ms";

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

  let cooldownTimer = null;
  function updateCooldownUI() {
    const last = getLastCheck();
    const now = Date.now();
    const remaining = (last + COOLDOWN_MS) - now;

    if (remaining > 0) {
      // Don't override the "Checking..." label while animating
      if (!checkBtn.disabled) {
        checkBtn.disabled = true;
      }
      // If not currently animating, show countdown text
      if (btnText.textContent !== "Checking...") {
        btnText.textContent = `Come back in ${formatRemaining(remaining)}`;
      }
      return true;
    }

    // Ready
    if (btnText.textContent !== "Checking...") {
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

  function getConsent() {
    return localStorage.getItem(CONSENT_KEY);
  }
  function setConsent(v) {
    localStorage.setItem(CONSENT_KEY, v);
  }
  function showCookieBanner(show) {
    if (!cookieBanner) return;
    cookieBanner.classList.toggle("hidden", !show);
  }

  function loadAdSenseOnce() {
    if (adsenseLoaded) return;
    adsenseLoaded = true;

    const s = document.createElement("script");
    s.async = true;
    s.src = ADSENSE_SRC;
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  function tryRenderAds() {
    // Only attempt if consent granted
    if (getConsent() !== "granted") return;

    loadAdSenseOnce();

    // Push ads for any ins that isn't initialized
    const units = document.querySelectorAll("ins.adsbygoogle");
    units.forEach((u) => {
      // Prevent duplicate pushes
      if (u.getAttribute("data-ads-init") === "1") return;
      u.setAttribute("data-ads-init", "1");

      // AdSense requires this push call after script is present
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }


  // initial icons
  // Cookie banner on first load (until user chooses)
  const consent = getConsent();
  if (consent !== "granted" && consent !== "denied") {
    showCookieBanner(true);
  } else {
    showCookieBanner(false);
    if (consent === "granted") {
      // Preload ads script in the background; actual render happens on ads screen
      loadAdSenseOnce();
    }
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

  // Enforce cooldown on load (survives refresh)
  updateCooldownUI();
  startCooldownTicker();
  btnIcon.innerHTML = ICONS.target;

  function setAnimating(isAnimating) {
    if (isAnimating) checkBtn.disabled = true;

    placeholder.classList.toggle("pulse", isAnimating);
    placeholderText.textContent = isAnimating ? "Calculating..." : "Press the button to check";

    btnText.textContent = isAnimating ? "Checking..." : "Check My Boss Level";

    if (isAnimating) {
      btnIcon.innerHTML = ICONS.sparkles;
      btnIcon.querySelector("svg")?.classList.add("spin");
    } else {
      btnIcon.innerHTML = ICONS.target;
      btnIcon.querySelector("svg")?.classList.remove("spin");
    }
  }

  function showPlaceholder() {
    placeholder.classList.remove("hidden");
    result.classList.add("hidden");
  }

  function showResult(level) {
    const info = tierFor(level);

    resultNumber.textContent = String(level);
    resultTier.textContent = info.title;

    setColor(resultNumber, info.colorVar);
    setColor(resultTier, info.colorVar);

    resultIcon.innerHTML = ICONS[info.icon] || ICONS.crown;
    const svg = resultIcon.querySelector("svg");
    if (svg) {
      svg.classList.add("icon");
      setColor(svg, info.colorVar);
    }

    placeholder.classList.add("hidden");
    result.classList.remove("hidden");
  }

  let timer = null;

  checkBtn.addEventListener("click", () => {
    // Enforce 1-hour cooldown
    const last = getLastCheck();
    const now = Date.now();
    const remaining = (last + COOLDOWN_MS) - now;

    if (remaining > 0) {
      btnText.textContent = `Come back in ${formatRemaining(remaining)}`;
      startCooldownTicker();
      return;
    }

    // Lock immediately to prevent spam
    setLastCheck(now);
    updateCooldownUI();
    startCooldownTicker();

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    setAnimating(true);
    showPlaceholder();

    timer = setTimeout(() => {
      const level = Math.floor(Math.random() * 100) + 1;
      showResult(level);
      setAnimating(false);
      timer = null;

      // After finishing animation, re-apply cooldown label if needed
      updateCooldownUI();
    }, 600);
  });


  // Slide to ads
  toAdsBtn.addEventListener("click", () => {
    slider.classList.add("is-ads");
    // Add a history entry so Android/iOS swipe-back + browser back work naturally
    if (location.hash !== "#ads") {
      history.pushState({ page: "ads" }, "", "#ads");
    }
    // If consent granted, render ads now
    tryRenderAds();
  });

// Back to first page
  backBtn.addEventListener("click", () => {
    if (location.hash === "#ads") {
      history.back();
    } else {
      slider.classList.remove("is-ads");
    }
  });

// Optional: allow Escape to go back
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (location.hash === "#ads") history.back();
      else slider.classList.remove("is-ads");
    }
  });

  // Respond to browser back/forward and mobile swipe-back gestures
  window.addEventListener("popstate", () => {
    if (location.hash === "#ads") {
      slider.classList.add("is-ads");
      tryRenderAds();
    } else {
      slider.classList.remove("is-ads");
    }
  });

  // If user loads the page directly with #ads, show commercials page
  if (location.hash === "#ads") {
    slider.classList.add("is-ads");
    tryRenderAds();
  }

});
