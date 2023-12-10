import fs from 'fs';

const useExample = false;
const input = fs.readFileSync(
  useExample ? 'day8ex.txt' : 'day8input.txt',
  'utf8'
);

const lines = input.trim().split('\n');

const directions = lines[0].trim().split('');

const nodes = lines.slice(2).map((line) => {
  const [center, rest] = line.split(' = ');
  const left = rest.substring(1, 4);
  const right = rest.substring(6, 9);
  return { center, left, right };
});

const nodeMap = new Map<string, (typeof nodes)[number]>();
for (const node of nodes) {
  nodeMap.set(node.center, node);
}

let steps = 0;
let curNode = 'AAA';
while (curNode !== 'ZZZ') {
  const node = nodes.find((n) => n.center === curNode)!;
  const left =
    directions[steps % directions.length] === 'L' ? node.left : node.right;
  curNode = left;
  steps++;
}
console.log(steps);

steps = 0;
let current = nodes.filter(({ center }) => center.endsWith('A'));
const toGet = current.map(({}) => 0);
while (!toGet.every((v) => v > 0)) {
  const next = [];
  const dir = directions[steps % directions.length];
  for (const node of current) {
    const nextNode = dir === 'L' ? node.left : node.right;
    next.push(nodeMap.get(nextNode)!);
  }
  current = next;
  steps++;
  current.forEach(({ center }, i) => {
    if (center.endsWith('Z')) {
      toGet[i] = steps;
    }
  });
}

const gcd = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
};

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

console.log(toGet.reduce(lcm));
