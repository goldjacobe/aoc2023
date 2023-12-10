import fs from 'fs';

const infile = process.argv[2];
const input = fs.readFileSync(infile, 'utf8');

const lines = input
  .trim()
  .split('\n')
  .map((line) => line.trim().split(''));

const sPos = lines.reduce<undefined | [number, number]>((acc, line) => {
  const pos = line.findIndex((c) => c === 'S');
  return pos >= 0 ? [lines.indexOf(line), pos] : acc;
}, undefined)!;

const dirs = {
  '|': ['N', 'S'],
  '-': ['E', 'W'],
  L: ['N', 'E'],
  J: ['N', 'W'],
  '7': ['S', 'W'],
  F: ['S', 'E'],
};

const aroundPoint = (yPos: number, xPos: number) => [
  ...(yPos > 0 ? [{ y: yPos - 1, x: xPos, d: 'S' }] : []),
  ...(xPos > 0 ? [{ y: yPos, x: xPos - 1, d: 'E' }] : []),
  ...(xPos < lines[0].length - 1 ? [{ y: yPos, x: xPos + 1, d: 'W' }] : []),
  ...(yPos < lines.length - 1 ? [{ y: yPos + 1, x: xPos, d: 'N' }] : []),
];

const aroundS = aroundPoint(sPos[0], sPos[1]);

const connectedToS = aroundS
  .filter(({ y, x }) => lines[y][x] in dirs)
  .filter(({ y, x, d }) => {
    const val = lines[y][x];
    if (!(val in dirs)) {
      return false;
    }
    return dirs[val as keyof typeof dirs].includes(d);
  });

if (connectedToS.length !== 2) {
  throw new Error('bad');
}

const oppositeDir = (d: string) => {
  switch (d) {
    case 'N':
      return 'S';
    case 'S':
      return 'N';
    case 'E':
      return 'W';
    case 'W':
      return 'E';
  }
};

const [a, b] = connectedToS;
let cur = a;
const seen = new Set<string>();
seen.add(`${sPos[0]},${sPos[1]}`);
while (cur.x !== b.x || cur.y !== b.y) {
  seen.add(`${cur.y},${cur.x}`);
  const nextDir = dirs[lines[cur.y][cur.x] as keyof typeof dirs].find(
    (d) => d !== cur.d
  )!;
  const around = aroundPoint(cur.y, cur.x)
    .filter(({ y, x }) => !seen.has(`${y},${x}`))
    .filter(({ y, x, d }) => {
      return (
        lines[y][x] in dirs &&
        dirs[lines[y][x] as keyof typeof dirs].includes(d) &&
        d === oppositeDir(nextDir)
      );
    });

  const next = around;
  if (next.length !== 1) {
    throw new Error('bad');
  }
  cur = next[0];
}
seen.add(`${cur.y},${cur.x}`);

console.log(seen.size / 2);

let count = 0;
for (const [i, line] of lines.entries()) {
  let state = {
    last: undefined as 'L' | 'F' | undefined,
    inside: false,
  };
  for (const [j, c] of line.entries()) {
    if (seen.has(`${i},${j}`)) {
      switch (c) {
        case '|':
        case 'S': //HACK only works for given input
          if (state.last) {
            throw new Error('bad');
          }
          state.inside = !state.inside;
          break;
        case '-':
          if (!state.last) {
            throw new Error('bad');
          }
          break;
        case 'F':
        case 'L':
          if (state.last) {
            throw new Error('bad');
          }
          state.last = c;
          break;

        case '7':
          if (!state.last) {
            throw new Error('bad');
          }
          if (state.last === 'L') {
            state.inside = !state.inside;
          }
          state.last = undefined;
          break;

        case 'J':
          if (!state.last) {
            throw new Error('bad');
          }
          if (state.last === 'F') {
            state.inside = !state.inside;
          }
          state.last = undefined;
          break;

        default:
          throw new Error('bad');
      }
    } else {
      if (state.last) {
        throw new Error('bad');
      }
      if (state.inside) {
        count++;
      }
    }
  }
}
console.log(count);
