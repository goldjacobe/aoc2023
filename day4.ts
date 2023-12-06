import fs from 'fs';

const useExample = false;
const input = fs.readFileSync(
  useExample ? 'day4ex.txt' : 'day4input.txt',
  'utf8'
);

const lines = input.trim().split('\n');

let part1 = 0;
let part2 = 0;
const extras = new Map<number, number>();

for (const [idx, line] of lines.entries()) {
  const trim = line.split(':')[1].trim().split('|');
  const winning = trim[0]
    .trim()
    .split(' ')
    .filter((w) => w !== '');
  const mine = trim[1]
    .trim()
    .split(' ')
    .filter((w) => w !== '');

  const mineNoDup = [...new Set(mine)];

  const matches = mineNoDup.filter((m) => winning.includes(m)).length;
  const dupes = 1 + (extras.get(idx)! ?? 0);
  part2 += dupes;
  if (matches === 0) continue;
  part1 += 2 ** (matches - 1);
  for (let i = idx + 1; i < lines.length && i <= idx + matches; i++) {
    if (extras.has(i)) {
      extras.set(i, extras.get(i)! + dupes);
    } else {
      extras.set(i, dupes);
    }
  }
}

console.log({ part1, part2 });
