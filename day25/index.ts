import fs from 'fs';

const infile = process.argv[2];
const input = fs.readFileSync(infile, 'utf8').trim().split('\n');

const edges = new Map<string, string[]>();
for (const line of input) {
  const [from, toAll] = line.split(':');
  const toList = toAll.trim().split(' ');
  for (const to of toList) {
    if (edges.has(from)) {
      edges.get(from)!.push(to);
    } else {
      edges.set(from, [to]);
    }
    if (edges.has(to)) {
      edges.get(to)!.push(from);
    } else {
      edges.set(to, [from]);
    }
  }
}

// from python
// G.remove_edge('lms', 'tmc')
// G.remove_edge('nhg', 'jjn')
// G.remove_edge('xnn', 'txf')
edges.get('lms')!.splice(edges.get('lms')!.indexOf('tmc'), 1);
edges.get('tmc')!.splice(edges.get('tmc')!.indexOf('lms'), 1);
edges.get('nhg')!.splice(edges.get('nhg')!.indexOf('jjn'), 1);
edges.get('jjn')!.splice(edges.get('jjn')!.indexOf('nhg'), 1);
edges.get('xnn')!.splice(edges.get('xnn')!.indexOf('txf'), 1);
edges.get('txf')!.splice(edges.get('txf')!.indexOf('xnn'), 1);

const sizes = ['bpb', 'plb'].map((start) => {
  const seen = new Set<string>();
  const queue = [start];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (seen.has(current)) {
      continue;
    }
    seen.add(current);
    for (const next of edges.get(current)!) {
      queue.push(next);
    }
  }
  return seen.size;
});
console.log(sizes.reduce((a, b) => a * b, 1));
