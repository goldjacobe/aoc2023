import fs from 'fs';

const infile = process.argv[2];
const input = fs.readFileSync(infile, 'utf8');

const lines = input.trim().split('\n');

function part1(line: string) {
  const [things, nums] = line.split(' ');
  const numsArr = nums.split(',').map((n) => parseInt(n, 10));
  const qPoses = things
    .split('')
    .map((c, i) => (c === '?' ? i : -1))
    .filter((i) => i !== -1);
  const possibilities = [];
  for (let i = 0; i < 2 ** qPoses.length; i++) {
    let possibility = things.slice().split('');
    for (let j = 0; j < qPoses.length; j++) {
      const qPos = qPoses[j];
      const isBroken = (i & (1 << j)) == 0;
      possibility[qPos] = isBroken ? '#' : '.';
    }
    possibilities.push(possibility);
  }
  return possibilities.filter((p) => satisfies(p, numsArr)).length;
}

function satisfies(possibility: string[], nums: number[]) {
  let toSatisfy = nums.slice();
  let last = '.';
  let cons = 0;
  for (let c of possibility) {
    if (c === '.' && last === '.') {
      continue;
    } else if (c === '.' && last === '#') {
      if (cons === toSatisfy[0]) {
        toSatisfy.shift();
      } else {
        return false;
      }
      cons = 0;
      last = '.';
    } else if (c === '#' && last === '.') {
      if (toSatisfy.length === 0) {
        return false;
      }
      last = '#';
      cons = 1;
    } else {
      cons++;
    }
  }
  if (last === '#' && cons === toSatisfy[0]) {
    toSatisfy.shift();
  }
  if (toSatisfy.length === 0) {
    return true;
  }
}

console.log(lines.reduce((sum, line) => sum + part2(line), 0));
function part2(line: string) {
  const [things, nums] = line.split(' ');
  const thingsArrShort = things.split('');
  const thingsArr = [
    thingsArrShort,
    '?',
    thingsArrShort,
    '?',
    thingsArrShort,
    '?',
    thingsArrShort,
    '?',
    thingsArrShort,
  ].flat();
  const numsArrShort = nums.split(',').map((n) => parseInt(n, 10));
  const numsArr = [
    numsArrShort,
    numsArrShort,
    numsArrShort,
    numsArrShort,
    numsArrShort,
  ].flat();

  let toCheck = [
    {
      remainingNums: numsArr,
      start: 0,
      seenBroken: 0,
      last: '.',
      times: 1,
    },
  ];
  let start = 0;
  let sum = 0;
  while (toCheck.length > 0) {
    let newToCheck = [];
    for (let possibility of toCheck) {
      let k = possibility.start;
      let last = possibility.last;
      let cur = thingsArr[k];
      let discard = false;
      while (cur !== '?' && k < thingsArr.length) {
        if (last === '.' && cur === '#') {
          if (possibility.remainingNums.length === 0) {
            discard = true;
            break;
          }
          possibility.seenBroken = 1;
        } else if (last === '#' && cur === '#') {
          possibility.seenBroken++;
        } else if (last === '#' && cur === '.') {
          if (possibility.seenBroken === possibility.remainingNums[0]) {
            possibility.remainingNums.shift();
            possibility.seenBroken = 0;
          } else {
            discard = true;
            break;
          }
        }
        last = cur;
        k++;
        cur = thingsArr[k];
      }
      if (discard) {
        continue;
      }
      if (k === thingsArr.length) {
        if (
          possibility.remainingNums.length === 0 ||
          (possibility.remainingNums.length === 1 &&
            possibility.remainingNums[0] === possibility.seenBroken)
        ) {
          sum += possibility.times;
        }
        continue;
      }
      // cur is a ?
      // last is either . or #

      if (last === '.') {
        newToCheck.push({
          remainingNums: possibility.remainingNums.slice(),
          start: k + 1,
          seenBroken: 0,
          last: '.',
          times: possibility.times,
        });

        if (possibility.remainingNums.length > 0) {
          newToCheck.push({
            remainingNums: possibility.remainingNums.slice(),
            start: k + 1,
            seenBroken: 1,
            last: '#',
            times: possibility.times,
          });
        }
      } else {
        if (possibility.seenBroken === possibility.remainingNums[0]) {
          newToCheck.push({
            remainingNums: possibility.remainingNums.slice(1),
            start: k + 1,
            seenBroken: 0,
            last: '.',
            times: possibility.times,
          });
        }
        if (
          possibility.remainingNums.length > 0 &&
          possibility.seenBroken < possibility.remainingNums[0]
        ) {
          newToCheck.push({
            remainingNums: possibility.remainingNums.slice(),
            start: k + 1,
            seenBroken: possibility.seenBroken + 1,
            last: '#',
            times: possibility.times,
          });
        }
      }
    }

    toCheck = [];
    const timesMap = new Map<string, number>();
    for (let possibility of newToCheck) {
      const key = `${possibility.remainingNums.join(',')}:${
        possibility.start
      }:${possibility.seenBroken}:${possibility.last}`;
      const curTimes = possibility.times;
      if (timesMap.has(key)) {
        timesMap.set(key, timesMap.get(key)! + curTimes);
      } else {
        timesMap.set(key, curTimes);
      }
    }
    for (let [key, times] of timesMap) {
      const [remainingNumsStr, startStr, seenBrokenStr, last] = key.split(':');
      const remainingNums =
        !remainingNumsStr ?
          []
        : remainingNumsStr.split(',').map((n) => parseInt(n));
      const start = parseInt(startStr);
      const seenBroken = parseInt(seenBrokenStr);
      toCheck.push({
        remainingNums,
        start,
        seenBroken,
        last,
        times,
      });
    }
  }
  return sum;
}
