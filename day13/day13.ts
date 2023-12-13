import fs from 'fs';

const infile = process.argv[2];
const input = fs.readFileSync(infile, 'utf8');

const lines = input.trim().split('\n');

const emptyLineIndexes = lines.reduce((acc, line, i) => {
  if (line === '') {
    acc.push(i);
  }
  return acc;
}, [] as number[]);

const maps = [-1, ...emptyLineIndexes].reduce((acc, emptyLineIndex, i) => {
  const map = lines.slice(emptyLineIndex + 1, emptyLineIndexes[i]);
  acc.push(map);
  return acc;
}, [] as string[][]);

function transposeMap(map: string[]) {
  const split = map.map((line) => line.split(''));
  const out = [];
  for (let i = 0; i < split[0].length; i++) {
    const row = [];
    for (let j = 0; j < split.length; j++) {
      row.push(split[j][i]);
    }
    out.push(row.join(''));
  }
  return out;
}

function findReflectionIndices(map: string[]) {
  const indices = [];
  for (let i = 1; i < map.length; i++) {
    let b = false;
    for (let j = 0; j < i; j++) {
      const k = 2 * i - j - 1;
      if (k > map.length - 1) {
        continue;
      }
      if (map[j] !== map[k]) {
        b = true;
        break;
      }
    }
    if (b) continue;
    indices.push(i);
  }
  return indices;
}

function findReflectionIndexWithSmudge(map: string[]) {
  for (let i = 1; i < map.length; i++) {
    let b = false;
    let hasUsedSmudge = false;
    for (let j = 0; j < i; j++) {
      const k = 2 * i - j - 1;
      if (k > map.length - 1) {
        continue;
      }
      if (map[j] !== map[k]) {
        if (hasUsedSmudge) {
          b = true;
          break;
        }
        if (stringsSameExceptOneChar(map[j], map[k])) {
          hasUsedSmudge = true;
        } else {
          b = true;
          break;
        }
      }
    }
    if (b) continue;
    if (!hasUsedSmudge) continue;
    return i;
  }
  return 0;
}

function stringsSameExceptOneChar(a: string, b: string) {
  let diff = false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (diff) return false;
      diff = true;
    }
  }
  return diff;
}

const results = maps.map((map) => {
  const horizontalReflectionIndices = findReflectionIndices(map);
  const verticalReflectionIndices = findReflectionIndices(transposeMap(map));
  return (
    horizontalReflectionIndices.reduce((acc, x) => acc + x * 100, 0) +
    verticalReflectionIndices.reduce((acc, x) => acc + x, 0)
  );
});
console.log(results.reduce((acc, x) => acc + x, 0));

console.log(
  maps
    .map(
      (map) =>
        findReflectionIndexWithSmudge(map) * 100 +
        findReflectionIndexWithSmudge(transposeMap(map))
    )
    .reduce((acc, x) => acc + x, 0)
);
