import fs from 'fs';

const infile = process.argv[2];
const lines = fs.readFileSync(infile, 'utf8').trim().split('\n');

const blocks = lines.map((line) => {
  const [start, end] = line.split('~');
  const scords = start.split(',');
  const ecords = end.split(',');

  let diff;
  for (diff = 0; diff < 3; diff++) {
    if (scords[diff] !== ecords[diff]) {
      break;
    }
  }
  if (diff === 3) {
    const coords = scords.map((x) => +x) as [number, number, number];
    return [coords];
  }

  const out = [];
  for (let c = +scords[diff]; c <= +ecords[diff]; c++) {
    const coords = [...scords].map((x) => +x) as [number, number, number];
    coords[diff] = c;
    out.push(coords);
  }

  return out;
});

function getLowestZ(block: [number, number, number][]): number {
  return block.reduce((acc, coords) => Math.min(acc, coords[2]), Infinity);
}

blocks.sort((a, b) => {
  return getLowestZ(a) - getLowestZ(b);
});

const finalBlocks = [];
const finalPositionsMap = new Map<string, number>();
const supporting = new Map<number, Set<number>>();
const supportedBy = new Map<number, Set<number>>();

for (const [i, block] of blocks.entries()) {
  const lowestZ = getLowestZ(block);
  const positions = block.filter((coords) => coords[2] === lowestZ);
  let supporters = new Set<number>();
  let z = lowestZ;
  for (; z > 0; z--) {
    for (let coords of positions) {
      const key = `${coords[0]},${coords[1]},${z - 1}`;
      if (finalPositionsMap.has(key)) {
        supporters.add(finalPositionsMap.get(key)!);
      }
    }
    if (supporters.size > 0) {
      break;
    }
  }
  const delta = lowestZ - z;
  finalBlocks.push({
    i,
    finalBlock: block.map(
      (coords) =>
        [coords[0], coords[1], coords[2] - delta] as [number, number, number]
    ),
  });
  block.forEach((coords) => {
    const key = `${coords[0]},${coords[1]},${coords[2] - delta}`;
    finalPositionsMap.set(key, i);
  });
  supportedBy.set(i, supporters);
  for (const supporter of supporters) {
    if (!supporting.has(supporter)) {
      supporting.set(supporter, new Set([i]));
    }
    supporting.get(supporter)!.add(i);
  }
}

const safeToRemove = blocks
  .map((_, i) => i)
  .filter((i) => {
    const atop = supporting.get(i);
    for (const a of atop ?? []) {
      if (supportedBy.get(a)!.size === 1) return false;
    }
    return true;
  });

console.log(safeToRemove.length);

finalBlocks.sort((a, b) => {
  return getLowestZ(a.finalBlock) - getLowestZ(b.finalBlock);
});

const finalBlockIndicesSorted = finalBlocks.map((b) => b.i);
const disintegrate = finalBlockIndicesSorted.map((i) => {
  const madeFall = new Set<number>();
  const toCheck = new Set(supporting.get(i));
  const seen = new Set(supporting.get(i));
  while (toCheck.size > 0) {
    const cur = finalBlockIndicesSorted.find((j) => toCheck.has(j))!;
    toCheck.delete(cur);
    const curSupportedBy = supportedBy.get(cur);
    if (!curSupportedBy || curSupportedBy.size === 0) continue;
    if ([...curSupportedBy].every((a) => a === i || madeFall.has(a))) {
      madeFall.add(cur);
      [...(supporting.get(cur) ?? [])]
        .filter((j) => !seen.has(j))
        .forEach((j) => {
          toCheck.add(j);
          seen.add(j);
        });
    }
  }
  return madeFall;
});
console.log(disintegrate.map((s) => s.size).reduce((a, b) => a + b, 0));
