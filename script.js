const COLORS = {
  U: 'w',
  D: 'y',
  F: 'g',
  B: 'b',
  L: 'o',
  R: 'r'
};

class RubiksCube {
  constructor() {
    this.faces = {
      U: Array(9).fill(COLORS.U),
      D: Array(9).fill(COLORS.D),
      F: Array(9).fill(COLORS.F),
      B: Array(9).fill(COLORS.B),
      L: Array(9).fill(COLORS.L),
      R: Array(9).fill(COLORS.R)
    };
  }

  rotate(face, clockwise = true) {
    this.rotateFace(face, clockwise);
    this.rotateSides(face, clockwise);
  }

  rotateFace(face, clockwise) {
    const f = this.faces[face];
    const indices = clockwise
      ? [6, 3, 0, 7, 4, 1, 8, 5, 2]
      : [2, 5, 8, 1, 4, 7, 0, 3, 6];
    const newFace = f.map((_, i) => f[indices[i]]);
    this.faces[face] = newFace;
  }

  rotateSides(face, clockwise) {
    const map = {
      U: [['B', 0,1,2], ['R', 0,1,2], ['F', 0,1,2], ['L', 0,1,2]],
      D: [['F', 6,7,8], ['R', 6,7,8], ['B', 6,7,8], ['L', 6,7,8]],
      F: [['U', 6,7,8], ['R', 0,3,6], ['D', 2,1,0], ['L', 8,5,2]],
      B: [['U', 2,1,0], ['L', 0,3,6], ['D', 6,7,8], ['R', 8,5,2]],
      L: [['U', 0,3,6], ['F', 0,3,6], ['D', 0,3,6], ['B', 8,5,2]],
      R: [['U', 8,5,2], ['B', 0,3,6], ['D', 8,5,2], ['F', 8,5,2]]
    };

    const sides = map[face];
    const buffer = sides.map(([f, ...idxs]) => idxs.map(i => this.faces[f][i]));

    const rotated = clockwise ? [3, 0, 1, 2] : [1, 2, 3, 0];
    rotated.forEach((toIdx, i) => {
      const [f, ...idxs] = sides[toIdx];
      idxs.forEach((idx, j) => {
        this.faces[f][idx] = buffer[i][j];
      });
    });
  }

  scramble(moves = 15) {
    const faces = Object.keys(this.faces);
    for (let i = 0; i < moves; i++) {
      const face = faces[Math.floor(Math.random() * 6)];
      const clockwise = Math.random() > 0.5;
      this.rotate(face, clockwise);
    }
  }

  isSolved() {
    return Object.values(this.faces).every(face => face.every(c => c === face[0]));
  }

  clone() {
    const clone = new RubiksCube();
    for (let f in this.faces) {
      clone.faces[f] = [...this.faces[f]];
    }
    return clone;
  }

  getCubeString() {
    return Object.values(this.faces).map(f => f.join('')).join('');
  }
}

function getCubeSvg(cube) {
  const { U, D, F, B, L, R } = cube.faces;

  function faceHtml(faceArr) {
    return faceArr.map((color, i) => 
      `<div class="cell ${color}">${color}</div>`).join('');
  }

  const cubeHtml = `
    <div class="cube">
      <div class="face-row"><div class="face">${faceHtml(U)}</div></div>
      <div class="face-row">
        <div class="face">${faceHtml(L)}</div>
        <div class="face">${faceHtml(F)}</div>
        <div class="face">${faceHtml(R)}</div>
        <div class="face">${faceHtml(B)}</div>
      </div>
      <div class="face-row"><div class="face">${faceHtml(D)}</div></div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = cubeHtml;
  container.classList.add('step');
  return container;
}

function runSolver() {
  const cube = new RubiksCube();
  cube.scramble();

  const stepsDiv = document.getElementById('cube-steps');
  stepsDiv.innerHTML = '<h3>Solving Steps:</h3>';

  let step = 0;
  const steps = [cube.clone()];

  while (!cube.isSolved() && step < 10) {
    const face = ['U','D','L','R','F','B'][Math.floor(Math.random()*6)];
    const dir = Math.random() > 0.5;
    cube.rotate(face, dir);
    steps.push(cube.clone());
    step++;
  }

  steps.forEach((stepCube, i) => {
    const label = document.createElement('p');
    label.textContent = `Step ${i}`;
    stepsDiv.appendChild(label);
    stepsDiv.appendChild(getCubeSvg(stepCube));
  });
}
