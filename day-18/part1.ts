#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

type Position = { x: number; y: number };

const fallingBytes = input.trim().split("\n").map((l) => {
    const [x, y] = l.split(",").map(Number);
    return { x, y };
});

const max = Deno.args.includes("test") ? 6 : 70;
const byteCount = Deno.args.includes("test") ? 12 : 1024;

const startPosition = { x: 0, y: 0 };
const endPosition = { x: max, y: max };

const walls = fallingBytes.slice(0, byteCount);

function getShortestPath() {
    const queue = [] as Position[][];
    const start = [startPosition] as Position[];
    queue.push(start);
    const visited = new Set<string>();
    while (queue.length > 0) {
        queue.sort((a, b) => a.length - b.length);
        const path = queue.shift()!;
        const pos = path[path.length - 1];
        const newPositions = [
            { x: pos.x + 1, y: pos.y },
            { x: pos.x, y: pos.y + 1 },
            { x: pos.x - 1, y: pos.y },
            { x: pos.x, y: pos.y - 1 },
        ];
        for (const newPos of newPositions) {
            if (newPos.x === endPosition.x && newPos.y == endPosition.y) {
                return path.concat([endPosition]);
            }

            if (
                newPos.x < 0 || newPos.x > max || newPos.y < 0 || newPos.y > max
            ) {
                // outside
                continue;
            }
            if (walls.some((w) => w.x === newPos.x && w.y === newPos.y)) {
                // Wall
                continue;
            }
            if (path.some((p) => p.x === newPos.x && p.y === newPos.y)) {
                // visited position means, circle or backwards
                continue;
            }
            const visitKey = `${newPos.x}|${newPos.y}`;
            if (visited.has(visitKey)) {
                continue;
            }

            visited.add(visitKey);

            queue.push(path.concat([newPos]));
        }
    }
}

const shortestPath = getShortestPath();
console.log(shortestPath);
console.log(shortestPath!.length - 1);

let output = "";
for (let y = 0; y <= max; y++) {
    for (let x = 0; x <= max; x++) {
        output += walls.some((w) => w.x === x && w.y === y)
            ? "#"
            : shortestPath?.some((p) => p.x === x && p.y === y)
            ? "O"
            : ".";
    }
    output += "\n";
}
await Deno.writeTextFile(`${import.meta.dirname}/output.txt`, output);
