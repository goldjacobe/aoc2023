import fs from 'fs';

const infile = process.argv[2];
const lines = fs.readFileSync(infile, 'utf8').trim().split('\n');

const corners1 = new Map<string, string>();
const corners2 = new Map<string, string>();
let cur = { x: 0, y: 0 };
let minX = 0;
let maxX = 0;
let minY = 0;
let maxY = 0;

const gridSparseYFirst = new Map<number, Map<number, string>>();
function addToGrid(x: number, y: number, c: string) {
  if (!gridSparseYFirst.has(y)) {
    gridSparseYFirst.set(y, new Map<number, string>());
  }
  gridSparseYFirst.get(y)!.set(x, c);
}
for (const line of lines) {
  // part1
  /* const [direction, distanceStr] = line.split(' ');
  const distance = +distanceStr; */
  // part2
  const distance = parseInt(line.split(' ')[2].substring(2, 7), 16);
  const direction = { '0': 'R', '1': 'D', '2': 'L', '3': 'U' }[
    line.split(' ')[2].charAt(7)
  ];
  switch (direction) {
    case 'R':
      corners1.set(`${cur.x},${cur.y}`, 'R');
      cur = { x: cur.x + distance, y: cur.y };
      corners2.set(`${cur.x},${cur.y}`, 'L');
      maxX = Math.max(maxX, cur.x);
      break;
    case 'L':
      corners1.set(`${cur.x},${cur.y}`, 'L');
      cur = { x: cur.x - distance, y: cur.y };
      corners2.set(`${cur.x},${cur.y}`, 'R');
      minX = Math.min(minX, cur.x);
      break;
    case 'U':
      corners1.set(`${cur.x},${cur.y}`, 'U');
      for (let i = 1; i < distance; i++) {
        addToGrid(cur.x, cur.y + i, '|');
      }
      cur = { x: cur.x, y: cur.y + distance };
      corners2.set(`${cur.x},${cur.y}`, 'D');
      maxY = Math.max(maxY, cur.y);
      break;
    case 'D':
      corners1.set(`${cur.x},${cur.y}`, 'D');
      for (let i = 1; i < distance; i++) {
        addToGrid(cur.x, cur.y - i, '|');
      }
      cur = { x: cur.x, y: cur.y - distance };
      corners2.set(`${cur.x},${cur.y}`, 'U');
      minY = Math.min(minY, cur.y);
      break;
  }
}
for (const [corner, dir] of corners1) {
  const [x, y] = corner.split(',').map(Number);
  const dir2 = corners2.get(corner)!;
  const pair = `${dir}${dir2}`;
  if (pair === 'UL' || pair === 'LU') {
    addToGrid(x, y, 'J');
  } else if (pair === 'UR' || pair === 'RU') {
    addToGrid(x, y, 'L');
  } else if (pair === 'DL' || pair === 'LD') {
    addToGrid(x, y, '7');
  } else if (pair === 'DR' || pair === 'RD') {
    addToGrid(x, y, 'F');
  } else {
    throw new Error('unreachable');
  }
}
let memo = new Map<string, number>();
let count = 0;
for (const row of gridSparseYFirst.values()) {
  const sorted = [...row.entries()].sort(([x1], [x2]) => x1 - x2);
  const memoKey = sorted.map(([i, c]) => i + ',' + c).join(',');
  if (memo.has(memoKey)) {
    count += memo.get(memoKey)!;
    continue;
  }
  let state = {
    lastIndex: -1,
    last: undefined as 'L' | 'F' | undefined,
    inside: false,
  };
  let insideCount = 0;
  for (const [i, c] of sorted) {
    switch (c) {
      case '|':
        if (state.last) {
          throw new Error('bad');
        }
        insideCount += state.inside ? i - state.lastIndex : 1;
        state.inside = !state.inside;
        break;
      case 'F':
      case 'L':
        if (state.last) {
          throw new Error('bad');
        }
        state.last = c;
        insideCount += state.inside ? i - state.lastIndex : 1;
        break;

      case '7':
        if (!state.last) {
          throw new Error('bad');
        }
        if (state.last === 'L') {
          state.inside = !state.inside;
        }
        state.last = undefined;
        insideCount += i - state.lastIndex;
        break;

      case 'J':
        if (!state.last) {
          throw new Error('bad');
        }
        if (state.last === 'F') {
          state.inside = !state.inside;
        }
        state.last = undefined;
        insideCount += i - state.lastIndex;
        break;

      default:
        throw new Error('bad');
    }
    state.lastIndex = i;
  }
  memo.set(memoKey, insideCount);
  count += insideCount;
}
console.log(count);
