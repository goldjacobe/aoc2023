import fs from 'fs';

const useExample = false;
const input = fs.readFileSync(
  useExample ? 'day7ex.txt' : 'day7input.txt',
  'utf8'
);

const lines = input.trim().split('\n');

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

const rankMap = Object.fromEntries(ranks.map((rank, i) => [rank, i]));

const total = lines
  .map((line) => {
    const [hand, bet] = line.split(/\s+/);
    const cards = hand.split('');
    const occurrences = new Map();
    for (const card of cards) {
      const current = occurrences.get(card) ?? 0;
      occurrences.set(card, current + 1);
    }
    const sorted = [...occurrences.values()].sort((a, b) => b - a);
    const rank =
      sorted[0] === 1 ?
        0 // high card
      : sorted[0] === 2 ?
        sorted[1] === 2 ?
          2 // two pair
        : 1 // pair
      : sorted[0] === 3 ?
        sorted[1] === 2 ?
          4 // full house
        : 3 // three of a kind
      : sorted[0] === 4 ?
        5 // four of a kind
      : 6; // five of a kind
    return { rank, cards, bet: +bet };
  })
  .sort((a, b) =>
    b.rank === a.rank ? compareHandsByCard(a.cards, b.cards) : a.rank - b.rank
  )
  .reduce((acc, { bet }, i) => {
    return acc + (1 + i) * +bet;
  }, 0);
console.log(total);

function compareHandsByCard(a: string[], b: string[], map = rankMap) {
  for (let i = 0; i < a.length; i++) {
    const aRank = map[a[i]];
    const bRank = map[b[i]];
    if (aRank !== bRank) {
      return aRank - bRank;
    }
  }
  return 0;
}

const ranks2 = [
  'J',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'Q',
  'K',
  'A',
];

const rankMap2 = Object.fromEntries(ranks2.map((rank, i) => [rank, i]));

const total2 = lines
  .map((line) => {
    const [hand, bet] = line.split(/\s+/);
    const cards = hand.split('');
    const occurrences = new Map();
    let numJokers = 0;
    for (const card of cards) {
      if (card === 'J') {
        numJokers++;
        continue;
      }
      const current = occurrences.get(card) ?? 0;
      occurrences.set(card, current + 1);
    }
    const sorted = [...occurrences.values()].sort((a, b) => b - a);
    const pj =
      sorted[0] === 1 ?
        0 // high card
      : sorted[0] === 2 ?
        sorted[1] === 2 ?
          2 // two pair
        : 1 // pair
      : sorted[0] === 3 ?
        sorted[1] === 2 ?
          4 // full house
        : 3 // three of a kind
      : sorted[0] === 4 ?
        5 // four of a kind
      : 6; // five of a kind
    return {
      rank:
        numJokers === 0 ? pj
        : numJokers === 1 ?
          pj === 0 ? 1
          : pj === 1 ? 3
          : pj === 2 ? 4
          : pj === 3 ? 5
          : pj === 5 ? 6
          : pj
        : numJokers === 2 ?
          pj === 0 ? 3
          : pj === 1 ? 5
          : pj === 3 ? 6
          : pj
        : numJokers === 3 ?
          pj === 0 ? 5
          : pj === 1 ? 6
          : pj
        : numJokers === 4 ?
          pj === 0 ?
            6
          : pj
        : numJokers === 5 ? 6
        : 0,
      cards,
      bet: +bet,
    };
  })
  .sort((a, b) =>
    b.rank === a.rank ?
      compareHandsByCard(a.cards, b.cards, rankMap2)
    : a.rank! - b.rank!
  )
  .reduce((acc, { bet }, i) => {
    return acc + (1 + i) * +bet;
  }, 0);
console.log(total2);
