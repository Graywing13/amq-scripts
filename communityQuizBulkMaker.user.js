// ==UserScript==
// @name         AMQ Community Quiz Bulk Maker
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  Add list of song ids or ann ids at once to community quiz
// @author       Graywing13
// @match        https://animemusicquiz.com/*
// @downloadURL  https://github.com/Graywing13/amq-scripts/raw/main/communityQuizBulkMaker.user.js
// @updateURL    https://github.com/Graywing13/amq-scripts/raw/main/communityQuizBulkMaker.user.js
// ==/UserScript==

if (typeof Listener === "undefined") return;
const loadInterval = setInterval(() => {
    if (document.getElementById("loadingScreen").classList.contains("hidden")) {
        clearInterval(loadInterval);
        setup();
    }
}, 500);

let initialized = false;

function appendOpenModalButton() {
    $("#cqcQuizCreatorButtonContainer").append(`
    <div id="cqcQuizCreatorBulkSaveButton" class="cqcQuizCreatorButton rightTiltButton  clickAble">
        <i class="fa fa-floppy-o" aria-hidden="true"></i>
        <div>Bulk Save</div>
    </div>
    `)
    $('#cqcQuizCreatorBulkSaveButton').click(() => {
        const name = $("#cqcQuizCreatorNameInput").val().trim();
        if (name.length === 0) {
            messageDisplayer.displayMessage("No Quiz Name", "Please enter a name for the quiz before saving");
            return;
        }

        $('#cqcBulkQuizTitle')[0].innerHTML = `Title: ${name}`
        $('#cqcBulkQuizDescription')[0].innerHTML = `Description: ${$("#cqcSaveDescriptionInput").val()}`
        $('#cqcBulkSaveModal').modal("show")
    })
}

