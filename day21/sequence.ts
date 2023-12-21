let cur = 179936;
let delta = 88083;
let ddelta = 29338;
for (let i = 4; i <= 202300; i++) {
  delta += ddelta;
  cur += delta;
}
console.log(cur);
