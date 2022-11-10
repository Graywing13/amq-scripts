// ==UserScript==
// @name         Show Results In Tab Title
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Show correct answer in tab title during answer phase
// @author       Graywing13
// @match        https://animemusicquiz.com/
// @grant        none
// ==/UserScript==

const preferredLanguage = "english"; // change to "romaji" if u prefer.

function changeTabTitle(newSong) {
    const correctness = newSong.correct ? "✔️ " : (newSong.correct === false ? "❌ " : "");
    document.title = `${correctness}${newSong.anime[preferredLanguage]} | ${newSong.artist} | ${newSong.name}`;
}

function resetTabTitle() {
    document.title = "AMQ";
}

 let answerResultsListener = new Listener("answer results", (result) => {
    	setTimeout(() => {
	        let newSong = {
	            name: result.songInfo.songName,
	            artist: result.songInfo.artist,
	            anime: result.songInfo.animeNames
            };
	        let findPlayer = Object.values(quiz.players).find((tmpPlayer) => {
	            return tmpPlayer._name === selfName && tmpPlayer.avatarSlot._disabled === false
	        });
	        if (findPlayer !== undefined) {
	            let playerIdx = Object.values(result.players).findIndex(tmpPlayer => {
	                return findPlayer.gamePlayerId === tmpPlayer.gamePlayerId
	            });
	            newSong.correct = result.players[playerIdx].correct;
	        }
	        changeTabTitle(newSong);
	    },0);
    });

 let nextSongListener = new Listener("play next song", (result) => {
    	resetTabTitle();
    });

 let quizOverListener = new Listener("quiz over", (result) => {
    	resetTabTitle();
    });

answerResultsListener.bindListener();
nextSongListener.bindListener();
quizOverListener.bindListener();
