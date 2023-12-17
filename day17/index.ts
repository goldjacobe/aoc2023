import fs from 'fs';

const infile = process.argv[2];
const lines = fs.readFileSync(infile, 'utf8').trim().split('\n');

const map = lines.map((line) => line.split('').map((c) => +c));

function move(x: number, y: number, d: number): { x: number; y: number } {
  switch (d) {
    case 0:
      return { x, y: y - 1 };
    case 1:
      return { x: x + 1, y };
    case 2:
      return { x, y: y + 1 };
    case 3:
      return { x: x - 1, y };
  }
  throw Error('nope');
}

function opposite(d: number): number {
  return (d + 2) % 4;
}

const minLoss = map.map((row) =>
  row.map(() =>
    [Infinity, Infinity, Infinity, Infinity].map(() => [
      Infinity,
      Infinity,
      Infinity,
      Infinity,
      Infinity,
      Infinity,
      Infinity,
      Infinity,
      Infinity,
      Infinity,
      Infinity,
    ])
  )
);
minLoss[0][0][1][0] = 0;
const visited = map.map((row) =>
  row.map(() =>
    [Infinity, Infinity, Infinity, Infinity].map(() => [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ])
  )
);
const toProcess = new Set<string>();
toProcess.add('0,0,1,0');
while (toProcess.size) {
  const next = [...toProcess].reduce<{
    value: number;
    x: number;
    y: number;
    d: number;
    s: number;
  }>(
    (acc, cur) => {
      const [x, y, d, s] = cur.split(',').map((c) => +c);
      if (visited[y][x][d][s]) return acc;
      const minCurr = minLoss[y][x][d][s];
      if (acc.value < minCurr) return acc;
      return { value: minCurr, x, y, s, d };
    },
    { value: Infinity, x: -1, y: -1, s: -1, d: -1 }
  );

  if (next.value === Infinity) {
    break;
  }
  console.log(next);
  if (next.x === map[0].length - 1 && next.y === map.length - 1) {
    console.log(next.value);

    break;
  }

  // visitPoint(next);
  visitPoint2(next);
}

function visitPoint({
  x,
  y,
  d,
  s,
}: {
  x: number;
  y: number;
  d: number;
  s: number;
}) {
  const minLossCur = minLoss[y][x][d][s];
  for (const nextD of [0, 1, 2, 3]) {
    if (nextD === opposite(d)) continue;
    if (nextD === d && s === 3) continue;
    const n = move(x, y, nextD);
    const nextS = nextD === d ? s + 1 : 1;
    if (
      n.x < 0 ||
      n.y < 0 ||
      n.x >= map[0].length ||
      n.y >= map.length ||
      visited[n.y][n.x][nextD][nextS]
    ) {
      continue;
    }
    minLoss[n.y][n.x][nextD][nextS] = Math.min(
      minLoss[n.y][n.x][nextD][nextS],
      minLossCur + map[n.y][n.x]
    );
    toProcess.add(`${n.x},${n.y},${nextD},${nextS}`);
  }
  visited[y][x][d][s] = true;
  toProcess.delete(`${x},${y},${d},${s}`);
}

function visitPoint2({
  x,
  y,
  d,
  s,
}: {
  x: number;
  y: number;
  d: number;
  s: number;
}) {
  const minLossCur = minLoss[y][x][d][s];
  for (const nextD of [0, 1, 2, 3]) {
    if (nextD === opposite(d)) continue;
    if (nextD != d && s <= 3) continue;
    if (nextD === d && s === 10) continue;
    const n = move(x, y, nextD);
    const nextS = nextD === d ? s + 1 : 1;
    if (
      n.x < 0 ||
      n.y < 0 ||
      n.x >= map[0].length ||
      n.y >= map.length ||
      visited[n.y][n.x][nextD][nextS]
    ) {
      continue;
    }
    minLoss[n.y][n.x][nextD][nextS] = Math.min(
      minLoss[n.y][n.x][nextD][nextS],
      minLossCur + map[n.y][n.x]
    );
    toProcess.add(`${n.x},${n.y},${nextD},${nextS}`);
  }
  visited[y][x][d][s] = true;
  toProcess.delete(`${x},${y},${d},${s}`);
}
