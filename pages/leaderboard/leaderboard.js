// <ol class="leaderboard"></ol>
let leaderboard = document.querySelector(".leaderboard");
let tabClassic = document.querySelector(".tab-classic");
let tabSurvival = document.querySelector(".tab-survival");

const GAMEMODE = {
  Classic: "classic",
  Survival: "survival",
};

let gameMode = GAMEMODE.Classic;

function addRecord(points, time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const text = `${points} points in ${minutes} minutes and ${seconds} seconds`;
  const listItem = document.createElement("li");
  listItem.textContent = text;
  leaderboard.appendChild(listItem);
}

function setGameMode(mode) {
  gameMode = mode;
  setup();
}

function setup() {
  // clears the whole leaderboard
  leaderboard.innerHTML = "";

  const leaderboardKey = `leaderboard-${gameMode}`;
  const str = localStorage.getItem(leaderboardKey);
  const store = str ? JSON.parse(str) : [];

  // sort store
  // Your code here
  store.sort((low, high) => {
    if (low.points === high.points) {
      return low.time - high.time; // ascending order
    }

    return high.points - low.points; // descending order
  });

  let topRecords = store.slice(0, 10);

  for (let record of topRecords) {
    addRecord(record.points, record.time);
  }

  if (gameMode === GAMEMODE.Classic) {
    tabClassic.setAttribute("active", "true");
    tabSurvival.removeAttribute("active");
  } else {
    tabClassic.removeAttribute("active");
    tabSurvival.setAttribute("active", true);
  }
}

setup();
tabClassic.addEventListener("click", () => setGameMode(GAMEMODE.Classic));
tabSurvival.addEventListener("click", () => setGameMode(GAMEMODE.Survival));
