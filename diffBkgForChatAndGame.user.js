// ==UserScript==
// @name         AMQ Different Bkg For Chat/Game
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AMQ Diff Background For Chat and Game
// @author       Graywing13
// @match        https://animemusicquiz.com/
// ==/UserScript==

// === [ SETTINGS ] ============================================

// GAME BKG SETTINGS. Make sure the image link ends in .jpg, .png, or an equivalent.
const gameBgLink = "https://images.livemint.com/img/2022/08/01/1600x900/Cat-andriyko-podilnyk-RCfi7vgJjUY-unsplash_1659328989095_1659328998370_1659328998370.jpg"

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


let lobbyAvatarContainer = document.getElementById("lobbyAvatarContainer");
if (lobbyAvatarContainer !== undefined) {
    lobbyAvatarContainer.style.backgroundImage=`url(${gameBgLink})`;
    lobbyAvatarContainer.style.backgroundSize="cover";
    lobbyAvatarContainer.style.backgroundPosition="center";
}

let inGameContainer = document.getElementById("gameChatPage").getElementsByClassName("col-xs-9")[0];
if (inGameContainer !== undefined) {
    inGameContainer.style.backgroundImage=`url(${gameBgLink})`;
    inGameContainer.style.backgroundPosition="center";
    inGameContainer.style.backgroundSize="cover";
}
