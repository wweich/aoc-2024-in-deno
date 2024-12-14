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

for (let second = 0; second < 100; second++) {
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
}

const quadrants = [
    {
        minX: 0,
        maxX: (maxX / 2) - 1,
        minY: 0,
        maxY: (maxY / 2) - 1,
        robotCount: 0,
    },
    {
        minX: (maxX / 2) + 1,
        maxX,
        minY: 0,
        maxY: (maxY / 2) - 1,
        robotCount: 0,
    },
    {
        minX: 0,
        maxX: (maxX / 2) - 1,
        minY: (maxY / 2) + 1,
        maxY,
        robotCount: 0,
    },
    { minX: (maxX / 2) + 1, maxX, minY: (maxY / 2) + 1, maxY, robotCount: 0 },
];

for (const robot of robots) {
    const quadrant = quadrants.find((q) =>
        q.minX <= robot.position.x && q.maxX >= robot.position.x &&
        q.minY <= robot.position.y && q.maxY >= robot.position.y
    );
    if (!quadrant) {
        continue;
    }
    quadrant!.robotCount++;
}

console.log(quadrants);

console.log(quadrants.reduce((result, cur) => result * cur.robotCount, 1));
