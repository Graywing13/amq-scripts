// ==UserScript==
// @name         AMQ Font & Homepage Style
// @namespace    https://github.com/Graywing13
// @version      0.3
// @description  Changes font, container style, and homepage background image. Kinda sloppy ngl :camping:
// @author       Graywing13
// @match        https://*.animemusicquiz.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

// === [ SETTINGS ] ============================================

const fontName = "Segoe UI Light"; // If windows, look here for additional fonts: https://learn.microsoft.com/en-us/typography/font-list/

// BKG SETTINGS. Make sure the image link ends in .jpg, .png, or an equivalent
const homepageBg =
  "https://wealthofgeeks.com/wp-content/uploads/2021/11/Top-50-Best-Anime-Cats-Most-Popular-of-All-the-Time.jpg";
const loadingScreenBg =
  "https://sm.ign.com/t/ign_ap/screenshot/default/haru-cute_chhs.1280.jpg";

// How much to dim the background; 0 for no dim, 1 for a black background.
const homepageBgDim = 0.3;
const loadingScreenBgDim = 0.5;

// =============================================================

("use strict");

if (document.getElementById("loginPage")) return;

let loadingScreen = document.getElementById("loadingScreen");
if (loadingScreen !== undefined) {
  loadingScreen.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, ${loadingScreenBgDim}), rgba(0, 0, 0, ${loadingScreenBgDim})), url(${loadingScreenBg})`;
  loadingScreen.style.backgroundSize = "cover";
  loadingScreen.style.backgroundColor = "#eee";
}

let mainContainer = document.getElementById("mainContainer");
mainContainer.style.fontFamily = fontName;
mainContainer.style.minHeight = "600px";

let gameContainer = document.getElementById("gameContainer");
if (gameContainer !== undefined) {
  gameContainer.style.backgroundImage = homepageBg
    ? `linear-gradient(to bottom, rgba(0, 0, 0, ${homepageBgDim}), rgba(0, 0, 0, ${homepageBgDim})), url(${homepageBg})`
    : "none";
  gameContainer.style.backgroundColor = "#eee";
  gameContainer.style.backgroundSize = "cover";
}

let mainBackground = document
  .getElementById("gameChatPage")
  .getElementsByClassName("col-xs-9")[0];
if (mainBackground !== undefined) {
  mainBackground.style.backgroundImage = "none";
  mainBackground.style.backgroundSize = "cover";
}

function styleContainers() {
  document.querySelectorAll(".floatingContainer").forEach((container) => {
    container.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
  });
  document.getElementById("gcMessageContainer").style.backgroundColor =
    "#1b1b1b";
  document.getElementById("qcStickOut").style.opacity = "0.8";
}

function runOnPlayerJoin() {
  document
    .querySelectorAll(".lobbyAvatarNameContainer")
    .forEach((container) => {
      console.log(container);
      container.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    });
}

let quizReadyListener = new Listener("quiz ready", () => {
  styleContainers();
});

let hostGameListener = new Listener("Host Game", () => {
  styleContainers();
});

let spectateGameListener = new Listener("Spectate Game", () => {
  styleContainers();
});

let joinGameListener = new Listener("Join Game", () => {
  styleContainers();
});

let playerAnswersListener = new Listener("player answers", (result) => {
  document.querySelectorAll(".qpAvatarAnswerContainer").forEach((container) => {
    container.style.backgroundColor = "#1b1b1b";
  });
});

quizReadyListener.bindListener();
hostGameListener.bindListener();
spectateGameListener.bindListener();
joinGameListener.bindListener();
playerAnswersListener.bindListener();

styleContainers();
