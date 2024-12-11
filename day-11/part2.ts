#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

const blinks = 75;

const stones = input.trim().split(" ").map(Number);

const sumCaches = [] as (Map<number, number>)[];
for (let i = 1; i <= blinks; i++) {
    sumCaches[i] = new Map<number, number>();
}

function blinkStone(stone: number, blinksLeft: number): number {
    if (blinksLeft <= 0) {
        return 1;
    }
    if (sumCaches[blinksLeft].has(stone)) {
        return sumCaches[blinksLeft].get(stone)!;
    }

    let result = [];
    if (stone === 0) {
        result = [1];
    } else if (stone.toString().length % 2 === 0) {
        result = [
            +stone.toString().slice(0, stone.toString().length / 2),
            +stone.toString().slice(stone.toString().length / 2),
        ];
    } else {
        result = [stone * 2024];
    }
    const sum = result.reduce(
        (sum, s) => sum + blinkStone(s, blinksLeft - 1),
        0,
    );
    sumCaches[blinksLeft].set(stone, sum);

    return sum;
}

console.log(
    stones.map((s) => blinkStone(s, blinks)).reduce((sum, cur) => sum + cur),
);
