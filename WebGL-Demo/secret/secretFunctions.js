// draws a melon when the user enters the konami code
function secretListener() {
  let pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let current = 0;

  let keyHandler = function (event) {
    // If the key isn't in the pattern, or isn't the current key in the pattern, reset
    if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
      current = 0;
      return;
    }

    // Update how much of the pattern is complete
    current++;

    // If complete, alert and reset
    if (pattern.length === current) {
      current = 0;
      music = new Audio('./secret/music.mp3');
      music.volume = 0.1;
      music.play();
      camera.moveForward(-0.5);
      handleSecretEvent('pikachu');
    }
  };

  // Listen for keydown events
  document.addEventListener('keydown', keyHandler, false);
}

function handleSecretEvent(option) {
  deleteAllModels();
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  lightPosition.elements = [0, 0, 2.5];
  camera.moveForward(-0.5);
  lightDirection = new Vector3([-0.5, 3.0, 4.0]);
  gl.uniform3fv(u_lightDirection, lightDirection.elements);
  bounce = true;

  let dropdown = document.getElementById('secret');
  dropdown.style.display = 'block';
  switch(option) {
    case 'pikachu':
      pixelArt(drawPikachu());
      let sound1 = new Audio('./secret/pikachu.mp3');
      sound1.volume = 0.25;
      sound1.play();
      break;
    case 'charmander':
      pixelArt(drawCharmander());
      let sound2 = new Audio('./secret/charmander.mp3');
      sound2.volume = 0.15;
      sound2.play();
      break;
    case 'squirtle':
      pixelArt(drawSquirtle());
      let sound3 = new Audio('./secret/squirtle.mp3');
      sound3.volume = 0.3;
      sound3.play();
      break;
    case 'bulbasaur':
      pixelArt(drawBulbasaur());
      let sound4 = new Audio('./secret/bulbasaur.mp3');
      sound4.volume = 0.3;
      sound4.play();
      break;
  }
}

// draws a 20x20 pikachu
function drawPikachu() {
  // colors
  let empty = null;
  let black = '#111111';
  let white = '#FFFFFF';
  let grey_ = '#5E5E5E';
  let yello = '#FED636';
  let ornge = '#F67F17';
  let red__ = '#F44236'

  let matrix = [
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  empty,  black,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  empty,  black,  black,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  black,  yello,  black,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  black,  grey_,  black,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  black,  yello,  ornge,  ornge,  black,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  black,  yello,  black,  empty,  empty,  empty,  empty,   black,  black,  black,  yello,  ornge,  ornge,  ornge,  black,  empty    ],
    [ empty,   empty,   empty,  empty,  black,  yello,  ornge,  black,  empty,  empty,  black,  black,   grey_,  grey_,  black,  ornge,  ornge,  ornge,  black,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  black,  yello,  yello,  yello,  black,  black,  yello,  yello,   grey_,  black,  ornge,  ornge,  ornge,  black,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  black,  yello,  yello,  yello,  yello,  yello,  yello,  yello,  yello,   black,  black,  ornge,  ornge,  black,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   black,  yello,  yello,  yello,  yello,  yello,  yello,  yello,  yello,  ornge,   black,  empty,  black,  ornge,  ornge,  black,  empty,  empty,  empty    ],
    [ empty,   black,   white,  yello,  yello,  yello,  yello,  yello,  yello,  yello,  yello,  yello,   black,  empty,  empty,  black,  ornge,  black,  empty,  empty,  empty    ],
    [ empty,   black,   black,  yello,  yello,  yello,  yello,  yello,  yello,  yello,  yello,  yello,   ornge,  black,  black,  ornge,  black,  empty,  empty,  empty,  empty    ],
    [ empty,   black,   yello,  yello,  yello,  yello,  white,  black,  yello,  yello,  yello,  ornge,   ornge,  black,  black,  black,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   black,  yello,  yello,  yello,  black,  black,  red__,  red__,  yello,  ornge,   grey_,  grey_,  black,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  black,  ornge,  yello,  yello,  yello,  red__,  ornge,  ornge,  ornge,   ornge,  ornge,  black,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   black,  yello,  ornge,  ornge,  ornge,  ornge,  ornge,  ornge,  black,  ornge,   ornge,  grey_,  black,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   black,  black,  black,  yello,  yello,  yello,  yello,  black,  yello,  ornge,   ornge,  ornge,  black,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  black,  ornge,  black,  yello,  yello,  yello,  yello,  black,  ornge,   ornge,  ornge,  black,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  black,  black,  black,  black,  black,  ornge,  ornge,  ornge,  ornge,   ornge,  black,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  black,  black,  black,  ornge,   black,  black,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  black,  yello,  yello,   ornge,  black,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  black,  black,   black,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ]
  ];

  return matrix;
}

