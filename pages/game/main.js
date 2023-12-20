let board = document.querySelector(".board");
let pauseMenuElement = document.querySelector(".pause-modal");
let resumeButton = document.querySelector(".resume");

let loseMenuElement = document.querySelector(".lose-modal");
let retryButton = document.querySelector(".retry");
let statsText = document.querySelector(".lose-modal .stats");

let mangoContainerElement = document.querySelector(".mango-container");
let timerElement = document.querySelector(".timer");
let boardSize;
let boardWrap = true;
let cellSize;
let cellClass;

function setupScene() {
  boardSize = Number(localStorage.getItem("boardSize"));
  if (boardSize >= 20) {
    cellSize = 30;
    cellClass = "cell cell-small";
  } else {
    cellSize = 40;
    cellClass = "cell cell-big";
  }

  board.style.width = `${boardSize * cellSize}px`;
  board.style.height = `${boardSize * cellSize}px`;

  // for i in range(400):
  for (let i = 0; i < boardSize * boardSize; i += 1) {
    let cell = document.createElement("div");
    cell.className = `${cellClass} default`;
    board.prepend(cell);
  }

  resumeButton.addEventListener("click", resumeGame);
  retryButton.addEventListener("click", setup);
}

function changeType(position, ...types) {
  let index = getIndex(position[0], position[1]);
  let cell = board.children.item(index);
  if (!cell) {
    return;
  }
  cell.className = `${cellClass} ${types.join(" ")}`;
}

const FRUIT_TYPE = "fruit";
const SNAKE_BODY_TYPE = "snake-body";
const SNAKE_HEAD_TYPE = "snake-head";
const SNAKE_TAIL_TYPE = "snake-tail";
const DEFAULT_TYPE = "default";

let fruits, snake;
let direction = "none";
let moveInterval;
let isGameRunning = false;
let isGamePaused = false;
let difficulty;
let gameMode;
let timeElapsed = 0;
let regularFruitCounter = 0;
let progressTimer = null;
let mangoTimer = null;

function applyTurn(cell, direction, type) {
  if (direction === "up") {
    changeType(cell, type, "top-left-rounded", "top-right-rounded");
  } else if (direction === "left") {
    changeType(cell, type, "top-left-rounded", "bottom-left-rounded");
  } else if (direction === "right") {
    changeType(cell, type, "top-right-rounded", "bottom-right-rounded");
  } else if (direction === "down") {
    changeType(cell, type, "bottom-left-rounded", "bottom-right-rounded");
  } else {
    changeType(cell, type);
  }
}

function repaint() {
  for (let r = 0; r < boardSize; r += 1) {
    for (let c = 0; c < boardSize; c += 1) {
      changeType([r, c], DEFAULT_TYPE);
    }
  }

  // for i in range(len(snake)):
  for (let i = 1; i < snake.length - 1; i++) {
    let curCell = snake[i];
    let prevCell = snake[i - 1];
    let nextCell = snake[i + 1];

    // i-1     i     i+1
    // prev    ^     next

    let prevDirection = getDirection(curCell, prevCell);
    let nextDirection = getDirection(curCell, nextCell);
    let directions = [prevDirection, nextDirection];

    if (matches(directions, ["up", "right"])) {
      changeType(curCell, SNAKE_BODY_TYPE, "bottom-left-rounded");
    } else if (matches(directions, ["up", "left"])) {
      changeType(curCell, SNAKE_BODY_TYPE, "bottom-right-rounded");
    } else if (matches(directions, ["down", "right"])) {
      changeType(curCell, SNAKE_BODY_TYPE, "top-left-rounded");
    } else if (matches(directions, ["down", "left"])) {
      changeType(curCell, SNAKE_BODY_TYPE, "top-right-rounded");
    } else {
      changeType(curCell, SNAKE_BODY_TYPE);
    }
  }

  // snake-head
  let headDirection = direction === "none" ? "left" : direction;
  applyTurn(snake[0], headDirection, SNAKE_HEAD_TYPE);
  // snake-tail
  if (snake.length > 1) {
    let tailDirection = getDirection(
      snake[snake.length - 2],
      snake[snake.length - 1]
    );
    applyTurn(snake[snake.length - 1], tailDirection, SNAKE_TAIL_TYPE);
  }

  // for x in fruits:
  //   changeType(x, FRUIT_TYPE)
  for (let [index, fruit] of fruits.entries()) {
    if (fruit === null) {
      if (index === 2) {
        mangoContainerElement.style.display = "none";
      }
      continue;
    }
    // fruit-0 or fruit-1
    // fruit-index

    if (index === 2) {
      let [x, y] = fruit;

      mangoContainerElement.style.display = "block";
      mangoContainerElement.style.top = `${x * cellSize}px`;
      mangoContainerElement.style.left = `${y * cellSize}px`;
      mangoContainerElement.style.width = `${2 * cellSize}px`;
      mangoContainerElement.style.height = `${2 * cellSize}px`;
    } else {
      changeType(fruit, FRUIT_TYPE, `${FRUIT_TYPE}-${index}`);
    }
  }
}

