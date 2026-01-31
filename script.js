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

  // Boss checker elements
  const checkBtn = document.getElementById("checkBtn");
  const placeholder = document.getElementById("placeholder");
  const placeholderText = document.getElementById("placeholderText");
  const result = document.getElementById("result");
  const resultNumber = document.getElementById("resultNumber");
  const resultTier = document.getElementById("resultTier");
  const resultIcon = document.getElementById("resultIcon");
  const bossImage = document.getElementById("bossImage");

  const btnIcon = document.getElementById("btnIcon");
  const btnText = document.getElementById("btnText");
  // Ads navigation (separate pages now)
  // Home page uses a normal link to commercials.html.

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
