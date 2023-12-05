let timer;
let timerElement = document.querySelector(".timer");
let timerInterval;
let timerOptions;

/*
  options: {
    startTime (60),
    onTick (),
  }
*/

function setTimer(t) {
  timer = t;
  let minutes = Math.floor(t / 60).toString();
  let seconds = (t % 60).toString();
  timerElement.textContent = `${minutes.padStart(2, "0")}:${seconds.padStart(
    2,
    "0"
  )}`;
}

function setupTimer(options) {
  timerOptions = options;
}

function getTimer() {
  return timer;
}

function resetTimer() {
  setTimer(timerOptions.startTime);
}

function startTimer() {
  // 1s = 1000ms
  timerInterval = setInterval(timerOptions.onTick, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}