// draws a 20x20 bulbasaur
function drawBulbasaur() {
  // colors
  let empty = null;
  let black = '#111111';
  let white = '#FFFFFF';
  let lblue = '#7EB2FE';
  let dblue = '#275FB4';
  let lgren = '#A3D10F';
  let dgren = '#6B8C07';
  let red__ = '#F44236'

  let matrix = [
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   empty,  black,  black,  black,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   black,  lgren,  lgren,  lgren,  black,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  black,  black,   black,  lgren,  lgren,  lgren,  black,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  black,  black,  lgren,  lgren,   dgren,  lgren,  lgren,  dgren,  lgren,  black,  black,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  black,  black,  empty,  black,  lgren,  lgren,  lgren,  dgren,   dgren,  lgren,  lgren,  dgren,  lgren,  lgren,  lgren,  black,  empty    ],
    [ empty,   empty,   empty,  black,  lblue,  lblue,  black,  black,  lgren,  lgren,  dgren,  lgren,   dgren,  lgren,  lgren,  lgren,  dgren,  lgren,  lgren,  lgren,  black    ],
    [ empty,   empty,   empty,  black,  lblue,  lblue,  lblue,  black,  black,  dgren,  lgren,  dgren,   lgren,  lgren,  lgren,  lgren,  lgren,  dgren,  lgren,  lgren,  black    ],
    [ empty,   empty,   empty,  black,  lblue,  lblue,  lblue,  lblue,  dblue,  black,  lgren,  dgren,   lgren,  lgren,  lgren,  lgren,  lgren,  dgren,  lgren,  lgren,  black    ],
    [ empty,   empty,   black,  lblue,  lblue,  dblue,  lblue,  dblue,  dblue,  lblue,  black,  black,   black,  lgren,  lgren,  lgren,  lgren,  dgren,  lgren,  black,  empty    ],
    [ empty,   black,   black,  dblue,  lblue,  lblue,  lblue,  lblue,  lblue,  lblue,  lblue,  lblue,   black,  lgren,  lgren,  lgren,  black,  black,  black,  black,  empty    ],
    [ empty,   black,   black,  dblue,  lblue,  lblue,  lblue,  dblue,  lblue,  lblue,  lblue,  black,   dblue,  black,  black,  black,  dblue,  dblue,  dblue,  black,  empty    ],
    [ empty,   black,   lblue,  lblue,  lblue,  lblue,  dblue,  lblue,  black,  black,  lblue,  dblue,   dblue,  dblue,  dblue,  dblue,  black,  dblue,  white,  black,  empty    ],
    [ empty,   black,   dblue,  lblue,  lblue,  lblue,  lblue,  black,  red__,  white,  white,  dblue,   dblue,  black,  dblue,  dblue,  black,  black,  black,  empty,  empty    ],
    [ empty,   empty,   black,  dblue,  lblue,  lblue,  lblue,  black,  red__,  white,  lblue,  dblue,   black,  dblue,  dblue,  black,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  black,  black,  dblue,  dblue,  dblue,  dblue,  dblue,  dblue,  black,   dblue,  dblue,  dblue,  black,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  black,  black,  black,  black,  black,  black,  black,   white,  dblue,  white,  black,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   black,  black,  black,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
  ];

  return matrix;
}

// draws a 20x20 charmander
function drawCharmander() {
  // colors
  let empty = null;
  let black = '#111111';
  let white = '#FFFFFF';
  let yello = '#FEFE12';
  let ornge = '#FE8C29';
  let red__ = '#F44236'

  let matrix = [
    [ empty,   empty,   empty,   empty,  black,  black,  black,  black,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  empty,  black,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   black,  ornge,  ornge,  ornge,  ornge,  black,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  black,  red__,  black,  empty,  empty    ],
    [ empty,   empty,   black,   ornge,  ornge,  ornge,  ornge,  ornge,  ornge,  black,  empty,  empty,   empty,  empty,  empty,  empty,  black,  red__,  red__,  black,  empty    ],
    [ empty,   empty,   black,   ornge,  ornge,  ornge,  ornge,  ornge,  ornge,  black,  empty,  empty,   empty,  empty,  empty,  empty,  black,  red__,  red__,  black,  empty    ],
    [ empty,   black,   ornge,   ornge,  ornge,  ornge,  ornge,  ornge,  ornge,  ornge,  black,  empty,   empty,  empty,  empty,  black,  red__,  red__,  red__,  red__,  black    ],
    [ black,   ornge,   ornge,   ornge,  ornge,  white,  black,  ornge,  ornge,  ornge,  black,  empty,   empty,  empty,  empty,  black,  red__,  red__,  yello,  red__,  black    ],
    [ black,   ornge,   ornge,   ornge,  ornge,  black,  black,  ornge,  ornge,  ornge,  ornge,  black,   empty,  empty,  empty,  black,  red__,  yello,  yello,  red__,  black    ],
    [ black,   ornge,   ornge,   ornge,  ornge,  black,  black,  ornge,  ornge,  ornge,  ornge,  black,   empty,  empty,  empty,  empty,  black,  yello,  black,  black,  empty    ],
    [ empty,   black,   ornge,   ornge,  ornge,  ornge,  ornge,  ornge,  ornge,  ornge,  ornge,  ornge,   black,  empty,  empty,  empty,  black,  ornge,  black,  empty,  empty    ],
    [ empty,   empty,   black,   black,  ornge,  ornge,  ornge,  ornge,  ornge,  ornge,  ornge,  ornge,   ornge,  black,  empty,  black,  ornge,  ornge,  black,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  black,  black,  black,  ornge,  ornge,  black,  ornge,  ornge,   ornge,  black,  black,  ornge,  ornge,  black,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  black,  yello,  yello,  black,  ornge,  ornge,  ornge,   ornge,  ornge,  black,  ornge,  ornge,  black,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  black,  yello,  yello,  yello,  black,  black,  ornge,   ornge,  ornge,  black,  ornge,  black,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  black,  white,  black,  yello,  yello,  yello,  ornge,  ornge,   ornge,  ornge,  black,  black,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  black,  black,  black,  yello,  yello,  ornge,  ornge,   ornge,  black,  black,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  empty,  empty,  empty,  black,  black,  black,  ornge,   black,  black,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  black,  white,  ornge,   white,  black,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  black,  black,   black,  black,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ]
  ];

  return matrix;
}

