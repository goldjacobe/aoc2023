import fs from 'fs';

const infile = process.argv[2];
const input = fs.readFileSync(infile, 'utf8').trim().split('\n');
const min = +process.argv[3];
const max = +process.argv[4];

console.log(input);

const stones = input.map((line) => {
  const [pos, vel] = line.split('@');
  const [x, y, z] = pos.split(',').map((n) => +n.trim());
  const [vx, vy, vz] = vel.split(',').map((n) => +n.trim());
  return { x, y, z, vx, vy, vz };
});

console.log(stones);
console.log(min, max);

type Stone = (typeof stones)[0];

function getLineEquation({ x, y, vx, vy }: Stone) {
  const m = vy / vx;
  const b = y - m * x;
  return { m, b };
}

function calculateRelevantIntersection(a: Stone, b: Stone) {
  const aLine = getLineEquation(a);
  const bLine = getLineEquation(b);
  if (aLine.m === bLine.m) {
    // parallel
    return undefined;
  }
  const x = (bLine.b - aLine.b) / (aLine.m - bLine.m);
  const y = aLine.m * x + aLine.b;
  if (x < min || x > max) {
    return undefined;
  }
  if (y < min || y > max) {
    return undefined;
  }
  const ta = (x - a.x) / a.vx;
  const tb = (x - b.x) / b.vx;
  if (ta < 0 || tb < 0) {
    // intersection is in the past
    return undefined;
  }

  return { x, y };
}

let intersections = 0;
for (let i = 0; i < stones.length; i++) {
  for (let j = i + 1; j < stones.length; j++) {
    const intersection = calculateRelevantIntersection(stones[i], stones[j]);
    intersections += intersection ? 1 : 0;
  }
}
console.log(intersections);
