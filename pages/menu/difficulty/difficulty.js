let difficultyInputElement = document.querySelector("#difficulty");
let difficultyNameElement = document.querySelector(".difficulty-name");
let difficultyDescriptionElement = document.querySelector(
  ".difficulty-description"
);
let difficultyList = document.querySelector("#difficulties");

// tab-classic, tabClassic
let tabClassic = document.querySelector(".tab-classic");
let tabSurvival = document.querySelector(".tab-survival");
let contentElement = document.querySelector(".content");

const GAMEMODE = {
  Classic: "classic",
  Survival: "survival",
};

let gameMode = GAMEMODE.Classic;

const difficulties = {
  [GAMEMODE.Classic]: [
    {
      level: 1,
      name: "Slithering Starter",
      description:
        "The perfect starting point for beginners, offering a relaxed pace to learn the game.",
    },
    {
      level: 2,
      name: "Serpentine Sprint",
      description:
        "A step up in challenge with a faster-moving snake, ideal for improving your skills.",
    },
    {
      level: 3,
      name: "Rapid Reptile",
      description:
        "The snake darts around the screen with increased speed, testing your precision and strategy.",
    },
    {
      level: 4,
      name: "Venomous Velocity",
      description:
        "Lightning-fast gameplay that demands exceptional coordination and skill.",
    },
    {
      level: 5,
      name: "Fury of the Python",
      description:
        "The ultimate challenge with the snake at maximum speed, reserved for the most skilled players.",
    },
  ],
  [GAMEMODE.Survival]: [
    // Generate difficulties similar to above, but adapted for survival mode
    {
      level: 1,
      name: "Temporal Tolerance",
      description:
        "A forgiving mode with a resettable timer, perfect for those new to the challenges of Survival.",
    },
    {
      level: 2,
      name: "Chrono Challenge",
      description:
        "Navigate through an increased tempo as the timer ticks faster, demanding quick decisions and strategic fruit consumption.",
    },
    {
      level: 3,
      name: "Time Warp Mayhem",
      description:
        "Navigate an accelerated timer, demanding lightning-quick reflexes for the ultimate survival challenge.",
    },
  ],
};

function setDifficulty(level) {
  difficultyInputElement.value = level;

  let difficulty = difficulties[gameMode].find((d) => d.level === level);

  difficultyNameElement.textContent = difficulty.name;
  difficultyDescriptionElement.textContent = difficulty.description;

  localStorage.setItem("difficulty", level);
}

function handleInputChange(event) {
  let level = Number(event.target.value); // "5"
  setDifficulty(level);
}

function setGameMode(mode) {
  gameMode = mode;
  localStorage.setItem("gameMode", mode);
  setup();
}

function setDifficultyList(difficultyCount) {
  difficultyInputElement.setAttribute("max", difficultyCount.toString());
  difficultyList.innerHTML = "";

  for (let i = 1; i <= difficultyCount; i++) {
    let difficulty = document.createElement("option");

    difficulty.setAttribute("value", i.toString());
    difficulty.setAttribute("label", i.toString());

    difficultyList.appendChild(difficulty);
  }
}

function setup() {
  setDifficultyList(difficulties[gameMode].length);
  setDifficulty(Math.ceil(difficulties[gameMode].length / 2));

  if (gameMode === GAMEMODE.Classic) {
    tabClassic.setAttribute("active", "true");
    tabSurvival.removeAttribute("active");
  } else {
    tabClassic.removeAttribute("active");
    tabSurvival.setAttribute("active", true);
  }
}

setGameMode(GAMEMODE.Classic);
difficultyInputElement.addEventListener("change", handleInputChange);
tabClassic.addEventListener("click", () => setGameMode(GAMEMODE.Classic));
tabSurvival.addEventListener("click", () => setGameMode(GAMEMODE.Survival));

/*
Explaining the different ways to declare functions in JavaScript

function addTwoNumbers(a, b) {
  return a + b;
}

const someNumber = 123;
const addTwoNumbers = (a, b) => a + b; // implicit return
const addTwoNumbers = function (a, b) {
  return a + b;
};
const addTwoNumbers = (a, b) => {
  // full arrow function
  return a + b;
};
*/
