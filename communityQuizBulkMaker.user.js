// ==UserScript==
// @name         AMQ Community Quiz Bulk Maker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add list of song ids at once to community quiz
// @author       Graywing13
// @match        https://animemusicquiz.com/*
// @downloadURL  https://github.com/Graywing13/amq-scripts/blob/main/communityQuizBulkMaker.user.js
// @updateURL    https://github.com/Graywing13/amq-scripts/blob/main/communityQuizBulkMaker.user.js
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
                "blocks": generateBlocks()
            }
        ]
    }
}

function generateBlocks() {
    const blockIdStrings = $('#cqcBulkSaveSongIds').val().split(',');
    const blockIds = blockIdStrings.map(idStr => {
        const num = parseInt(idStr);
        if (isNaN(num)) {
            throw new Error(`Tried to parse "${idStr}" but got NaN`)
        }
        return num
    })
    const deduped = [...new Set(blockIds)];
    console.log(`Removed ${blockIds.length - deduped.length} dupes`)
    return deduped.map(songId => ({"annSongId": songId}))
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