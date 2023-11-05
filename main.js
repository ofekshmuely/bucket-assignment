var bucket = document.getElementById("bucket");

//testing the game using keyboard
var keydown = {
  ArrowLeft: false,
  ArrowRight: false,
};
var score = 1;
var x = 400;
var y = 600;
var xvel = 0;
var yvel = 0;
var numbers = [];
for (var i = 1; i <= 10; i++) {
  numbers.push(i);
}
var numberElements = [];
var collectedNumbers = [];

// Function to adjust game layout based on the screen size
function adjustGameLayout() {
  var viewportWidth = window.innerWidth;
  var viewportHeight = window.innerHeight;

  // Adjust the size of the bucket for mobile screens
  var bucketSize = viewportWidth < 600 ? 50 : 100; // Define the bucket size for mobile screens
  bucket.style.width = bucketSize + "px";
  bucket.style.height = bucketSize + "px";

  x = (viewportWidth - bucketSize) / 2;
  y = viewportHeight - 100;
  
  for (var i = 0; i < 10; i++) {
    numberElements[i][1] = Math.floor(Math.random() * (viewportWidth - 30));
    numberElements[i][2] = Math.floor(Math.random() * (viewportHeight - 30));
    document.getElementsByClassName("drops")[i].style.top =
      numberElements[i][2] + "px";
    document.getElementsByClassName("drops")[i].style.left =
      numberElements[i][1] + "px";
  }
}

window.addEventListener("resize", adjustGameLayout);

document.onkeydown = function (e) {
  keydown[e.key] = true;
};

document.onkeyup = function (e) {
  keydown[e.key] = false;
};

document.onmousemove = function (e) {
  x = e.clientX - bucket.clientWidth / 2;
  if (x < 0) {
    x = 0;
  }
  if (x + bucket.clientWidth > window.innerWidth) {
    x = window.innerWidth - bucket.clientWidth;
  }
};

// Add touch event listeners for mobile drag
var startX, currentX;
bucket.addEventListener("touchstart", function (e) {
  startX = e.touches[0].clientX;
  currentX = x;
});

bucket.addEventListener("touchmove", function (e) {
  e.preventDefault();
  currentX = x;
  var touchX = e.touches[0].clientX;
  var dx = touchX - startX;
  currentX += dx;

  if (currentX < 0) {
    currentX = 0;
  }
  if (currentX + bucket.clientWidth > window.innerWidth) {
    currentX = window.innerWidth - bucket.clientWidth;
  }

  x = currentX;
  startX = touchX;
});

document.getElementById("win").hidden = true;

var gameInterval = setInterval(updateGame, 10);

function updateGame() {
  xvel *= 0.89;
  yvel *= 0.89;

  if (keydown.ArrowLeft) {
    xvel -= 0.5;
  }
  if (keydown.ArrowRight) {
    xvel += 0.5;
  }
  x += xvel;
  y += yvel;
  if (y < 200) {
    y = 200;
  }
  if (y > 600) {
    y = 600;
  }
  if (x < 0) {
    x = 0;
  }
  if (x > window.innerWidth - bucket.clientWidth) {
    x = window.innerWidth - bucket.clientWidth;
  }
  for (var i = 0; i < 10; i++) {
    numberElements[i][2] += 2;
    if (numberElements[i][2] > window.innerHeight) {
      numberElements[i][2] = 80;
      numberElements[i][1] = Math.floor(
        Math.random() * (window.innerWidth - 30)
      );
      numberElements[i][0] = numbers[i];
    }
    document.getElementsByClassName("drops")[i].style.top =
      numberElements[i][2] + "px";
    document.getElementsByClassName("drops")[i].style.left =
      numberElements[i][1] + "px";
  }

  for (var i = 0; i < 10; i++) {
    if (
      (numberElements[i][1] < x + bucket.clientWidth &&
        numberElements[i][1] + 30 > x + bucket.clientWidth) ||
      (numberElements[i][1] + 30 > x && numberElements[i][1] < x) ||
      (numberElements[i][1] > x &&
        numberElements[i][1] + 30 < x + bucket.clientWidth)
    ) {
      if (
        (numberElements[i][2] + 30 > y && numberElements[i][2] < y) ||
        (numberElements[i][2] < y + bucket.clientHeight &&
          numberElements[i][2] + 30 > y + bucket.clientHeight)
      ) {
        if (numberElements[i][0] === score) {
          collectedNumbers.push(numberElements[i][0]);
          score += 1;
        } else {
          collectedNumbers = [];
          score = 1;
        }
        numberElements[i][2] = 80;
        numberElements[i][1] = Math.floor(
          Math.random() * (window.innerWidth - 30)
        );
        numberElements[i][0] = numbers[i];
      }
    }
  }

  // debug result by decreasing the score
  if (score > 10) {
    document.getElementById("win").hidden = false;

    score = 10;
    document.getElementById("scoresystem").hidden = true;

    for (var i = 0; i < 10; i++) {
      document.getElementsByClassName("drops")[i].classList.add("fade-out");
    }

    document.getElementById("bucket").classList.add("winning-dance");
    clearInterval(gameInterval);
  }
  bucket.style.left = x + "px";
  bucket.style.top = y + "px";
  document.getElementById("scoresystem").innerHTML = "NEXT: " + score;
}

function setupGame() {
  for (var i = 1; i <= 10; i++) {
    numbers.push(i);
  }
  for (var i = 0; i < 10; i++) {
    numberElements.push([
      numbers[i],
      Math.floor(Math.random() * (window.innerWidth - 30)),
      Math.floor(Math.random() * (window.innerHeight - 30)),
    ]);
    var numberElement = document.createElement("p");
    numberElement.setAttribute("style", "font-size:30px; position:absolute;");
    numberElement.setAttribute("class", "drops");
    numberElement.innerHTML = numbers[i];
    document.body.appendChild(numberElement);
  }
  adjustGameLayout();
}

setupGame();
