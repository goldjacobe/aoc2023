import fs from 'fs';

const infile = process.argv[2];
const input = fs.readFileSync(infile, 'utf8');

const lines = input
  .trim()
  .split('\n')
  .map((line) => line.split(''));

function rotate90Clockwise(map: string[][]) {
  const out = [];
  for (let i = 0; i < map[0].length; i++) {
    const row = [];
    for (let j = map.length - 1; j >= 0; j--) {
      row.push(map[j][i]);
    }
    out.push(row);
  }
  return out;
}

const transpose = (matrix: string[][]) =>
  rotate90Clockwise(rotate90Clockwise(rotate90Clockwise(matrix)));

function roll(map: string[][]) {
  return map.map((line) => {
    let curAllowedPos = 0;
    const newOPoses = line.reduce((acc, c, i) => {
      if (c === '.') {
        return acc;
      }
      if (c === '#') {
        curAllowedPos = i + 1;
        return acc;
      }
      acc.push(curAllowedPos++);
      return acc;
    }, [] as number[]);
    return line.map((c, i) => {
      if (c === '#') {
        return c;
      }
      if (newOPoses.includes(i)) {
        return 'O';
      }
      return '.';
    });
  });
}

function score(map: string[][]) {
  return map.reduce((acc, line) => {
    return (
      acc +
      line.reduce((acc, c, i) => {
        if (c === 'O') {
          return acc + line.length - i;
        }
        return acc;
      }, 0)
    );
  }, 0);
}

console.log(score(roll(transpose(lines))));

let cur = transpose(lines);
const start = cur.map((line) => line.join('')).join('\n');
const m = new Map<string, number>();
m.set(start, -1);
const v = new Map<number, number>();
let repeat: number | undefined = undefined;
let repeatStart: number | undefined = undefined;
let i = 0;
while (!repeat) {
  i++;
  cur = roll(cur);
  cur = rotate90Clockwise(cur);
  cur = roll(cur);
  cur = rotate90Clockwise(cur);
  cur = roll(cur);
  cur = rotate90Clockwise(cur);
  cur = roll(cur);
  cur = rotate90Clockwise(cur);
  v.set(i, score(cur));
  const str = cur.map((line) => line.join('')).join('\n');
  if (m.has(str)) {
    repeatStart = m.get(str)!;
    repeat = i - m.get(str)!;
  } else {
    m.set(str, i);
  }
}
let numCycles = 1000000000 % repeat;
while (numCycles < repeatStart!) {
  numCycles += repeat;
}
console.log(v.get(numCycles));
