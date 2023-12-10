import fs from 'fs';

// const input = fs.readFileSync("day3ex.txt", "utf8");
const input = fs.readFileSync('day3input.txt', 'utf8');

const lines = input.trim().split('\n');
const map = new Map<string, string>();

for (const [i, line] of lines.entries()) {
  for (const [j, c] of line.split('').entries()) {
    map.set(i + ',' + j, c);
  }
}

const mapHeight = lines.length;
const mapWidth = lines[0].length;
let total = 0;
for (let i = 0; i < mapHeight; i++) {
  let curNum = 0;
  let curNumHasSymbol = false;
  for (let j = 0; j < mapWidth; j++) {
    const isDigit =
      map.get(i + ',' + j)! >= '0' && map.get(i + ',' + j)! <= '9';
    if (isDigit) {
      if (curNum) {
        curNum = curNum * 10 + Number(map.get(i + ',' + j)!);
      } else {
        curNum = Number(map.get(i + ',' + j)!);
      }

      const left = map.get(i + ',' + (j - 1));
      const right = map.get(i + ',' + (j + 1));
      const top = map.get(i - 1 + ',' + j);
      const bottom = map.get(i + 1 + ',' + j);
      const topLeft = map.get(i - 1 + ',' + (j - 1));
      const topRight = map.get(i - 1 + ',' + (j + 1));
      const bottomLeft = map.get(i + 1 + ',' + (j - 1));
      const bottomRight = map.get(i + 1 + ',' + (j + 1));
      if (
        isSymbol(left) ||
        isSymbol(right) ||
        isSymbol(top) ||
        isSymbol(bottom) ||
        isSymbol(topLeft) ||
        isSymbol(topRight) ||
        isSymbol(bottomLeft) ||
        isSymbol(bottomRight)
      ) {
        curNumHasSymbol = true;
      }
    } else if (curNum) {
      if (curNumHasSymbol) {
        total += curNum;
      }
      curNum = 0;
      curNumHasSymbol = false;
    }
  }
  if (curNumHasSymbol) {
    total += curNum;
  }
}
console.log(total);
function isSymbol(c: string | undefined) {
  return c && !(c >= '0' && c <= '9') && c !== '.';
}

const gears = new Map<string, number[]>();
for (let i = 0; i < mapHeight; i++) {
  let curNum = 0;
  let curGears: string[] = [];
  for (let j = 0; j < mapWidth; j++) {
    const isDigit =
      map.get(i + ',' + j)! >= '0' && map.get(i + ',' + j)! <= '9';
    if (isDigit) {
      if (curNum) {
        curNum = curNum * 10 + Number(map.get(i + ',' + j)!);
      } else {
        curNum = Number(map.get(i + ',' + j)!);
      }

      const possibleGears = [
        `${i},${j - 1}`,
        `${i},${j + 1}`,
        `${i - 1},${j}`,
        `${i + 1},${j}`,
        `${i - 1},${j - 1}`,
        `${i - 1},${j + 1}`,
        `${i + 1},${j - 1}`,
        `${i + 1},${j + 1}`,
      ];

      possibleGears.forEach((gear) => {
        if (map.get(gear) === '*' && !curGears.includes(gear)) {
          curGears.push(gear);
        }
      });
    } else if (curNum) {
      curGears.forEach((gear) => {
        if (gears.has(gear)) {
          gears.get(gear)!.push(curNum);
        } else {
          gears.set(gear, [curNum]);
        }
      });
      curNum = 0;
      curGears = [];
    }
  }
  curGears.forEach((gear) => {
    if (gears.has(gear)) {
      gears.get(gear)!.push(curNum);
    } else {
      gears.set(gear, [curNum]);
    }
  });
}
console.log(
  [...gears.values()]
    .filter((g) => g.length === 2)
    .map((g) => g[0] * g[1])
    .reduce((a, b) => a + b, 0)
);