// draws a 20x20 squirtle
function drawSquirtle() {
  // colors
  let empty = null;
  let black = '#111111';
  let white = '#FFFFFF';
  let yello = '#FFE22E';
  let blue_ = '#13E7FD';
  let brown = '#563820'

  let matrix = [
    [ empty,   empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   black,  black,  black,  black,  empty,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  black,  black,  black,  empty,  empty    ],
    [ empty,   empty,   black,   blue_,  blue_,  blue_,  blue_,  black,  black,  empty,  empty,  empty,   empty,  empty,  empty,  black,  blue_,  blue_,  blue_,  black,  empty    ],
    [ empty,   black,   blue_,   blue_,  blue_,  blue_,  blue_,  blue_,  blue_,  black,  black,  empty,   empty,  empty,  black,  blue_,  blue_,  blue_,  blue_,  blue_,  black    ],
    [ empty,   black,   blue_,   blue_,  blue_,  blue_,  blue_,  blue_,  blue_,  black,  brown,  black,   black,  empty,  black,  blue_,  blue_,  blue_,  black,  blue_,  black    ],
    [ black,   brown,   blue_,   blue_,  blue_,  blue_,  blue_,  blue_,  blue_,  blue_,  brown,  brown,   brown,  black,  blue_,  blue_,  blue_,  black,  blue_,  blue_,  black     ],
    [ black,   blue_,   blue_,   blue_,  blue_,  white,  black,  blue_,  blue_,  blue_,  white,  brown,   brown,  brown,  black,  blue_,  blue_,  black,  blue_,  black,  empty    ],
    [ black,   blue_,   blue_,   blue_,  blue_,  black,  brown,  blue_,  blue_,  blue_,  white,  brown,   brown,  brown,  black,  blue_,  black,  black,  black,  empty,  empty    ],
    [ empty,   black,   blue_,   blue_,  blue_,  black,  brown,  blue_,  blue_,  blue_,  black,  white,   brown,  brown,  brown,  black,  black,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   black,   black,  blue_,  blue_,  blue_,  blue_,  black,  black,  blue_,  blue_,   white,  brown,  brown,  black,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   black,   blue_,  black,  black,  black,  black,  blue_,  blue_,  blue_,  blue_,   white,  brown,  brown,  black,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   black,  black,  yello,  yello,  black,  blue_,  blue_,  blue_,  black,   white,  brown,  brown,  black,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  black,  yello,  yello,  black,  black,  black,  black,   white,  brown,  brown,  black,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  black,  blue_,  black,  yello,  yello,  yello,  yello,  yello,   black,  white,  black,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  black,  black,  black,  black,  yello,  yello,  blue_,   black,  white,  black,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  empty,  empty,  empty,  black,  black,  black,  blue_,   black,  black,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  black,  blue_,  blue_,   blue_,  black,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  black,  black,   black,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ],
    [ empty,   empty,   empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,   empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty,  empty    ]
  ];

  return matrix;
}

/**
 * draws a pixel art from square cylinders
 * @param {Array} matrix a 10x10 array of [r,g,b] colors
 */
function pixelArt(matrix) {
  for (let i = 0; i < 20; ++i) {
    for (let j = 0; j < 21; ++j) {
      if (matrix[i][j] === null) continue;

      let color = matrix[i][j];
      let rgb = [parseInt(color[1]+color[2], 16), parseInt(color[3]+color[4], 16), parseInt(color[5]+color[6], 16)];
      for (let i = 0; i < 3; ++i) rgb[i] = rgb[i] / 255;

      // creating a cube from the matrix
      let cube = addModel('cube', rgb, null, false);
      // scaling the cube down to the proper size
      cube.setScale(0.04, 0.04, 0.04);

      // calculating how much to translate each pixel
      let translateX = -0.9 + 2*j/30  + 0.2;
      let translateY = 0.72 - 2*i/25;

      // performing the translation
      cube.setTranslate(translateX, translateY, 0.9-j/20);
      // performing the rotation
      cube.setRotate(0, 20, 0);
    }
  }
}