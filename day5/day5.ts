import fs from 'fs';

const useExample = false;
const input = fs.readFileSync(
  useExample ? 'day5ex.txt' : 'day5input.txt',
  'utf8'
);

const lines = input.trim().split('\n');

const seeds = lines[0]
  .split(':')[1]
  .trim()
  .split(' ')
  .map((x) => parseInt(x));

const seedToSoilIndex = lines.findIndex((l) => l === 'seed-to-soil map:');
const soilToFertilizerIndex = lines.findIndex(
  (l) => l === 'soil-to-fertilizer map:'
);
const fertilizerToWaterIndex = lines.findIndex(
  (l) => l === 'fertilizer-to-water map:'
);
const waterToLightIndex = lines.findIndex((l) => l === 'water-to-light map:');
const lightToTemperatureIndex = lines.findIndex(
  (l) => l === 'light-to-temperature map:'
);
const temperatureToHumidityIndex = lines.findIndex(
  (l) => l === 'temperature-to-humidity map:'
);
const humidityToLocationIndex = lines.findIndex(
  (l) => l === 'humidity-to-location map:'
);

const mapIndices = [
  seedToSoilIndex,
  soilToFertilizerIndex,
  fertilizerToWaterIndex,
  waterToLightIndex,
  lightToTemperatureIndex,
  temperatureToHumidityIndex,
  humidityToLocationIndex,
];

const maps = mapIndices.map((index, i) => {
  const mapLines = [];
  const firstLine = index + 1;
  const end =
    i + 1 === mapIndices.length ? lines.length : mapIndices[i + 1] - 1;
  for (let lineNumber = firstLine; lineNumber < end; lineNumber++) {
    const line = lines[lineNumber];

    const [dest, src, len] = line.split(' ').map((x) => parseInt(x));
    mapLines.push({ dest, src, len });
  }

  return mapLines;
});

const locs = seeds.map((seed: number) => {
  return maps.reduce<number>((acc: number, map) => {
    const mapEntry = map.find(({ src, len }) => {
      return acc >= src && acc < src + len;
    });

    return mapEntry ? mapEntry.dest + acc - mapEntry.src : acc;
  }, seed);
});

console.log(Math.min(...locs));

const mapPivotLists = maps.map((map) =>
  [
    ...new Set(
      map
        .map(({ src, len }) => {
          return [src, src + len];
        })
        .flat()
    ),
  ]
    .sort((a, b) => a - b)
    .map((pivot) => {
      const entry = map.find((entry) => {
        return pivot === entry.src;
      });

      const delta = entry ? entry.dest - entry.src : 0;

      return { pivot, delta };
    })
);

let min = Number.MAX_SAFE_INTEGER;
for (let i = 0; i < seeds.length / 2; i++) {
  const start = seeds[2 * i];
  const len = seeds[2 * i + 1];

  const result = mapPivotLists.reduce<{ start: number; len: number }[]>(
    (acc: { start: number; len: number }[], mapPivots) => {
      const nextAcc: { start: number; len: number }[] = [];
      acc.forEach(({ start, len }) => {
        const startDelta =
          mapPivots.findLast(({ pivot }) => {
            return pivot <= start;
          })?.delta ?? 0;
        const pivotsInRange = mapPivots.filter(({ pivot }) => {
          return start < pivot && pivot < start + len;
        });
        if (pivotsInRange.length === 0) {
          nextAcc.push({ start: start + startDelta, len });
          return;
        }
        const starts = [
          start + startDelta,
          ...pivotsInRange.map(({ pivot, delta }) => pivot + delta),
        ];
        const lens = [
          pivotsInRange[0].pivot - start,
          ...pivotsInRange.map(
            (p, i) => (pivotsInRange[i + 1]?.pivot ?? start + len) - p.pivot
          ),
        ];
        starts.forEach((start, i) => {
          nextAcc.push({ start, len: lens[i] });
        });
      });
      return nextAcc;
    },
    [{ start, len }]
  );

  min = Math.min(min, ...result.map(({ start }) => start));
}

console.log(min);

/*
// slow version
const seeds2 = [];

for (let i = 0; i < seeds.length / 2; i++) {
	const start = seeds[2 * i];
	const len = seeds[2 * i + 1];
	for (let j = start; j < start + len; j++) {
		seeds2.push(j);
	}
}

const locs2 = seeds2.map((seed: number) => {
	return maps.reduce<number>((acc: number, map) => {

		const mapEntry = map.find(({src, len}) => {
			return acc >= src && acc < src + len;
		});

		console.log({acc, mapEntry});

		return mapEntry ? ( mapEntry.dest + acc - mapEntry.src ) : acc;
	}, seed);
});

console.log(Math.min(...locs2)); */
