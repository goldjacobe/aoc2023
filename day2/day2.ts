// The Elf would first like to know which games would have been possible if
// the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes?

import fs from 'fs';

// const input = fs.readFileSync("day2ex.txt", "utf8");
const input = fs.readFileSync('day2input.txt', 'utf8');
let sum = 0;
for (const line of input.trim().split('\n')) {
  const id = line.split(' ')[1].split(':')[0];
  const entries = line.split(':')[1].split(';');

  if (
    entries.every((entry) => {
      const sets = entry.split(',');
      let red = 0;
      let green = 0;
      let blue = 0;
      for (const set of sets) {
        const num = parseInt(set.split(' ')[1]);
        const color = set.split(' ')[2];
        if (color === 'red') {
          red += num;
        } else if (color === 'green') {
          green += num;
        } else if (color === 'blue') {
          blue += num;
        }
      }
      return red <= 12 && green <= 13 && blue <= 14;
    })
  ) {
    sum += +id;
  }
}
console.log(sum);

let sumPowers = 0;
for (const line of input.trim().split('\n')) {
  const entries = line.split(':')[1].split(';');
  let maxRed = 0;
  let maxGreen = 0;
  let maxBlue = 0;
  for (const entry of entries) {
    const sets = entry.split(',');
    let red = 0;
    let green = 0;
    let blue = 0;
    for (const set of sets) {
      const num = parseInt(set.split(' ')[1]);
      const color = set.split(' ')[2];
      if (color === 'red') {
        red += num;
      } else if (color === 'green') {
        green += num;
      } else if (color === 'blue') {
        blue += num;
      }
    }

    if (red > maxRed) {
      maxRed = red;
    }
    if (green > maxGreen) {
      maxGreen = green;
    }
    if (blue > maxBlue) {
      maxBlue = blue;
    }
  }
  sumPowers += maxRed * maxGreen * maxBlue;
}
console.log(sumPowers);
