document.addEventListener("DOMContentLoaded", () => {
  // Game constants
  const width = 10;

  // Fetch the grid and the cells, cast NodeList to Array
  const grid = document.querySelector(".grid");
  let cells = Array.from(document.querySelectorAll(".grid div"));

  // Fetch score and start/pause button
  const ScoreDisplay = document.querySelector("#score");
  const StartBtn = document.querySelector("#start-button");

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

  // Make the tetrominoes move down every second
  timeId = setInterval(() => {
    unDraw();
    currentPosition += width;
    draw();
    freeze();
  }, 250);

  // Assign functions to keycodes
  const control = (e) => {
    switch (e.keyCode) {
      case 37:
        moveLeft();
        break;
      case 38: //rotate
        break;
      case 39:
        moveRight();
        break;
      case 40:
        speedUp();
        break;
      default:
        break;
    }
  };
  document.addEventListener("keyup", control);

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
      rnd = Math.floor(Math.random() * tetrominos.length);
      current = tetrominos[rnd][currentRotation];
      currentPosition = 4;
      draw();
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
      (index) => (currentPosition + index) % width === width-1
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
});
