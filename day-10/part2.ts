#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

const lines = input.trim().split("\n");

const points = [] as { x: number; y: number; h: number }[];

for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
        points.push({ x, y, h: +lines[y][x] });
    }
}

const possibleTrailheads = points.filter((p) => p.h === 0);

const trailheads = [] as {
    x: number;
    y: number;
    rating: number;
}[];

for (const th of possibleTrailheads) {
    let currentPoints = [th] as { x: number; y: number }[];
    for (let i = 1; i <= 9; i++) {
        currentPoints = currentPoints.flatMap((p) => [
            { x: p.x - 1, y: p.y },
            { x: p.x + 1, y: p.y },
            { x: p.x, y: p.y - 1 },
            { x: p.x, y: p.y + 1 },
        ]).filter((cp) =>
            points.find((p) => p.x === cp.x && p.y === cp.y && p.h === i)
        );
    }
    if (currentPoints.length > 0) {
        trailheads.push({
            x: th.x,
            y: th.y,
            rating: currentPoints.length,
        });
    }
}

console.log(trailheads.reduce((sum, th) => sum + th.rating, 0));
