// ==UserScript==
// @name         AMQ Prevent Hiding Song Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show previous song's info during guessing phase
// @author       Graywing13
// @match        https://animemusicquiz.com/*
// @downloadURL  https://github.com/Graywing13/amq-scripts/blob/main/preventHidingSongInfo.user.js
// @updateURL    https://github.com/Graywing13/amq-scripts/blob/main/preventHidingSongInfo.user.js
// ==/UserScript==

if (typeof Listener === "undefined") return;
const loadInterval = setInterval(() => {
    if (document.getElementById("loadingScreen").classList.contains("hidden")) {
        clearInterval(loadInterval);
        setup();
    }
}, 500);

function setup() {
    $('#qpInfoHider').css({
        "display": "none"
    })
    $('#qpSongInfoContainer h3').text("Last Song's Info")
    $('#qpSongName').text("n/a")
    $('#qpSongArtist').text("n/a")
    $('#qpSongType').text("n/a")
}