function appendBulkSaveModal() {
    $("body").append(
        `<div class="modal fade" id="cqcBulkSaveModal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h2 class="modal-title">Bulk Save Quiz</h2>
                    </div>
                    <div class="modal-body">
                        <div class="cqcSaveContentContainer">
                            <label class="cqcSaveLabel">Song IDs</label>
                            <textarea id="cqcBulkSaveSongIds" class="form-control" rows="3"
                                      placeholder="Paste in all song ids, separated by commas" maxlength="50000"></textarea>
                        </div>
                        <div class="cqcSaveContentContainer">
                            <label class="cqcSaveLabel">ANN IDs</label>
                            <textarea id="cqcBulkSaveAnnIds" class="form-control" rows="3"
                                      placeholder="Paste in all ANN ids, separated by commas" maxlength="50000"></textarea>
                        </div>
                        <details>
                            <summary style="font-size: large;padding-top: 10px;cursor: pointer;">Scrapers (click to expand)</summary>
                            <p>FYI if you want to scrape all shows done by a studio, go to their ANN page and run this in console:</p>
                            <pre><code>
Array.from($(document)
.querySelectorAll("span"))
.filter(s => s.innerText.includes("Animation Production"))
.map(s => {
    const previousText = s.previousSibling.innerText;
    if (s.innerText === ", Animation Production" && s.previousSibling.children[1]?.href) {
        console.log(\`ℹ️ Replaced $\{s.innerText} with $\{s.previousSibling.innerText.trim()}\`)
        return s.previousSibling;
    }
    return s;
})
.filter(s => { 
    if (!s.children[1]?.href) {
    let prevTextWithLinkStr = "NOT FOUND IN 10 ITERATIONS"
    let prev = s.previousSibling;
    for (let i = 0; i < 10; i++) {
        if (prev.children[1]?.href) {
            prevTextWithLinkStr = prev.innerText.trim()
            break;
        } else {
            prev = prev.previousSibling
        }
    }
        console.log(\`⚠️ Could not locate link for "$\{s.innerText}".\n- Previous text: "$\{s.previousSibling.innerText.trim()}".\n- Previous link: $\{prevTextWithLinkStr} 🔗.\n- Double check whether this entry already exists or if it should be manually added.\`);
        return false;
    } 
    return true})
.map(s => s.children[1]?.href?.split("id=")[1])
.join(", ")
                            </code></pre>
                        </details>
                        <h3 id="cqcBulkQuizTitle"></h3>
                        <h4 id="cqcBulkQuizDescription"></h4>
                        <p>This creates a single block, with the settings resetted to the following. To change them, please use the normal save afterward.</p>
                        <pre><code>
{
    "randomOrder": true,
    "songCount": 20,
    "guessTime": { "guessTime": 20, "extraGuessTime": 0 },
    "samplePoint": { "samplePoint": [0, 100] },
    "playBackSpeed": { "playBackSpeed": 1 },
    "duplicates": true,
    "guessModes":{ "song": true, "tinyVideo": false, "blurVideo": false }
}
                        </code></pre>
<p>Songs are automatically deduplicated.</p>
                    </div>
                    <b>This will overwrite all songs in this quiz. Make sure you're on the right quiz!</b>
                    <div id="cqcBulkSaveButton">
                        Save
                    </div>
                    <div id="cqcSaveModalSavingOverlay" class="hide">
                        <div id="cqcSaveModalSavingOverlayContent">
                            <div class="cqcSaveModalSavingOverlaySpinner"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>
                            <div class="cqcSaveModalSavingOverlayText">Saving</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    )
    addModalLogic()
    $('#cqcBulkSaveButton').css({
        "text-align": "center",
        position: "relative",
        width: "100%",
        "font-size": "30px",
        "background-color": "#492881",
        "margin-top": "30px",
        cursor: "pointer"
    })
}

function addModalLogic() {
    $('#cqcBulkSaveButton').click(() => {
        let save;
        setSaving(true)
        try {
            save = generateQuizSave();
        } catch (e) {
            alert("save unsuccessful, see console for details")
            console.log(e)
            setSaving(false)
            return
        }

        socket.sendCommand({
            command: "save quiz",
            type: "quizCreator",
            data: {
                quizSave: save,
                quizId: customQuizCreator.currentQuizId,
            },
        });
    });
}

function generateQuizSave() {
    return {
        "name": $("#cqcQuizCreatorNameInput").val().trim(),
        "description": $("#cqcSaveDescriptionInput").val(),
        "tags": [],
        "ruleBlocks": [
            {
                "randomOrder": true,
                "songCount": 20,
                "guessTime": {"guessTime": 20, "extraGuessTime": 0},
                "samplePoint": {"samplePoint": [0, 100]},
                "playBackSpeed": {"playBackSpeed": 1},
                "blocks": [...generateBlocks("#cqcBulkSaveSongIds", "annSongId"), ...generateBlocks("#cqcBulkSaveAnnIds", "annId")],
                "duplicates": true,
                "guessModes":{ "song": true, "tinyVideo": false, "blurVideo": false }
            }
        ]
    }
}

function generateBlocks(inputId, blockLabel) {
    if (!$(inputId).val()) return []
    const blockIdStrings = $(inputId).val().split(',');
    const blockIds = blockIdStrings.map(idStr => {
        const num = parseInt(idStr);
        if (isNaN(num)) {
            throw new Error(`${blockLabel}: Tried to parse "${idStr}" but got NaN`)
        }
        return num
    })
    const deduped = [...new Set(blockIds)];
    console.log(`${blockLabel}: Removed ${blockIds.length - deduped.length} dupes`)
    const additionalInfo = blockLabel === "annId" ? {"includeSongTypes":{"op":true,"ed":true,"in":true},"numberOfSongs":1} : {}
    return deduped.map(songId => ({[blockLabel]: songId, ...additionalInfo}))
}

function setSaving(isSaving) {
    const button = $('#cqcBulkSaveButton')
    button[0].innerHTML = isSaving ? 'Saving...' : 'Save'
    button.prop('disabled', isSaving)
}

function setup() {
    const loadCustomQuizListener = new Listener("get current master list id", () => {
        if (!initialized) {
            appendBulkSaveModal();
            appendOpenModalButton();
            initialized = true;
        }
    });
    const quizSaveListener = new Listener("save custom quiz", () => {
        const bulkSaveModal = $('#cqcBulkSaveModal')
        if (bulkSaveModal.is(':visible')) {
            setSaving(false)
            alert('Changes have been saved. Exit the quiz-builder and re-enter this page. This prevents accidentally overwriting changes.')
            bulkSaveModal.modal("hide")
        }
    });
    loadCustomQuizListener.bindListener();
    quizSaveListener.bindListener();
}