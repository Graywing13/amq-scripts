// ==UserScript==
// @name         AMQ Community Quiz Song Counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display song count in each community quiz rule block
// @author       Graywing13
// @match        https://animemusicquiz.com/*
// @downloadURL  https://github.com/Graywing13/amq-scripts/blob/main/communityQuizSongCounter.user.js
// @updateURL    https://github.com/Graywing13/amq-scripts/blob/main/communityQuizSongCounter.user.js
// ==/UserScript==

if (typeof Listener === "undefined") return;
const loadInterval = setInterval(() => {
    if (document.getElementById("loadingScreen").classList.contains("hidden")) {
        clearInterval(loadInterval);
        setup();
    }
}, 500);

let initialized = false;

function updateRuleBlocks() {
    const ruleBlocks = $(".cqcRuleBlock");
    ruleBlocks.map(function () {
        const count = this.querySelectorAll(".cqcSongBlock").length;
        this.querySelector(".cqcBlockName").innerText = "Rule Block - " + count + " songs";
    });
    console.log(ruleBlocks.length + " rule blocks counted");
}

function appendDomElements() {
    const refreshCountsBtn = document.createElement("div");
    refreshCountsBtn.innerText = "Refresh song counts"
    refreshCountsBtn.className = "cqcCreationBlock";
    refreshCountsBtn.style.cssText = [
        "justify-content: center",
        "background-color: black",
        "cursor: pointer",
        "margin-top: 8px",
    ].join(";");
    refreshCountsBtn.onclick = updateRuleBlocks;
    $("#cqcQuizCreatorHeader").append(refreshCountsBtn);
}

function setup() {
    const loadCustomQuizListener = new Listener("load custom quiz", () => {
        if (!initialized) {
            appendDomElements();
            updateRuleBlocks();
            initialized = true;
        }
    });
    loadCustomQuizListener.bindListener();
}
