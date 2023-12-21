import fs from 'fs';

const infile = process.argv[2];
const lines = fs.readFileSync(infile, 'utf8').trim().split('\n');

const sPos = lines.reduce(
  (acc, line, y) => {
    const x = line.indexOf('S');
    if (x !== -1) {
      return `${x},${y}`;
    }
    return acc;
  },
  undefined as string | undefined
);

if (!sPos) throw new Error('No start position');

const pointParity = (x: number, y: number) => (x + y) % 2;
const startParity = pointParity(
  ...(sPos.split(',').map(Number) as [number, number])
);
if (startParity) throw new Error('Start parity is not 0');

function surroundingPoints(x: number, y: number) {
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];
}

function isPlot(x: number, y: number) {
  const moddedX = x % lines[0].length;
  const moddedY = y % lines.length;

  return (
    lines[moddedY < 0 ? lines.length + moddedY : moddedY][
      moddedX < 0 ? lines[0].length + moddedX : moddedX
    ] !== '#'
  );
}

// const { stepsToCoverMarginalBoard, stepsToCover } = (() => {
let curEven = new Set<string>();
curEven.add(sPos);
let curOdd = new Set<string>();
/* let boardsCovered = -1;
  let stepsToCover = 0; */
for (let i = 1; i < 50000; i++) {
  curEven.forEach((pos) => {
    const [x, y] = pos.split(',').map(Number);
    const surrounding = surroundingPoints(x, y);
    surrounding
      .filter(({ x, y }) => isPlot(x, y))
      .forEach(({ x, y }) => curOdd.add(`${x},${y}`));
  });
  if ((i * 2 - 1) % 131 === 65) {
    console.log(i * 2 - 1);
    console.log(curOdd.size);
    console.log(curEven.size);
  }
  /* if (allPointsNBoardsAwayCovered(boardsCovered + 1, curOdd, curEven)) {
      if (boardsCovered === 0) {
        return {
          stepsToCover,
          stepsToCoverMarginalBoard: i * 2 - 1 - stepsToCover,
        };
      }
      boardsCovered++;
      stepsToCover = i * 2 - 1;
    } */
  curOdd.forEach((pos) => {
    const [x, y] = pos.split(',').map(Number);
    const surrounding = surroundingPoints(x, y);
    surrounding
      .filter(({ x, y }) => isPlot(x, y))
      .forEach(({ x, y }) => curEven.add(`${x},${y}`));
  });
  if ((i * 2) % 131 === 65) {
    console.log(i * 2);
    console.log(curOdd.size);
    console.log(curEven.size);
  }
  /* if (allPointsNBoardsAwayCovered(boardsCovered + 1, curOdd, curEven)) {
      if (boardsCovered === 0) {
        return {
          stepsToCover,
          stepsToCoverMarginalBoard: i * 2 - stepsToCover,
        };
      }
      boardsCovered++;
      stepsToCover = i * 2;
    } */
}
// })();

// console.log(stepsToCover, stepsToCoverMarginalBoard);

function allPointsNBoardsAwayCovered(
  n: number,
  oddPoints: Set<string>,
  evenPoints: Set<string>
) {
  for (let i = -n * lines.length; i < lines.length + n * lines.length; i++) {
    for (
      let j = -n * lines[0].length;
      j < lines[0].length + n * lines[0].length * 2;
      j++
    ) {
      if (!isPlot(j, i)) {
        continue;
      }
      if (
        pointParity(j, i) === startParity ?
          evenPoints.has(`${j},${i}`)
        : oddPoints.has(`${j},${i}`)
      ) {
        continue;
      }
      return false;
    }
  }
  return true;
}
function printN(n: number, oddPoints: Set<string>, evenPoints: Set<string>) {
  for (let i = -n * lines.length; i < lines.length + n * lines.length; i++) {
    const line = [];
    for (
      let j = -n * lines[0].length;
      j < lines[0].length + n * lines[0].length * 2;
      j++
    ) {
      if (!isPlot(j, i)) {
        line.push('#');
      } else if (
        pointParity(j, i) === startParity ?
          evenPoints.has(`${j},${i}`)
        : oddPoints.has(`${j},${i}`)
      ) {
        line.push('O');
      } else {
        line.push('.');
      }
    }
    console.log(line.join(''));
  }
}
