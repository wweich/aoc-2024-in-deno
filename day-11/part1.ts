#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

const stones = input.trim().split(" ").map(Number);

for (let i = 0; i < 25; i++) {
    for (let j = 0; j < stones.length; j++) {
        if (stones[j] === 0) {
            stones[j] = 1;
        } else if (stones[j].toString().length % 2 === 0) {
            const firstHalf = stones[j].toString().slice(
                0,
                stones[j].toString().length / 2,
            );
            const secondHalf = stones[j].toString().slice(
                stones[j].toString().length / 2,
            );
            stones[j] = +firstHalf;
            stones.splice(j + 1, 0, +secondHalf);
            j++;
        } else {
            stones[j] *= 2024;
        }
    }
}

console.log(stones.length);
