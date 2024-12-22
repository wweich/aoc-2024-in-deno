#!/usr/bin/env deno

const start = new Date();

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${Deno.args.includes('test') ? 'testinput.txt' : 'input.txt'}`,
);

const lines = input.trim().split('\n');

function mix(secret: bigint, value: bigint) {
    return secret ^ value;
}
function prune(secret: bigint) {
    return secret % 16777216n;
}

function newSecret(secret: bigint) {
    const step1 = prune(mix(secret, secret * 64n));
    const step2 = prune(mix(step1, BigInt(step1 / 32n)));
    return prune(mix(step2, step2 * 2048n));
}

const initialSecrets = lines.map((line) => BigInt(line));

const priceCount = 2000;

const allPrices = [] as { p: number; c: number | null }[][];
for (let secret of initialSecrets) {
    const prices = [{ p: Number(secret % 10n), c: null }] as { p: number; c: number | null }[];
    for (let i = 0; i < priceCount; i++) {
        secret = newSecret(secret);
        const p = Number(secret % 10n);
        const c = p - prices[i].p;
        prices.push({ p, c });
    }
    allPrices.push(prices);
}
console.log('all prices calculated');

const sequenceWithPrice = new Map<string, (number | null)[] & { sum?: number }>();
const sequences = [] as Map<string, number>[];
const allSequences = new Set<string>();
let counter = 0;
for (const prices of allPrices) {
    console.log('calculating prices sequences', ++counter);
    const map = new Map<string, number>();
    for (let i = 1; i < priceCount - 3; i++) {
        const sequence = prices.slice(i, i + 4);
        const sequenceStr = sequence.map(({ c }) => c).join(',');
        allSequences.add(sequenceStr);
        if (map.has(sequenceStr)) {
            continue;
        }
        map.set(sequenceStr, sequence[3].p);
    }
    sequences.push(map);
}

counter = 0;
for (const sequence of allSequences.values()) {
    if (counter++ % 1000 === 0) {
        console.log('calculating sequence sum of', counter, 'to', counter + 1000, 'of', allSequences.size);
    }
    const values = sequences.map((map) => map.get(sequence) ?? null) as (number | null)[] & { sum?: number };
    values.sum = values.reduce((sum, cur) => sum! + (cur ?? 0), 0)!;
    sequenceWithPrice.set(sequence, values);
}

const max = Math.max(...Array.from(sequenceWithPrice.values()).map(({ sum }) => sum ?? 0));
console.log(Array.from(sequenceWithPrice.entries().filter(([, { sum }]) => sum === max)));
console.log(max);

console.log('runtime', +new Date() - +start, 'ms');
