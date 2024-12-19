#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

const [towelsStr, designStr] = input.trim().split("\n\n");
const towels = towelsStr.split(",").map((t) => t.trim());
const designs = designStr.split("\n");

let possibleDesignCount = 0;

for (const design of designs) {
    const check = new Array(design.length + 1).fill(0);
    check[0] = 1;
    for (let i = 0; i < design.length; i++) {
        if (check[i]) {
            for (const towel of towels) {
                if (design.slice(i, i + towel.length) === towel) {
                    check[i + towel.length] = 1;
                }
            }
        }
    }
    if (check[design.length]) {
        possibleDesignCount++;
    }
}

console.log(possibleDesignCount);
