import fs from 'fs';

const infile = process.argv[2];
const input = fs.readFileSync(infile, 'utf8').trim().split(',');

const hash = (v: string) => {
  return v.split('').reduce((acc, curr) => {
    return ((acc + curr.charCodeAt(0)) * 17) % 256;
  }, 0);
};
const values = input.map(hash);
console.log(values.reduce((acc, curr) => acc + curr, 0));

const boxes = new Map<number, string[]>();
for (let s of input) {
  const dash = s.indexOf('-');
  if (dash === -1) {
    const equals = s.indexOf('=');
    const toHash = s.slice(0, equals);
    const h = hash(toHash);
    if (boxes.has(h)) {
      const arr = boxes.get(h)!;
      const idx = arr.findIndex((v) => v.slice(0, dash) === s.slice(0, dash));
      if (idx !== -1) {
        arr[idx] = s;
      } else {
        boxes.get(h)!.push(s);
      }
    } else {
      boxes.set(h, [s]);
    }
    continue;
  }
  const h = hash(s.slice(0, dash));
  if (boxes.has(h)) {
    const arr = boxes.get(h)!;
    const idx = arr.findIndex((v) => v.slice(0, dash) === s.slice(0, dash));
    if (idx !== -1) {
      arr.splice(idx, 1);
    }
  }
}

console.log(
  [...boxes.entries()].reduce((acc, [h, arr]) => {
    return (
      acc +
      arr.reduce((acc2, s, i) => {
        return acc2 + (h + 1) * (i + 1) * +s.slice(s.indexOf('=') + 1);
      }, 0)
    );
  }, 0)
);
