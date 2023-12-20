import fs from 'fs';

const infile = process.argv[2];
const lines = fs.readFileSync(infile, 'utf8').trim().split('\n');

console.log(lines);
const inputsForCons = new Map<string, Map<string, boolean>>();
const modules = lines.map((line) => {
  const [name, result] = line.split(' -> ');
  const dests = result.split(', ');
  if (name === 'broadcaster') {
    return { type: 'broadcaster', name, dests };
  }
  return { type: name.charAt(0) as '%' | '&', name: name.slice(1), dests };
});
modules.forEach((m) => {
  if (m.type === '&') {
    inputsForCons.set(m.name, new Map<string, boolean>());
  }
});
modules.forEach((m) => {
  m.dests.forEach((d) => {
    if (inputsForCons.has(d)) {
      inputsForCons.get(d)!.set(m.name, false);
    }
  });
});

const states = new Map<string, boolean>();
function processPulse({
  name,
  type,
  from,
}: {
  name: string;
  type: 'low' | 'high';
  from: string;
}) {
  if (name === 'broadcaster') {
    return modules
      .find((m) => m.name === 'broadcaster')!
      .dests.map((d) => ({ name: d, type, from: name }));
  }
  const module = modules.find((m) => m.name === name);
  if (!module) {
    return [];
  }
  if (module.type === '%') {
    const on = states.get(name) ?? false;
    if (type === 'high') {
      return [];
    }
    states.set(name, !on);
    return module.dests.map((d) => ({
      name: d,
      type: !on ? ('high' as const) : ('low' as const),
      from: name,
    }));
  }
  if (module.type !== '&') {
    throw new Error(`Unknown module type ${module.type}`);
  }
  const mem = inputsForCons.get(name)!;
  mem.set(from, type === 'high');
  const sendtype =
    [...mem.values()].every((v) => v) ? ('low' as const) : ('high' as const);
  return module.dests.map((d) => ({ name: d, type: sendtype, from: name }));
}

const nodesWithRgInOuput = modules
  .filter((m) => m.dests.includes('rg'))
  .map((m) => m.name);
console.log(nodesWithRgInOuput);

let numbersToLcm = [];
let numHigh = 0;
let numLow = 0;
for (let i = 1; i < 5000; i++) {
  const pulsesToProcess = [
    { name: 'broadcaster', type: 'low', from: 'button' },
  ] as { name: string; from: string; type: 'low' | 'high' }[];
  while (pulsesToProcess.length > 0) {
    const pulse = pulsesToProcess.shift()!;
    if (pulse.type === 'high') {
      numHigh++;
    } else {
      numLow++;
    }
    const pulses = processPulse(pulse);
    if (pulse.name === 'rg' && pulse.type === 'high') {
      numbersToLcm.push(i);
      if (numbersToLcm.length === nodesWithRgInOuput.length) {
        console.log(numbersToLcm.reduce(lcm));
      }
    }
    pulsesToProcess.push(...pulses);
  }
}

function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
}

function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}
