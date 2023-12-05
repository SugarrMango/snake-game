let pointsElement = document.querySelector(".points");
let points;

function getPoints() {
  return points;
}

function resetPoints() {
  points = 0;
  pointsElement.textContent = points;
}

function increasePoints(x) {
  points += x;
  pointsElement.textContent = points;
}
