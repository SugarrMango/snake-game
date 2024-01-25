/*
  options: {
    startTime (60),
    onTick (),
  }
*/

function createTimer() {
  let timer;
  let timerInterval;
  let timerOptions;

  function setTimer(t) {
    timer = t;
    timerOptions.onSet(t);
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

  return {
    timer,
    setTimer,
    setupTimer,
    getTimer,
    resetTimer,
    startTimer,
    stopTimer,
  };
}
