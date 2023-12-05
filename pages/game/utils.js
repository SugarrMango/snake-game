function getIndex(r, c) {
  return 20 * r + 1 * c;
}

function generatePosition() {
  let r = Math.floor(Math.random() * 20);
  let c = Math.floor(Math.random() * 20);
  return [r, c];
}

function getDirection(curCell, nextCell) {
  if (nextCell[1] === curCell[1] + 1) {
    return "right";
  } else if (nextCell[0] === curCell[0] - 1) {
    return "up";
  } else if (nextCell[1] === curCell[1] - 1) {
    return "left";
  } else if (nextCell[0] === curCell[0] + 1) {
    return "down";
  } else {
    return "none";
  }
}

function getNewPosition(curCell, direction) {
  let [r, c] = curCell;

  if (direction === "left") {
    return [r, c - 1];
  } else if (direction === "right") {
    return [r, c + 1];
  } else if (direction === "up") {
    return [r - 1, c];
  } else if (direction === "down") {
    return [r + 1, c];
  } else {
    return [r, c];
  }
}

// ["up", "right"]     &     ["right", "up"] -> true
// ["up", "right"]     &     ["up", "right"] -> true
function matches(a, b) {
  if (a[0] === b[0] && a[1] === b[1]) {
    return true;
  }
  if (a[0] === b[1] && a[1] === b[0]) {
    return true;
  }
  return false;
}

function arePositionsEqual(a, b) {
  if (a[0] == b[0] && a[1] == b[1]) {
    return true;
  } else {
    return false;
  }
}