function updateTimerElement(timer) {
  let minutes = Math.floor(timer / 60).toString();
  let seconds = (timer % 60).toString();
  timerElement.textContent = `${minutes.padStart(2, "0")}:${seconds.padStart(
    2,
    "0"
  )}`;
}

function onSet(timer) {
  if (mangoTimer === null) {
    updateTimerElement(timer);
  }
}

function onTickSurvival() {
  let timer = progressTimer.getTimer();

  if (timer === 0) {
    lose();
  } else {
    progressTimer.setTimer(timer - 1);
    timeElapsed += 1;
  }
}
function onTickClassic() {
  let timer = progressTimer.getTimer();
  progressTimer.setTimer(timer + 1);
}

function setup() {
  pauseMenuElement.style.display = "none";
  loseMenuElement.style.display = "none";
  direction = "none";
  regularFruitCounter = 0;

  difficulty = Number(localStorage.getItem("difficulty"));
  gameMode = localStorage.getItem("gameMode");

  let snakeHead = generatePosition(boardSize - 2);
  let snakeBody = getNewPosition(snakeHead, "right");
  let snakeTail = getNewPosition(snakeBody, "right");

  snake = [snakeHead, snakeBody, snakeTail];

  fruits = [null, null, null];

  for (let i = 0; i < 2; i++) {
    regenerateFruit(i);
  }

  resetPoints();
  repaint();

  progressTimer = createTimer();

  let startTime, speed, onTick;

  if (gameMode === "classic") {
    startTime = 0;
    // level 1: 180
    // level 2: 150
    // level 3: 120
    // level 4: 90
    // level 5: 60
    speed = 180 - 30 * (difficulty - 1);
    onTick = onTickClassic;
  } else {
    // level 1: startTime = 25, speed = 150
    // level 2: startTime = 15, speed = 90
    // level 3: startTime = 10, speed = 60
    if (difficulty === 1) {
      startTime = 25;
      speed = 150;
    } else if (difficulty === 2) {
      startTime = 15;
      speed = 90;
    } else {
      startTime = 10;
      speed = 60;
    }
    onTick = onTickSurvival;
  }

  progressTimer.setupTimer({
    // startTime,
    startTime: startTime,
    onTick: onTick,
    onSet: onSet,
  });
  moveInterval = setInterval(move, speed);

  timeElapsed = 0;
  progressTimer.resetTimer();
  progressTimer.startTimer();

  isGameRunning = true;
}

function handleKeyDown(event) {
  const key = event.key;

  switch (key) {
    case "ArrowLeft": {
      if (direction !== "right") {
        direction = "left";
      }
      break;
    }
    case "ArrowRight": {
      if (direction !== "left" && direction !== "none") {
        direction = "right";
      }
      break;
    }
    case "ArrowUp": {
      if (direction !== "down") {
        direction = "up";
      }
      break;
    }
    case "ArrowDown": {
      if (direction !== "up") {
        direction = "down";
      }
      break;
    }
    case "Escape": {
      console.log("here");
      if (isGamePaused) {
        resumeGame();
      } else {
        pauseGame();
      }
      break;
    }
    default: {
      break;
    }
  }
}

function pauseGame() {
  if (isGameRunning && !isGamePaused) {
    isGamePaused = true;
    clearInterval(moveInterval);
    progressTimer.stopTimer();
    pauseMenuElement.style.display = "flex";
  }
}

function resumeGame() {
  if (isGameRunning && isGamePaused) {
    isGamePaused = false;
    moveInterval = setInterval(move, 100);
    progressTimer.startTimer();
    pauseMenuElement.style.display = "none";
  }
}

