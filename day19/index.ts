import fs from 'fs';

const infile = process.argv[2];
const lines = fs.readFileSync(infile, 'utf8').trim().split('\n');

const mid = lines.indexOf('');

const breakpoints = {
  x: [1],
  m: [1],
  a: [1],
  s: [1],
};

/*
	> 2
   < 5
1 2 3 4 5 6

1 2
3 4
56
*/

const instructions = Object.fromEntries(
  lines.slice(0, mid).map((line) => {
    const [name, rest] = line.split('{');
    const steps = rest
      .split('}')[0]
      .split(',')
      .map((step) => {
        const split = step.split(':');
        if (split.length > 2) throw new Error('Too many colons');
        if (split.length === 1) return { condition: null, result: step };
        const stepOut = {
          condition: {
            cat: split[0].charAt(0) as 'x' | 'm' | 'a' | 's',
            ineq: split[0].charAt(1) as '>' | '<',
            val: +split[0].slice(2),
          },
          result: split[1],
        };
        /* if (stepOut.condition.ineq === '>') {
          breakpoints[stepOut.condition.cat].push(stepOut.condition.val + 1);
        } else {
          breakpoints[stepOut.condition.cat].push(stepOut.condition.val);
        } */
        return stepOut;
      });
    return [name, steps];
  })
);
/* breakpoints.x.sort((a, b) => a - b);
breakpoints.m.sort((a, b) => a - b);
breakpoints.a.sort((a, b) => a - b);
breakpoints.s.sort((a, b) => a - b);
console.log('done sorting');
const lengths =
  breakpoints.x.length +
  ',' +
  breakpoints.m.length +
  ',' +
  breakpoints.a.length +
  ',' +
  breakpoints.s.length;
let numAccepted = 0;
for (let ix = 0; ix < breakpoints.x.length; ix++) {
  const numX =
    ix === breakpoints.x.length - 1 ?
      4001 - breakpoints.x[ix]
    : breakpoints.x[ix + 1] - breakpoints.x[ix];
  for (let im = 0; im < breakpoints.m.length; im++) {
    const numM =
      im === breakpoints.m.length - 1 ?
        4001 - breakpoints.m[im]
      : breakpoints.m[im + 1] - breakpoints.m[im];
    for (let ia = 0; ia < breakpoints.a.length; ia++) {
      const numA =
        ia === breakpoints.a.length - 1 ?
          4001 - breakpoints.a[ia]
        : breakpoints.a[ia + 1] - breakpoints.a[ia];
      for (let is = 0; is < breakpoints.s.length; is++) {
        const numS =
          is === breakpoints.s.length - 1 ?
            4001 - breakpoints.s[is]
          : breakpoints.s[is + 1] - breakpoints.s[is];
        console.log(ix, im, ia, is, lengths);
        const cur = {
          x: breakpoints.x[ix],
          m: breakpoints.m[im],
          a: breakpoints.a[ia],
          s: breakpoints.s[is],
          num: numX * numM * numA * numS,
        };
        let curState = 'in';
        while (true) {
          const inst = instructions[curState]!;
          for (const step of inst) {
            if (
              !step.condition ||
              !(step.condition.ineq === '>' ?
                cur[step.condition.cat as 'x' | 'm' | 'a' | 's']! <=
                step.condition.val
              : cur[step.condition.cat as 'x' | 'm' | 'a' | 's']! >=
                step.condition.val)
            ) {
              curState = step.result;
              break;
            }
          }
          if (curState === 'A') {
            numAccepted = numAccepted + cur.num;
            console.log('accepted', numAccepted);
            break;
          }
          if (curState === 'R') {
            console.log('rejected');
            break;
          }
        }
      }
    }
  }
}
console.log(numAccepted);
*/
console.log(
  recursivelySolve({
    xMin: 1,
    xMax: 4000,
    mMin: 1,
    mMax: 4000,
    aMin: 1,
    aMax: 4000,
    sMin: 1,
    sMax: 4000,
    key: 'in',
    step: 0,
  })
);

