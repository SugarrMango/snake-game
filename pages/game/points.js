let pointsElement = document.querySelector(".points");
let points;

function getPoints() {
  return points;
}

function displayPoints() {
  pointsElement.textContent = `${points} points`;
}

function resetPoints() {
  points = 0;
  displayPoints();
}

function increasePoints(x) {
  points += x;
  displayPoints();
}
