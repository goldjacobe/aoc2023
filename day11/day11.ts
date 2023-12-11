import fs from 'fs';

const infile = process.argv[2];
const input = fs.readFileSync(infile, 'utf8');

const lines = input.trim().split('\n');

const emptyRows = [];
const emptyCols = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.split('').every((c) => c === '.')) {
    emptyRows.push(i);
  }
}
for (let i = 0; i < lines[0].length; i++) {
  if (lines.every((l) => l[i] === '.')) {
    emptyCols.push(i);
  }
}

const positions = [];
const positions2 = [];

for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[0].length; x++) {
    if (lines[y][x] === '#') {
      const rowsBefore = emptyRows.filter((r) => r < y).length;
      const colsBefore = emptyCols.filter((c) => c < x).length;
      positions.push({ x: x + colsBefore, y: y + rowsBefore });
      positions2.push({
        x: x + colsBefore * 999999,
        y: y + rowsBefore * 999999,
      });
    }
  }
}

let sum = 0;
let sum2 = 0;
for (let i = 0; i < positions.length; i++) {
  for (let j = i + 1; j < positions.length; j++) {
    const a = positions[i];
    const b = positions[j];
    const d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    sum += d;
    const a2 = positions2[i];
    const b2 = positions2[j];
    const d2 = Math.abs(a2.x - b2.x) + Math.abs(a2.y - b2.y);
    sum2 += d2;
  }
}
console.log(sum, sum2);
