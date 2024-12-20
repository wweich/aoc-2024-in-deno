#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

type Position = { x: number; y: number };

const map = input.trim().split("\n").map((l) => l.split(""));

const startPosition = { x: 0, y: 0 } as Position;
startPosition.y = map.findIndex((l) => l.includes("S"));
startPosition.x = map[startPosition.y].findIndex((c) => c === "S");

const endPosition = { x: 0, y: 0 } as Position;
endPosition.y = map.findIndex((l) => l.includes("E"));
endPosition.x = map[endPosition.y].findIndex((c) => c === "E");

const walls = [] as Position[];

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === "#") {
            walls.push({ x, y });
        }
    }
}

function getShortestPath() {
    const queue = [] as Position[][];
    const start = [startPosition] as Position[];
    queue.push(start);
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

            if (walls.some((w) => w.x === newPos.x && w.y === newPos.y)) {
                // Wall
                continue;
            }

            if (path.some((p) => p.x === newPos.x && p.y === newPos.y)) {
                // visited position means backwards
                continue;
            }

            queue.push(path.concat([newPos]));
        }
    }
}

const defaultPath = getShortestPath()!;

const cheatedPaths = [] as [Position, Position, number][];

const cheatMinPicosecods = Deno.args.includes("test") ? 50 : 100;

for (let i = 0; i < defaultPath.length - 1; i++) {
    for (let j = i + 1; j < defaultPath.length; j++) {
        const cheatLength = Math.abs(defaultPath[i].x - defaultPath[j].x) +
            Math.abs(defaultPath[i].y - defaultPath[j].y);
        if (cheatLength <= 20) {
            const shaveLength = j - i - cheatLength;
            if (shaveLength >= cheatMinPicosecods) {
                cheatedPaths.push([
                    defaultPath[i],
                    defaultPath[j],
                    shaveLength,
                ]);
            }
        }
    }
}

console.log(cheatedPaths.length);

if (Deno.args.includes("test")) {
    const output = {} as Record<number, number>;
    for (const [, , length] of cheatedPaths) {
        if (!output[length]) {
            output[length] = 0;
        }
        output[length]++;
    }
    console.table(output);
}
