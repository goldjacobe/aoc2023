import fs from 'fs';

const infile = process.argv[2];
const map = fs
  .readFileSync(infile, 'utf8')
  .trim()
  .split('\n')
  .map((line) => line.split(''));

function neighbors({ row, col }: { row: number; col: number }) {
  return [
    ...(row > 0 ? [{ dir: '^', row: row - 1, col }] : []),
    ...(row < map.length - 1 ? [{ dir: 'v', row: row + 1, col }] : []),
    ...(col > 0 ? [{ dir: '<', row, col: col - 1 }] : []),
    ...(col < map[0].length - 1 ? [{ dir: '>', row, col: col + 1 }] : []),
  ];
}

function getKey({ row, col }: { row: number; col: number }) {
  return `${row},${col}`;
}

const PART = 2 as 1 | 2;

const startCol = map[0].indexOf('.');
const endCol = map[map.length - 1].indexOf('.');
const startKey = getKey({ row: 0, col: startCol });
const endKey = getKey({ row: map.length - 1, col: endCol });

const poi = new Map<string, { row: number; col: number }[]>();
for (const [row, line] of map.entries()) {
  for (const [col, char] of line.entries()) {
    const pathNeighbors = neighbors({ row, col }).filter(
      ({ row, col }) => map[row][col] !== '#'
    );
    if (char !== '#' && pathNeighbors.length > 2) {
      if (char !== '.') {
        console.log(char, row, col);
        console.log(pathNeighbors);
        throw Error('bad char');
      }
      poi.set(
        getKey({ row, col }),
        PART === 1 ?
          pathNeighbors.filter(({ row, col, dir }) => dir === map[row][col])
        : pathNeighbors
      );
    }
  }
}

const edges = new Map<string, { next: string; dist: number }[]>();

let cur = { row: 0, col: startCol };
let prev = { row: 0, col: startCol };
let path = 0;
while (!poi.has(getKey(cur))) {
  const next = neighbors(cur).find(
    ({ row, col }) =>
      !(row === prev.row && col === prev.col) && map[row][col] !== '#'
  )!;
  prev = cur;
  cur = next;
  path++;
}

edges.set(startKey, [{ next: getKey(cur), dist: path }]);

for (const [key, poiNeighbors] of poi.entries()) {
  for (const neighbor of poiNeighbors) {
    path = 1;
    cur = neighbor;
    prev = {
      row: parseInt(key.split(',')[0]),
      col: parseInt(key.split(',')[1]),
    };
    while (
      !poi.has(getKey(cur)) &&
      getKey(cur) !== startKey &&
      getKey(cur) !== endKey
    ) {
      const next = neighbors(cur).find(
        ({ row, col }) =>
          !(row === prev.row && col === prev.col) && map[row][col] !== '#'
      );
      if (!next) {
        console.log(cur, neighbor, path);
        throw Error('missing');
      }
      prev = cur;
      cur = next;
      path++;
    }
    if (edges.has(key)) {
      edges.get(key)!.push({ next: getKey(cur), dist: path });
    } else {
      edges.set(key, [{ next: getKey(cur), dist: path }]);
    }
  }
}

let pathsToProcess = [
  { seen: new Set<string>([startKey]), cur: startKey, dist: 0 },
];

let maxDist = 0;
while (pathsToProcess.length) {
  const { seen, cur, dist } = pathsToProcess.shift()!;
  for (const { next, dist: nextDist } of edges.get(cur)!) {
    if (next === endKey) {
      maxDist = Math.max(maxDist, dist + nextDist);
      continue;
    }
    if (!seen.has(next)) {
      pathsToProcess.push({
        seen: new Set([...seen, next]),
        cur: next,
        dist: dist + nextDist,
      });
    }
  }
}

console.log(maxDist);
