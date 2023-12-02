import * as fs from 'fs';
// const example =  fs.readFileSync('day1ex.txt', 'utf8');
const input =  fs.readFileSync('day1input.txt', 'utf8');
const lines = input.trim().split('\n');

let sum = 0;

for (const line of lines) {
	const numbers = line.match(/\d/g)!.map(Number);

	const number = numbers[0] * 10 + numbers[numbers.length - 1];
	sum += number;
}

console.log(sum);



const numbers = {
	'1': 1,
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
	'6': 6,
	'7': 7,
	'8': 8,
	'9': 9,
	'0': 0,
	'one': 1,
	'two': 2,
	'three': 3,
	'four': 4,
	'five': 5,
	'six': 6,
	'seven': 7,
	'eight': 8,
	'nine': 9,
	'zero': 0,
};
// const example2 =  fs.readFileSync('day1ex2.txt', 'utf8');
let sum2 = 0;

for (const line of input.trim().split('\n')) {
	const first = Object.entries(numbers).map(([key, value]) => {

		const index = line.indexOf(key);
		if (index === -1) {
			return null;
		}
		return { index, value };
	}).reduce((acc, curr) => {
		if (curr === null) {
			return acc;
		}
		if (acc === null) {
			return curr;
		}
		return acc.index < curr.index ? acc : curr;
	})!.value;

	const reversed = line.split('').reverse().join('');

	const last = Object.entries(numbers).map(([key, value]) => {

		const index =reversed.indexOf(key.split('').reverse().join(''));
		if (index === -1) {
			return null;
		}
		return { index, value };
	}).reduce((acc, curr) => {
		if (curr === null) {
			return acc;
		}
		if (acc === null) {
			return curr;
		}
		return acc.index < curr.index ? acc : curr;
	})!.value;

	sum2 += first*10 + last;
}

console.log(sum2);
