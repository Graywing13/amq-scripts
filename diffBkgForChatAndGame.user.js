// ==UserScript==
// @name         AMQ Different Bkg For Chat/Game
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  AMQ Diff Background For Chat and Game
// @author       Graywing13
// @match        https://*.animemusicquiz.com/*
// @downloadURL  https://github.com/Graywing13/amq-scripts/blob/main/diffBkgForChatAndGame.user.js
// @updateURL    https://github.com/Graywing13/amq-scripts/blob/main/diffBkgForChatAndGame.user.js
// ==/UserScript==

// === [ SETTINGS ] ============================================

if (document.getElementById("loginPage")) return;

// GAME BKG SETTINGS. Make sure the image link ends in .jpg, .png, or an equivalent.
const gameBgLink =
  "https://images.livemint.com/img/2022/08/01/1600x900/Cat-andriyko-podilnyk-RCfi7vgJjUY-unsplash_1659328989095_1659328998370_1659328998370.jpg";

// CHAT SETTINGS. You can pick an image and two colours.
const topChatColourHex = "rgba(0, 0, 0, 0.5)"; // Use the format rgba(r, g, b, a) where a is a number from 0 to 1.
const bottomChatColourHex = "rgba(0, 0, 0, 0.5)";
const chatBgLink =
  "https://images.immediate.co.uk/production/volatile/sites/4/2018/08/iStock_13967830_XLARGE-90f249d.jpg";

// =============================================================

const msgContainerBkgImg = `linear-gradient(to bottom, ${topChatColourHex}, ${bottomChatColourHex}), url(${chatBgLink})`;
const msgContainerPanels = [
  "gcMessageContainer",
  "gcSpectatorList",
  "gcQueueList"
];

msgContainerPanels.forEach((panel) => {
  const panelContainer = document.getElementById(panel);
  if (panelContainer !== null) {
    panelContainer.style.backgroundImage = msgContainerBkgImg;
    panelContainer.style.backgroundSize = "cover";
    panelContainer.style.backgroundPosition = "center";
  }
});

const inGameContainer = document
  .getElementById("gameChatPage")
  .getElementsByClassName("col-xs-9")[0];
if (inGameContainer !== undefined) {
  inGameContainer.style.backgroundImage = `url(${gameBgLink})`;
  inGameContainer.style.backgroundPosition = "center";
  inGameContainer.style.backgroundSize = "cover";
}
