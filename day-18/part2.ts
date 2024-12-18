#!/usr/bin/env deno

const start = new Date();

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

type Position = { x: number; y: number };

const fallingBytes: Position[] = input.trim().split("\n").map((l) => {
    const [x, y] = l.split(",").map(Number);
    return { x, y };
});

const max = Deno.args.includes("test") ? 6 : 70;
const byteCount = Deno.args.includes("test") ? 12 : 1024;

const startPosition: Position = { x: 0, y: 0 };
const endPosition: Position = { x: max, y: max };

function getShortestPath(walls: Position[]) {
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

for (let i = byteCount; i < fallingBytes.length; i++) {
    const walls = fallingBytes.slice(0, i + 1);
    const shortestPath = getShortestPath(walls);
    if (!shortestPath) {
        console.log("no path!", i, fallingBytes[i]);
        break;
    }
}

console.log("runtime", +new Date() - +start, "ms");
