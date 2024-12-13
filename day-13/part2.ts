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
        x: +/X\=(?<x>[0-9]+)/.exec(lines[2])![1] + 10000000000000,
        y: +/Y\=(?<y>[0-9]+)/.exec(lines[2])![1] + 10000000000000,
    };

    const a = (prize.x * buttonB.y - prize.y * buttonB.x) /
        (buttonA.x * buttonB.y - buttonA.y * buttonB.x);

    const b = (prize.y * buttonA.x - prize.x * buttonA.y) /
        (buttonA.x * buttonB.y - buttonA.y * buttonB.x);

    if (a == Math.floor(a) && b == Math.floor(b)) {
        tokens += a * 3 + b;
    }
}

console.log(tokens);
