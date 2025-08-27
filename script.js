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

function drawGraph() {
  const canvas = document.getElementById("graph-canvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate the range needed to show the point with padding
  const padding = 3; // Extra units of padding around the point
  const minX = Math.min(-10, currentProblem.point.x - padding);
  const maxX = Math.max(10, currentProblem.point.x + padding);
  const minY = Math.min(-10, currentProblem.point.y - padding);
  const maxY = Math.max(10, currentProblem.point.y + padding);

  // Also consider the line's y-values at the edges
  const lineYAtMinX = currentProblem.m * minX + currentProblem.b;
  const lineYAtMaxX = currentProblem.m * maxX + currentProblem.b;
  const finalMinY = Math.min(
    minY,
    lineYAtMinX - padding,
    lineYAtMaxX - padding,
  );
  const finalMaxY = Math.max(
    maxY,
    lineYAtMinX + padding,
    lineYAtMaxX + padding,
  );

  // Calculate scale to fit everything
  const rangeX = maxX - minX;
  const rangeY = finalMaxY - finalMinY;
  const scaleX = (width - 40) / rangeX; // Leave some margin
  const scaleY = (height - 40) / rangeY;
  const scale = Math.min(scaleX, scaleY);

  // Calculate the actual visible range
  const visibleRangeX = width / scale;
  const visibleRangeY = height / scale;
  const visibleMinX = -visibleRangeX / 2;
  const visibleMaxX = visibleRangeX / 2;
  const visibleMinY = -visibleRangeY / 2;
  const visibleMaxY = visibleRangeY / 2;

  ctx.clearRect(0, 0, width, height);

  // Draw grid lines
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 1;

  // Calculate grid spacing
  const gridSpacing = Math.pow(
    10,
    Math.floor(Math.log10(Math.max(rangeX, rangeY) / 10)),
  );

  for (
    let x = Math.floor(visibleMinX / gridSpacing) * gridSpacing;
    x <= visibleMaxX;
    x += gridSpacing
  ) {
    const screenX = centerX + x * scale;
    if (screenX >= 0 && screenX <= width) {
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, height);
      ctx.stroke();
    }
  }

  for (
    let y = Math.floor(visibleMinY / gridSpacing) * gridSpacing;
    y <= visibleMaxY;
    y += gridSpacing
  ) {
    const screenY = centerY - y * scale;
    if (screenY >= 0 && screenY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(width, screenY);
      ctx.stroke();
    }
  }

  // Draw axes
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();

  // Draw axis labels
  ctx.font = "11px Arial";
  ctx.fillStyle = "#666";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const labelSpacing =
    gridSpacing * (gridSpacing < 1 ? 10 : gridSpacing < 5 ? 2 : 1);

  for (
    let x = Math.floor(visibleMinX / labelSpacing) * labelSpacing;
    x <= visibleMaxX;
    x += labelSpacing
  ) {
    if (Math.abs(x) > 0.001) {
      const screenX = centerX + x * scale;
      if (screenX >= 10 && screenX <= width - 10) {
        const label = Math.abs(x) < 1 ? x.toFixed(1) : x.toFixed(0);
        ctx.fillText(label, screenX, centerY + 5);
      }
    }
  }

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  for (
    let y = Math.floor(visibleMinY / labelSpacing) * labelSpacing;
    y <= visibleMaxY;
    y += labelSpacing
  ) {
    if (Math.abs(y) > 0.001) {
      const screenY = centerY - y * scale;
      if (screenY >= 10 && screenY <= height - 10) {
        const label = Math.abs(y) < 1 ? y.toFixed(1) : y.toFixed(0);
        ctx.fillText(label, centerX + 5, screenY);
      }
    }
  }

  ctx.strokeStyle = "#3498db";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const startX = -centerX / scale;
  const endX = centerX / scale;
  const startY = currentProblem.m * startX + currentProblem.b;
  const endY = currentProblem.m * endX + currentProblem.b;
  ctx.moveTo(0, centerY - startY * scale);
  ctx.lineTo(width, centerY - endY * scale);
  ctx.stroke();

  const pointScreenX = centerX + currentProblem.point.x * scale;
  const pointScreenY = centerY - currentProblem.point.y * scale;

  ctx.fillStyle = currentProblem.isOnLine ? "#27ae60" : "#e74c3c";
  ctx.beginPath();
  ctx.arc(pointScreenX, pointScreenY, 6, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "#333";
  ctx.font = "14px Arial";
  ctx.fillText(
    `(${currentProblem.point.x}, ${currentProblem.point.y})`,
    pointScreenX + 10,
    pointScreenY - 10,
  );
}

function revealAnswer() {
  const answerBox = document.getElementById("answer-box");
  const answerResult = document.getElementById("answer-result");
  const answerExplanation = document.getElementById("answer-explanation");

  answerBox.classList.remove("hidden");

  drawGraph();

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
