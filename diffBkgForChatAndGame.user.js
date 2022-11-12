// ==UserScript==
// @name         AMQ Different Bkg For Chat/Game
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  AMQ Diff Background For Chat and Game
// @author       Graywing13
// @match        https://animemusicquiz.com/
// @downloadURL  https://github.com/Graywing13/amq-scripts/blob/main/diffBkgForChatAndGame.user.js
// @updateURL    https://github.com/Graywing13/amq-scripts/blob/main/diffBkgForChatAndGame.user.js
// ==/UserScript==

// === [ SETTINGS ] ============================================

// GAME BKG SETTINGS. Make sure the image link ends in .jpg, .png, or an equivalent.
// If you are facing misalignment issues with Elodie's script, your best bet is to set gameBgLink to "" (an empty string). This will only use Elodie's background.
const gameBgLink = "";

// CHAT SETTINGS. You can pick an image and two colours.
const topChatColourHex = "rgba(0, 0, 0, 0.5)"; // Use the format rgba(r, g, b, a) where a is a number from 0 to 1.
const bottomChatColourHex = "rgba(0, 0, 0, 0.5)";
const chatBgLink = "https://images.immediate.co.uk/production/volatile/sites/4/2018/08/iStock_13967830_XLARGE-90f249d.jpg"

// =============================================================

let msgContainer = document.getElementById("gcMessageContainer");
if (msgContainer !== undefined) {
    msgContainer.style.backgroundImage=`linear-gradient(to bottom, ${topChatColourHex}, ${bottomChatColourHex}), url(${chatBgLink})`;
    msgContainer.style.backgroundSize="cover";
    msgContainer.style.backgroundPosition="center";
}

let inGameContainer = document.getElementById("gameChatPage").getElementsByClassName("col-xs-9")[0];
if (inGameContainer !== undefined) {
    inGameContainer.style.backgroundImage=`url(${gameBgLink})`;
    inGameContainer.style.backgroundPosition="center";
    inGameContainer.style.backgroundSize="cover";
}
