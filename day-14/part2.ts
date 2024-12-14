#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

const lines = input.trim().split("\n");

const robots = lines.map((l) => {
    const pos = /p=(?<x>\d+),(?<y>\d+)/.exec(l);
    const position = { x: +pos!.groups!.x, y: +pos!.groups!.y };
    const vel = /v=(?<x>\-?\d+),(?<y>\-?\d+)/.exec(l);
    const velocity = { x: +vel!.groups!.x, y: +vel!.groups!.y };
    return { position, velocity };
});

const maxX = Deno.args.includes("test") ? 10 : 100;
const maxY = Deno.args.includes("test") ? 6 : 102;

let counter = 0;
while (counter < 100_000) {
    counter++;
    for (const robot of robots) {
        const newPosition = {
            x: robot.position.x + robot.velocity.x,
            y: robot.position.y + robot.velocity.y,
        };
        if (newPosition.x < 0) {
            newPosition.x += maxX + 1;
        }
        if (newPosition.x > maxX) {
            newPosition.x -= maxX + 1;
        }
        if (newPosition.y < 0) {
            newPosition.y += maxY + 1;
        }
        if (newPosition.y > maxY) {
            newPosition.y -= maxY + 1;
        }
        robot.position = newPosition;
    }
    if (
        robots.every((robot, idx, arr) =>
            arr.findIndex((r) =>
                r.position.x === robot.position.x &&
                r.position.y === robot.position.y
            ) === idx
        )
    ) {
        break;
    }
}

console.log(counter);

let output = "";
for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxY; x++) {
        output += robots.some((r) => r.position.y === y && r.position.x === x)
            ? "·"
            : " ";
    }
    output += "\n";
}

await Deno.writeTextFile(`${import.meta.dirname}/output.txt`, output);
