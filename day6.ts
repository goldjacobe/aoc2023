/* const races = [
	{ time: 7, distance: 9 },
	{ time: 15, distance: 40 },
	{ time: 30, distance: 200 },
]; */
const races = [
  { time: 50, distance: 242 },
  { time: 74, distance: 1017 },
  { time: 86, distance: 1691 },
  { time: 85, distance: 1252 },
];

const results = races.map(({ time, distance }) => {
  let i = 0;
  let d = 0;
  while (d <= distance) {
    d = i * (time - i);
    console.log(i, d);
    i++;
  }
  return time - 2 * (i - 1) + 1;
});
console.log(results.reduce((a, b) => a * b, 1));

const total = races.reduce(
  (acc, { time, distance }) => {
    return {
      time: '' + acc.time + time,
      distance: '' + acc.distance + distance,
    };
  },
  { time: '', distance: '' }
);
const actual = { time: +total.time, distance: +total.distance };

let i = 0;
let d = 0;
while (d <= actual.distance) {
  d = i * (actual.time - i);
  console.log(i, d);
  i++;
}
console.log(actual.time - 2 * (i - 1) + 1);

const time = 50748685;
const distance = 242101716911252;

const a = -1;
const b = time;
const c = -distance + 1;
const sqrt = Math.sqrt(b * b - 4 * a * c);
const x1 = (-b + sqrt) / (2 * a);
const x2 = (-b - sqrt) / (2 * a);

console.log(Math.floor(x2) - Math.ceil(x1) + 1);
