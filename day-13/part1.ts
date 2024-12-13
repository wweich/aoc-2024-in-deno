#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

const machines = input.trim().split("\n\n");

let tokens = 0;

for (const machine of machines) {
    const lines = machine.split("\n");
    const buttonA = {
        x: +/X\+(?<x>[0-9]+)/.exec(lines[0])![1],
        y: +/Y\+(?<y>[0-9]+)/.exec(lines[0])![1],
    };
    const buttonB = {
        x: +/X\+(?<x>[0-9]+)/.exec(lines[1])![1],
        y: +/Y\+(?<y>[0-9]+)/.exec(lines[1])![1],
    };
    const prize = {
        x: +/X\=(?<x>[0-9]+)/.exec(lines[2])![1],
        y: +/Y\=(?<y>[0-9]+)/.exec(lines[2])![1],
    };

    const maxA = Math.min(
        Math.floor(prize.x / buttonA.x),
        Math.floor(prize.y / buttonA.y),
    );
    const maxB = Math.min(
        Math.floor(prize.x / buttonB.x),
        Math.floor(prize.y / buttonB.y),
    );

    const possibleTokens = [];
    for (let a = 0; a <= maxA; a++) {
        for (let b = 0; b <= maxB; b++) {
            if (
                buttonA.x * a + buttonB.x * b === prize.x &&
                buttonA.y * a + buttonB.y * b === prize.y
            ) {
                possibleTokens.push(a * 3 + b);
            }
        }
    }
    tokens += possibleTokens.sort()[0] ?? 0;
}

console.log(tokens);