function lose() {
  pauseMenuElement.style.display = "none";
  isGameRunning = false;

  clearInterval(moveInterval);
  progressTimer.stopTimer();
  // You got 5 points in 2 minutes and 10 seconds
  const timer = gameMode === "classic" ? progressTimer.getTimer() : timeElapsed;
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  // points = getPoints()
  // timer = getTimer()

  const leaderboardKey = `leaderboard-${gameMode}`;

  const str = localStorage.getItem(leaderboardKey);
  const store = str ? JSON.parse(str) : [];
  /*
  if (str) {
    store = JSON.parse(str)
  } else {
    store = []
  }
  */
  store.push({ points: getPoints(), time: timer });
  localStorage.setItem(leaderboardKey, JSON.stringify(store));

  statsText.textContent = `You got ${getPoints()} points in ${minutes} minutes and ${seconds} seconds`;
  loseMenuElement.style.display = "flex";

  if (mangoTimer !== null) {
    mangoTimer.stopTimer();
  }
}

function isInsideFruit(position, index, fruit) {
  if (position === null) {
    return false;
  }
  let result = false;
  if (index === 2) {
    const [x, y] = fruit;
    // x ||= y -> x = x || y -> x = x or y
    result ||= arePositionsEqual(position, [x, y]);
    result ||= arePositionsEqual(position, [x, y + 1]);
    result ||= arePositionsEqual(position, [x + 1, y]);
    result ||= arePositionsEqual(position, [x + 1, y + 1]);
  } else {
    result = arePositionsEqual(position, fruit);
  }
  return result;
}

function regenerateFruit(index) {
  fruits[index] = null;
  let newPosition = generatePosition(index === 2 ? boardSize - 1 : boardSize);

  while (
    snake.some((x) => isInsideFruit(x, index, newPosition)) ||
    fruits.some((x) => isInsideFruit(x, index, newPosition))
  ) {
    newPosition = generatePosition(index === 2 ? boardSize - 1 : boardSize);
  }

  fruits[index] = newPosition;
}

function eatFruit(index) {
  if (gameMode === "survival") {
    progressTimer.resetTimer();
  }

  if (index < 2) {
    eatRegularFruit();
    regenerateFruit(index);
    increasePoints(difficulty);
  } else {
    // 1s -> 10pts, 2s -> 20pts, 3s -> 30pts, 4s -> 40pts, 5s -> 50pts
    increasePoints(difficulty * mangoTimer.getTimer() * 2);
    removeMango();
  }
}

function removeMango() {
  fruits[2] = null;
  if (mangoTimer !== null) {
    mangoTimer.stopTimer();
    mangoTimer = null;
  }
}

function eatRegularFruit() {
  if (gameMode === "classic") {
    regularFruitCounter += 1;
  }
  if (regularFruitCounter === 5) {
    regenerateFruit(2);
    regularFruitCounter = 0;
    mangoTimer = createTimer();
    mangoTimer.setupTimer({
      startTime: 5,
      onTick: () => {
        let timer = mangoTimer.getTimer();
        mangoTimer.setTimer(timer - 1);
      },
      onSet: (timer) => {
        if (timer === 0) {
          removeMango();
          return;
        }
        updateTimerElement(timer);
      },
    });
    mangoTimer.resetTimer();
    mangoTimer.startTimer();
  }
}

function move() {
  if (direction === "none") {
    return;
  }

  let [r, c] = getNewPosition(snake[0], direction);

  if (!boardWrap && (r < 0 || c < 0 || r >= boardSize || c >= boardSize)) {
    lose();
    return;
  }

  r = (r + boardSize) % boardSize;
  c = (c + boardSize) % boardSize;

  let isEatingAFruit = false;

  /*
  for (const [i, value] of myArray.entries()) {
    console.log('%d: %s', i, value);
  }
  */

  for (let [index, fruit] of fruits.entries()) {
    if (fruit === null) {
      continue;
    }

    let isFruitEaten = isInsideFruit([r, c], index, fruit);

    if (isFruitEaten) {
      isEatingAFruit = true;
      eatFruit(index);
    }
  }

  if (!isEatingAFruit) {
    // Before: snake = [ [3, 4], [4, 5], [2, 6], [7, 8] ]
    // After: snake = [ [3, 4], [4, 5], [2, 6] ]
    snake.pop();
  }

  if (snake.some((x) => arePositionsEqual(x, [r, c]))) {
    lose();
    return;
  }

  // Before: snake = [ [3, 4], [4, 5], [2, 6] ]
  // After: snake = [ [r, c], [3, 4], [4, 5], [2, 6] ]
  snake.unshift([r, c]);
  repaint();
}

document.addEventListener("keydown", handleKeyDown);

setupScene();
setup();
