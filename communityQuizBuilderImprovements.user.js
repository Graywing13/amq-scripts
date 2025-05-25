// ==UserScript==
// @name         AMQ Community Quiz Builder QOL Improvements
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  QOL improvements for community quizzes - song count number editor, song counter, TODO...
// @author       Graywing13
// @match        https://animemusicquiz.com/*
// @downloadURL  https://github.com/Graywing13/amq-scripts/raw/main/communityQuizBuilderImprovements.user.js
// @updateURL    https://github.com/Graywing13/amq-scripts/raw/main/communityQuizBuilderImprovements.user.js
// ==/UserScript==

/**
 * Functionality
 *
 * In Rule Block Header:
 * - Count songs
 * - Search for duplicates
 * - Collapse Rule Block
 *
 * In other areas
 * - Input song counts (see slider)
 * - Display whether quiz was already saved when exiting
 */

if (typeof Listener === "undefined") return;

const loadInterval = setInterval(() => {
    if (document.getElementById("loadingScreen").classList.contains("hidden")) {
        clearInterval(loadInterval);
        // "load custom quiz" doesn't work for new quizzes, use get current master list id instead
        const openCustomQuizListener = new Listener("get current master list id", () => {
            setupSongCounter();
            setupSongCountInputter();
            setupCollapseRuleBlock();
            setupDuplicateSearcher()
            setupAlreadySavedListener()
        });
        openCustomQuizListener.bindListener();
    }
}, 500);

let initialized = false;

const SONG_COUNTER = "SONG_COUNTER"
const ALREADY_SAVED = "ALREADY_SAVED"

function log(category, str) {
    console.log(`Logger[${category}]: ${str}`);
}

// ==[ SONG COUNTER ]============================================================================

function setupSongCounter() {
    if (!initialized) {
        appendDomElements();
        updateRuleBlocks();
        initialized = true;
    }
}

function appendDomElements() {
    const refreshCountsContainer = document.createElement("div")
    refreshCountsContainer.id = "cqcRefreshCountsContainer"
    refreshCountsContainer.style.cssText = [
        "justify-content: center"
    ].join(";");
    $("#cqcQuizCreatorHeader").append(refreshCountsContainer);

    const refreshCountsBtn = document.createElement("div");
    refreshCountsBtn.innerText = "Refresh song counts"
    refreshCountsBtn.className = "cqcCreationBlock";
    refreshCountsBtn.style.cssText = [
        "justify-content: center",
        "background-color: black",
        "cursor: pointer",
        "margin-top: 8px",
    ].join(";");
    refreshCountsBtn.onclick = handleRefreshCounts;
    $("#cqcRefreshCountsContainer").append(refreshCountsBtn);
}

function updateRuleBlocks() {
    const ruleBlocks = $(".cqcRuleBlock");
    ruleBlocks.map(function () {
        const songBlockCount = this.querySelectorAll(".cqcSongBlock").length;
        const animeBlockCount = this.querySelectorAll(".cqcAnimeBlock").length;
        const countsContainer = document.createElement("div")
        countsContainer.innerText = `Song blocks: ${songBlockCount} // Anime blocks: ${animeBlockCount}`;
        this.querySelector(".cqcRuleBlockHeader").appendChild(countsContainer);
    });
    log(SONG_COUNTER, `${ruleBlocks.length} rule blocks counted`);
}

function showRefreshFeedback() {
    const refreshCheckmark = document.createElement("div");
    refreshCheckmark.id = "cqcRefreshFeedback"
    refreshCheckmark.innerText = "✓"
    refreshCheckmark.style.cssText = [
        "color: #58d68d",
    ].join(";");

    $("#cqcRefreshCountsContainer").append(refreshCheckmark);
    window.setTimeout(() => {
        $("#cqcRefreshCountsContainer").remove("#cqcRefreshFeedback");
    }, 500)
}

function handleRefreshCounts() {
    updateRuleBlocks();
    showRefreshFeedback();
}

// ==[ SONG COUNT INPUTTER ]=====================================================================

// TODO see if this is 1 element, or if there are many
function setupSongCountInputter() {
    const sliderContainer = $(".cqcBlockRuleChangeBaseSliderContainer")
    const inputBox = sliderContainer.getElementsByClassName("cqcBlockRuleChangeBaseSlider")?.[0];
    if (inputBox) {
        inputBox.cssText = [
            "display: block;",
            "color: black;"
        ].join(";");
    }

    const updateButton = document.createElement("div");
    updateButton.innerText = "Update No. of Songs"
    updateButton.style.cssText = [
        "background-color: black",
        "color: white",
        "cursor: pointer",
    ].join(";");
    updateButton.onClick = updateNumSongs
    sliderContainer.appendChild(updateButton);

    function updateNumSongs() {
        const updateNumSongsEvent = new CustomEvent("slideStop", {value: inputBox.value});
        inputBox.target.dispatchEvent(updateNumSongsEvent)
    }
}

// ==[ COLLAPSE RULE BLOCK ]=====================================================================

function setupCollapseRuleBlock() {
    $('.cqcRuleBlockHeader').forEach((headerElem) => {
        const collapseBtn = document.createElement("div");
        collapseBtn.textContent = "▼"
        collapseBtn.style.cssText = [
            "cursor: pointer"
        ].join(';')
        collapseBtn.onclick = toggleCollapse
        headerElem.dataset.isCollapsed = "false"
        headerElem.prepend(collapseBtn)

        function toggleCollapse() {
            const nextState = headerElem.dataset.isCollapsed === "true" ? "false" : "true"
            $(headerElem).siblings('.cqcRuleBlockBody').cssText = [
                `display: ${nextState === "true" ? 'block' : 'none'}`
            ].join(";");
            collapseBtn.textContent = nextState === "true" ? "▶" : "▼"
        }
    })
}

// ==[ BUTTON TO SEARCH FOR DUPLICATES ]=========================================================

function setupDuplicateSearcher() {
    const dupeSearchBtn = document.createElement("div");
    dupeSearchBtn.textContent = "Search for dupes"
    dupeSearchBtn.style.cssText = [
        "cursor: pointer"
    ].join(';')
    dupeSearchBtn.onclick = searchAndDisplayDupes
    $("#cqcQuizCreatorHeader").append(dupeSearchBtn)
}

function searchAndDisplayDupes() {
    const allSongs = $(".cqcSongName")
    const dupeSongs = computeDupes(allSongs)

    const allShows = $(".cqcAnimeBlockName")
    const dupeShows = computeDupes(allShows)

    const text = ```
    Duplicate songs: 
    - ${dupeSongs.join('\n- ')}
    Duplicate shows: 
    - ${dupeShows.join('\n- ')}
    ```

    window.alert(text)
}

function computeDupes(allValues) {
    const dupes = []
    const set = new Set()
    allValues.forEach(song => {
        if (set.has(song)) {
            dupes.push(song)
        }
        set.add(song)
    })
    return dupes;
}

// ==[ ALREADY SAVED LISTENER ]==================================================================

function setupAlreadySavedListener() {
    $("#cqcBackButton").addEventListener("click", () => {
        if (!customQuizCreator) {
            return
        }
        if (customQuizCreator.currentSaveString === JSON.stringify(customQuizCreator.generateQuizSave())) {
            log(ALREADY_SAVED, "Save was already done")
            alert("u can exit lol (hopefully build this into the modal)")
        } else {
            log(ALREADY_SAVED, "Quiz is NOT saved")
            alert("dont exit lol (hopefully build this into the modal)")
        }
    })
// TODO WIP
}


