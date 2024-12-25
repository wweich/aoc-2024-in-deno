#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${Deno.args.includes('test') ? 'testinput.txt' : 'input.txt'}`,
);

const keys = [] as number[][];
const locks = [] as number[][];
input.trim().split('\n\n').forEach((s) => {
    const lines = s.split('\n');
    const lineCount = lines.length;
    const colCount = lines[0].length;
    if (lines[0].split('').every((c) => c === '#') && lines[lineCount - 1].split('').every((c) => c === '.')) {
        // lock
        locks.push(
            (new Array(colCount)).fill(0).map((_, c) =>
                lines.slice(1, -1).map((l) => l[c]).filter((x) => x === '#').length
            ),
        );
    } else if (lines[0].split('').every((c) => c === '.') && lines[lineCount - 1].split('').every((c) => c === '#')) {
        // key
        keys.push(
            (new Array(colCount)).fill(0).map((_, c) =>
                lines.slice(1, -1).map((l) => l[c]).filter((x) => x === '#').length
            ),
        );
    } else {
        console.error(s);
        throw new Error('Neiter lock nor key');
    }
});

let pairCount = 0;
for (const key of keys) {
    for (const lock of locks) {
        if (key.every((v, idx) => v + lock[idx] <= 5)) {
            pairCount++;
        }
    }
}

console.log(pairCount);
