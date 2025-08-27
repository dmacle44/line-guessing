let currentProblem = {
  m: 0,
  b: 0,
  point: { x: 0, y: 0 },
  isOnLine: false,
};

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNewProblem() {
  currentProblem.m = generateRandomNumber(-5, 5);
  currentProblem.b = generateRandomNumber(-10, 10);

  const x = generateRandomNumber(-10, 10);

  if (Math.random() < 0.5) {
    const correctY = currentProblem.m * x + currentProblem.b;
    currentProblem.point = { x: x, y: correctY };
    currentProblem.isOnLine = true;
  } else {
    const correctY = currentProblem.m * x + currentProblem.b;
    let randomY;
    do {
      randomY = generateRandomNumber(-20, 20);
    } while (randomY === correctY);
    currentProblem.point = { x: x, y: randomY };
    currentProblem.isOnLine = false;
  }

  displayProblem();
  hideAnswer();
}

function displayProblem() {
  const equationDisplay = document.getElementById("equation-display");
  const pointDisplay = document.getElementById("point-display");

  let equationText = "y = ";
  if (currentProblem.m === 0) {
    equationText += currentProblem.b;
  } else if (currentProblem.m === 1) {
    equationText += "x";
    if (currentProblem.b > 0) {
      equationText += " + " + currentProblem.b;
    } else if (currentProblem.b < 0) {
      equationText += " - " + Math.abs(currentProblem.b);
    }
  } else if (currentProblem.m === -1) {
    equationText += "-x";
    if (currentProblem.b > 0) {
      equationText += " + " + currentProblem.b;
    } else if (currentProblem.b < 0) {
      equationText += " - " + Math.abs(currentProblem.b);
    }
  } else {
    equationText += currentProblem.m + "x";
    if (currentProblem.b > 0) {
      equationText += " + " + currentProblem.b;
    } else if (currentProblem.b < 0) {
      equationText += " - " + Math.abs(currentProblem.b);
    }
  }

  equationDisplay.textContent = equationText;
  pointDisplay.textContent = `(${currentProblem.point.x}, ${currentProblem.point.y})`;
}

function revealAnswer() {
  const answerBox = document.getElementById("answer-box");
  const answerResult = document.getElementById("answer-result");
  const answerExplanation = document.getElementById("answer-explanation");

  answerBox.classList.remove("hidden");

  const calculatedY =
    currentProblem.m * currentProblem.point.x + currentProblem.b;

  if (currentProblem.isOnLine) {
    answerBox.classList.remove("incorrect");
    answerBox.classList.add("correct");
    answerResult.classList.remove("incorrect");
    answerResult.classList.add("correct");
    answerResult.textContent = "The point IS on the line!";
    answerExplanation.innerHTML = `
            When x = ${currentProblem.point.x}:<br>
            y = ${currentProblem.m} × ${currentProblem.point.x} + ${currentProblem.b}<br>
            y = ${calculatedY}<br>
            The point (${currentProblem.point.x}, ${currentProblem.point.y}) matches!
        `;
  } else {
    answerBox.classList.remove("correct");
    answerBox.classList.add("incorrect");
    answerResult.classList.remove("correct");
    answerResult.classList.add("incorrect");
    answerResult.textContent = "The point is NOT on the line!";
    answerExplanation.innerHTML = `
            When x = ${currentProblem.point.x}:<br>
            y = ${currentProblem.m} × ${currentProblem.point.x} + ${currentProblem.b}<br>
            y = ${calculatedY}<br>
            But the point has y = ${currentProblem.point.y}<br>
            ${calculatedY} ≠ ${currentProblem.point.y}, so the point is not on the line.
        `;
  }
}

function hideAnswer() {
  const answerBox = document.getElementById("answer-box");
  answerBox.classList.add("hidden");
  answerBox.classList.remove("correct", "incorrect");
}

document.getElementById("reveal-btn").addEventListener("click", revealAnswer);
document
  .getElementById("new-problem-btn")
  .addEventListener("click", generateNewProblem);

generateNewProblem();

