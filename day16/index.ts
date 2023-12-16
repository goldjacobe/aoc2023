import fs from 'fs';

const infile = process.argv[2];
const input = fs.readFileSync(infile, 'utf8').trim().split('\n');

const map = input.map((line) => line.split(''));

console.log(calculateEnergized({ x: 0, y: 0, d: 'E' }));

const startingPoints = [
  map[0].map((_, i) => ({ x: i, y: 0, d: 'S' })),
  map[map.length - 1].map((_, i) => ({ x: i, y: map.length - 1, d: 'N' })),
  map.map((_, i) => ({ x: 0, y: i, d: 'E' })),
  map.map((_, i) => ({ x: map[0].length - 1, y: i, d: 'W' })),
].flat();

console.log(
  startingPoints.map(calculateEnergized).reduce((a, b) => Math.max(a, b), 0)
);

function calculateEnergized(initial: { x: number; y: number; d: string }) {
  const energized = map.map((row) => row.map(() => '.'));
  const seen = new Set();
  let beams = [initial];
  while (beams.length) {
    beams.forEach((beam) => {
      seen.add(`${beam.x},${beam.y},${beam.d}`);
    });
    beams = beams
      .map((beam) => {
        const nexts = {
          E: { x: beam.x + 1, y: beam.y, d: 'E' },
          W: { x: beam.x - 1, y: beam.y, d: 'W' },
          N: { x: beam.x, y: beam.y - 1, d: 'N' },
          S: { x: beam.x, y: beam.y + 1, d: 'S' },
        };
        if (map[beam.y][beam.x] === '.') {
          energized[beam.y][beam.x] = '#';
          switch (beam.d) {
            case 'E':
              return [nexts.E];
            case 'W':
              return [nexts.W];
            case 'N':
              return [nexts.N];
            case 'S':
              return [nexts.S];
          }
          throw new Error('bad direction');
        }

        if (map[beam.y][beam.x] === '/') {
          energized[beam.y][beam.x] = '#';
          switch (beam.d) {
            case 'E':
              return [nexts.N];
            case 'W':
              return [nexts.S];
            case 'N':
              return [nexts.E];
            case 'S':
              return [nexts.W];
          }
          throw new Error('bad direction');
        }

        if (map[beam.y][beam.x] === '\\') {
          energized[beam.y][beam.x] = '#';
          switch (beam.d) {
            case 'E':
              return [nexts.S];
            case 'W':
              return [nexts.N];
            case 'N':
              return [nexts.W];
            case 'S':
              return [nexts.E];
          }
          throw new Error('bad direction');
        }

        if (map[beam.y][beam.x] === '-') {
          energized[beam.y][beam.x] = '#';
          switch (beam.d) {
            case 'E':
              return [nexts.E];
            case 'W':
              return [nexts.W];
            case 'N':
            case 'S':
              return [nexts.W, nexts.E];
          }
          throw new Error('bad direction');
        }

        if (map[beam.y][beam.x] === '|') {
          energized[beam.y][beam.x] = '#';
          switch (beam.d) {
            case 'N':
              return [nexts.N];
            case 'S':
              return [nexts.S];
            case 'W':
            case 'E':
              return [nexts.N, nexts.S];
          }
          throw new Error('bad direction');
        }

        throw new Error('bad map');
      })
      .flat()
      .filter(
        (beam) =>
          beam &&
          beam.x >= 0 &&
          beam.y >= 0 &&
          beam.x < map[0].length &&
          beam.y < map.length &&
          !seen.has(`${beam.x},${beam.y},${beam.d}`)
      );
  }

  return energized.reduce(
    (sum, row) => sum + row.filter((c) => c === '#').length,
    0
  );
}
