document.addEventListener("DOMContentLoaded", () => {
  // Game constants
  const width = 10;
  let nextRandom = 0;
  let timerId;

  // Fetch the grid and the cells, cast NodeList to Array
  const grid = document.querySelector(".grid");
  let cells = Array.from(document.querySelectorAll(".grid div"));

  // Fetch score and start/pause button
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");

  // Tetrominoes (expressed as what cells are non-empty in a 3x3 / 4x4 grid)
  // Geometrical definition + store them in an array
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const tetrominos = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  // Tetrominos initial spawn position
  let currentPosition = 4;
  let currentRotation = 0;

  // Randomly select a tetromino + one rotation for it
  let rnd = Math.floor(Math.random() * tetrominos.length);
  let current = tetrominos[rnd][currentRotation];

  // Function that draws the tetromino
  const draw = () => {
    current.forEach((index) => {
      cells[currentPosition + index].classList.add("tetromino");
    });
  };

  // Function that un-draws the tetromino
  const unDraw = () => {
    current.forEach((index) => {
      cells[currentPosition + index].classList.remove("tetromino");
    });
  };

  // Assign functions to keycodes
  const control = (e) => {
    switch (e.keyCode) {
      case 37:
        moveLeft();
        break;
      case 38:
        rotate();
        break;
      case 39:
        moveRight();
        break;
      case 40:
        //speedUp();
        break;
      default:
        break;
    }
  };
  document.addEventListener("keyup", control);

  const moveDown = () => {
    unDraw();
    currentPosition += width;
    draw();
    freeze();
  };

  // Stop the tetraminoes at the game board's bottom
  const freeze = () => {
    if (
      current.some((index) =>
        cells[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        cells[currentPosition + index].classList.add("taken")
      );
      //start a new tetromino falling
      rnd = nextRandom;
      nextRandom = Math.floor(Math.random() * tetrominos.length);
      current = tetrominos[rnd][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
    }
  };

  // Movement functions
  const moveLeft = () => {
    unDraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) {
      currentPosition -= 1;
    }

    if (
      current.some((index) =>
        cells[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }

    draw();
  };

  const moveRight = () => {
    unDraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) {
      currentPosition += 1;
    }

    if (
      current.some((index) =>
        cells[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }

    draw();
  };

  // Rotate the tetromino
  const rotate = () => {
    unDraw();
    currentRotation++;

    if (currentRotation === current.length) {
      currentRotation = 0;
    }

    current = tetrominos[rnd][currentRotation];
    draw();
  };

  // Show next-tetromino in mini-grid
  const displayCells = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  // tetraminos without rotatio
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];

  // Display the shape in the minigrid
  const displayShape = () => {
    // remove tetramino from grid
    displayCells.forEach((cell) => {
      cell.classList.remove("tetromino");
    });

    upNextTetrominoes[nextRandom].forEach((index) => {
      displayCells[displayIndex + index].classList.add("tetromino");
    });
  };

  // add functionality to start-pause button
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 250);
      nextRandom = Math.floor(Math.random() * tetrominos.length);
      displayShape();
    }
  });
});