function recursivelySolve({
  xMin,
  xMax,
  mMin,
  mMax,
  aMin,
  aMax,
  sMin,
  sMax,
  key,
  step,
}: {
  xMin: number;
  xMax: number;
  mMin: number;
  mMax: number;
  aMin: number;
  aMax: number;
  sMin: number;
  sMax: number;
  key: string;
  step: number;
}): number {
  if (xMin >= xMax || mMin >= mMax || aMin >= aMax || sMin >= sMax) return 0;
  if (key === 'A') {
    return (
      (xMax - xMin + 1) *
      (mMax - mMin + 1) *
      (aMax - aMin + 1) *
      (sMax - sMin + 1)
    );
  } else if (key === 'R') {
    return 0;
  }

  const inst = instructions[key]![step];
  if (!inst) {
    throw new Error('no inst');
  }
  if (!inst.condition) {
    return recursivelySolve({
      xMin,
      xMax,
      mMin,
      mMax,
      aMin,
      aMax,
      sMin,
      sMax,
      key: inst.result,
      step: 0,
    });
  }
  switch (inst.condition.cat) {
    case 'x':
      if (inst.condition.ineq === '>') {
        return (
          recursivelySolve({
            xMin: Math.max(xMin, inst.condition.val + 1),
            xMax,
            mMin,
            mMax,
            aMin,
            aMax,
            sMin,
            sMax,
            key: inst.result,
            step: 0,
          }) +
          recursivelySolve({
            xMin,
            xMax: Math.min(xMax, inst.condition.val),
            mMin,
            mMax,
            aMin,
            aMax,
            sMin,
            sMax,
            key,
            step: step + 1,
          })
        );
      } else {
        return (
          recursivelySolve({
            xMin,
            xMax: Math.min(xMax, inst.condition.val - 1),
            mMin,
            mMax,
            aMin,
            aMax,
            sMin,
            sMax,
            key: inst.result,
            step: 0,
          }) +
          recursivelySolve({
            xMin: Math.max(xMin, inst.condition.val),
            xMax,
            mMin,
            mMax,
            aMin,
            aMax,
            sMin,
            sMax,
            key,
            step: step + 1,
          })
        );
      }
    case 'm':
      if (inst.condition.ineq === '>') {
        return (
          recursivelySolve({
            xMin,
            xMax,
            mMin: Math.max(mMin, inst.condition.val + 1),
            mMax,
            aMin,
            aMax,
            sMin,
            sMax,
            key: inst.result,
            step: 0,
          }) +
          recursivelySolve({
            xMin,
            xMax,
            mMin,
            mMax: Math.min(mMax, inst.condition.val),
            aMin,
            aMax,
            sMin,
            sMax,
            key,
            step: step + 1,
          })
        );
      } else {
        return (
          recursivelySolve({
            xMin,
            xMax,
            mMin,
            mMax: Math.min(mMax, inst.condition.val - 1),
            aMin,
            aMax,
            sMin,
            sMax,
            key: inst.result,
            step: 0,
          }) +
          recursivelySolve({
            xMin,
            xMax,
            mMin: Math.max(mMin, inst.condition.val),
            mMax,
            aMin,
            aMax,
            sMin,
            sMax,
            key,
            step: step + 1,
          })
        );
      }
    case 'a':
      if (inst.condition.ineq === '>') {
        return (
          recursivelySolve({
            aMin: Math.max(aMin, inst.condition.val + 1),
            aMax,
            mMin,
            mMax,
            xMin,
            xMax,
            sMin,
            sMax,
            key: inst.result,
            step: 0,
          }) +
          recursivelySolve({
            aMin,
            aMax: Math.min(aMax, inst.condition.val),
            mMin,
            mMax,
            xMin,
            xMax,
            sMin,
            sMax,
            key,
            step: step + 1,
          })
        );
      } else {
        return (
          recursivelySolve({
            aMin,
            aMax: Math.min(aMax, inst.condition.val - 1),
            mMin,
            mMax,
            xMin,
            xMax,
            sMin,
            sMax,
            key: inst.result,
            step: 0,
          }) +
          recursivelySolve({
            aMin: Math.max(aMin, inst.condition.val),
            aMax,
            mMin,
            mMax,
            xMin,
            xMax,
            sMin,
            sMax,
            key,
            step: step + 1,
          })
        );
      }
    case 's':
      if (inst.condition.ineq === '>') {
        return (
          recursivelySolve({
            mMin,
            mMax,
            sMin: Math.max(sMin, inst.condition.val + 1),
            sMax,
            aMin,
            aMax,
            xMin,
            xMax,
            key: inst.result,
            step: 0,
          }) +
          recursivelySolve({
            mMin,
            mMax,
            sMin,
            sMax: Math.min(sMax, inst.condition.val),
            aMin,
            aMax,
            xMin,
            xMax,
            key,
            step: step + 1,
          })
        );
      } else {
        return (
          recursivelySolve({
            mMin,
            mMax,
            sMin,
            sMax: Math.min(sMax, inst.condition.val - 1),
            aMin,
            aMax,
            xMin,
            xMax,
            key: inst.result,
            step: 0,
          }) +
          recursivelySolve({
            mMin,
            mMax,
            sMin: Math.max(sMin, inst.condition.val),
            sMax,
            aMin,
            aMax,
            xMin,
            xMax,
            key,
            step: step + 1,
          })
        );
      }
  }
}

//part1
/*
const parts = lines.slice(mid + 1).map((line) => {
  const noBraces = line.slice(1, -1);
  const cats = noBraces.split(',').map((cat) => cat.substring(2));
  if (cats.length !== 4) throw new Error('Wrong number of categories');
  return { x: +cats[0], m: +cats[1], a: +cats[2], s: +cats[3] };
});


const ratings = parts.map((part) => {
  let cur = 'in';
  while (true) {
    const inst = instructions[cur]!;
    for (const step of inst) {
      if (
        !step.condition ||
        !(step.condition.ineq === '>' ?
          part[step.condition.cat as 'x' | 'm' | 'a' | 's']! <
          step.condition.val
        : part[step.condition.cat as 'x' | 'm' | 'a' | 's']! >
          step.condition.val)
      ) {
        cur = step.result;
        break;
      }
    }
    if (cur === 'A') return part.x + part.m + part.a + part.s;
    if (cur === 'R') return 0;
  }
});

console.log(ratings.reduce((a, b) => a + b, 0)); */
