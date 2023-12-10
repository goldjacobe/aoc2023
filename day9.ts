import fs from 'fs';

const infile = process.argv[2];
const input = fs.readFileSync(infile, 'utf8');

const lines = input.trim().split('\n');

console.log(lines);

const values = lines.map((line) => {
  const numbers = line.split(/\s+/).map((s) => parseInt(s));
  const history = [];
  let current = numbers;
  while (!current.every((n) => n === 0)) {
    const next = current.slice(1).map((n, i) => {
      const prev = current[i];
      const next = n - prev;
      return next;
    });
    history.push(current);
    current = next;
  }

  return history.reduce((acc, curr) => curr.pop()! + acc, 0);
});

console.log(values.reduce((acc, curr) => acc + curr, 0));

const values2 = lines.map((line) => {
  const numbers = line.split(/\s+/).map((s) => parseInt(s));
  const history = [];
  let current = numbers;
  while (!current.every((n) => n === 0)) {
    const next = current.slice(1).map((n, i) => {
      const prev = current[i];
      const next = n - prev;
      return next;
    });
    history.push(current);
    current = next;
  }
  console.log(history);
  return history.toReversed().reduce((acc, curr) => {
    console.log(acc);
    return curr[0] - acc;
  }, 0);
});

console.log(values2);

console.log(values2.reduce((acc, curr) => acc + curr, 0));
