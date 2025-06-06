// ==UserScript==
// @name         AMQ Prevent Hiding Song Info
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Show previous song's info during guessing phase
// @author       Graywing13
// @match        https://animemusicquiz.com/*
// @downloadURL  https://github.com/Graywing13/amq-scripts/raw/main/preventHidingSongInfo.user.js
// @updateURL    https://github.com/Graywing13/amq-scripts/raw/main/preventHidingSongInfo.user.js
// ==/UserScript==

if (typeof Listener === "undefined") return;
const loadInterval = setInterval(() => {
    if (document.getElementById("loadingScreen").classList.contains("hidden")) {
        clearInterval(loadInterval);
        setup();
    }
}, 500);

function setup() {
    setupPrevInfo()
    setupCurrInfo()
    setupListener()
}

function setupPrevInfo() {
    $('#qpInfoHider').css({
        "display": "none"
    })
    $('#qpSongName').text("-")
    $('#qpSongArtist').text("-")
    $('#qpSongType').text("-")

    const header = $('#qpSongInfoContainer h3')
    header.text("Prev: n/a")
    header.css({
        'text-overflow': 'ellipsis',
        'overflow': 'hidden',
        'height': '1.3em',
        'white-space': 'nowrap',
        'padding': '0 8px'
    })
    header.popover({
        placement: 'bottom',
        content: 'No previous song yet',
        trigger: 'hover',
        container: 'body',
        animation: false
    })
}

function setupCurrInfo() {
    const currentTextColour = $('#qpUpvoteContainer').css('background-color')
    const currentText = document.createElement('div')
    currentText.innerText = "Current"
    currentText.style.cssText = [
        'background-color: ' + currentTextColour,
        'border-top: solid 1px #1b1b1b',
        'margin-top: 5px',
    ].join(";");
    $('#qpRateOuterContainer').prepend(currentText)
    $('#qpInnerContainer')?.css({
        'margin-top': '0'
    })
}

function setupListener() {
    const answerResultsListener = new Listener("answer results", (result) => {
        const animeName = getAnimeName(result)
        const header = $('#qpSongInfoContainer h3')
        header.text("Prev: " + animeName)
        header.attr('data-content', animeName)
        header.addClass('aicTrigger')
        header.click(() => {
            songHistoryWindow?.currentGameTab?.table?.rows?.slice(-1)?.[0]?.$body?.[0]?.click()
        })
    })
    answerResultsListener.bindListener()
}

function getAnimeName(result) {
    if (options?.useRomajiNames) {
        return result.songInfo.animeNames["romaji"]
    } else {
        return result.songInfo.animeNames["english"]
    }
}