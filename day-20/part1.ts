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

const maxX = map[0].length - 1;
const maxY = map.length - 1;

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

const possibleCheats = walls.filter((w) =>
    w.x < maxX && w.y < maxY && w.x > 0 && w.y > 0
);

const cheatedPaths = [] as { path: Position[]; cheat: Position | null }[];

for (const cheat of possibleCheats) {
    const possiblePathPositions = [
        { x: cheat.x + 1, y: cheat.y },
        { x: cheat.x, y: cheat.y + 1 },
        { x: cheat.x - 1, y: cheat.y },
        { x: cheat.x, y: cheat.y - 1 },
    ];
    const pathPositions = possiblePathPositions.filter((p) =>
        defaultPath!.some((p2) => p2.x === p.x && p2.y === p.y)
    );
    if (pathPositions.length !== 2) {
        // 1 cannot connect, 3 can only shave 2 picoseconds
        continue;
    }
    const cheatPathPositions = [
        defaultPath.findIndex((p) =>
            p.x === pathPositions[0].x && p.y === pathPositions[0].y
        ),
        defaultPath.findIndex((p) =>
            p.x === pathPositions[1].x && p.y === pathPositions[1].y
        ),
    ].toSorted((a, b) => a - b);
    const path = defaultPath.toSpliced(
        cheatPathPositions[0] + 1,
        cheatPathPositions[1] - cheatPathPositions[0] - 2,
    );
    if (path.length < defaultPath.length) {
        cheatedPaths.push({ path, cheat });
    }
}

if (Deno.args.includes("test")) {
    const output = {} as Record<number, number>;
    for (const { path } of cheatedPaths) {
        const length = defaultPath!.length - path.length;
        if (!output[length]) {
            output[length] = 0;
        }
        output[length]++;
    }
    console.table(output);
} else {
    console.log(
        cheatedPaths.filter((p) => p.path.length <= defaultPath!.length - 100)
            .length,
    );
}
