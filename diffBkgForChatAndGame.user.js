// ==UserScript==
// @name         AMQ Different Bkg For Chat/Game
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AMQ Diff Background For Chat and Game
// @author       Graywing13
// @match        https://animemusicquiz.com/
// @downloadURL  https://github.com/Graywing13/amq-scripts/blob/main/diffBkgForChatAndGame.user.js
// @updateURL    https://github.com/Graywing13/amq-scripts/blob/main/diffBkgForChatAndGame.user.js
// ==/UserScript==

// === [ SETTINGS ] ============================================

const chatBgLink = "https://images.immediate.co.uk/production/volatile/sites/4/2018/08/iStock_13967830_XLARGE-90f249d.jpg"
const gameBgLink = "https://images.livemint.com/img/2022/08/01/1600x900/Cat-andriyko-podilnyk-RCfi7vgJjUY-unsplash_1659328989095_1659328998370_1659328998370.jpg"

// =============================================================

let msgContainer = document.getElementById("gcMessageContainer");
if (msgContainer !== undefined) {
    msgContainer.style.backgroundImage=`url(${chatBgLink})`;
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
