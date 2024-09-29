// ==UserScript==
// @name         AMQ Tab Key to Skip
// @namespace    https://github.com/Graywing13
// @version      1.0
// @description  Lets AMQ songs be skipped using the tab key while playing an AMQ game.
// @author       Graywing13
// @match        https://*.animemusicquiz.com/*
// @downloadURL  https://github.com/Graywing13/amq-scripts/blob/main/tabKeySkip.user.js
// @updateURL    https://github.com/Graywing13/amq-scripts/blob/main/tabKeySkip.user.js
// ==/UserScript==

// credits to TheJoseph98 for this code block
if (document.getElementById("startPage")) return;
let loadInterval = setInterval(() => {
  if (document.getElementById("loadingScreen").classList.contains("hidden")) {
    clearInterval(loadInterval);
  }
}, 500);

// quiz skip with tab key
document.addEventListener("keyup", function (event) {
  if (event.key === "Tab") {
    event.preventDefault();
    quiz.skipClicked();
  }
});
