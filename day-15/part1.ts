#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

const [map, movementsStr] = input.trim().split("\n\n");

const movements = movementsStr.replace(/\n/, "").split("");

const mapLines = map.trim().split("\n");

let robotPosition = { x: 0, y: 0 };
const boxes = [] as { x: number; y: number }[];
const walls = [] as { x: number; y: number }[];

for (let y = 0; y < mapLines.length; y++) {
    const chars = mapLines[y].split("");
    for (let x = 0; x < chars.length; x++) {
        if (chars[x] === "#") {
            walls.push({ x, y });
        } else if (chars[x] === "O") {
            boxes.push({ x, y });
        } else if (chars[x] === "@") {
            robotPosition = { x, y };
        }
    }
}

function move(
    item: { x: number; y: number },
    { x, y }: { x: number; y: number },
): boolean {
    const p = {
        x: item.x + x,
        y: item.y + y,
    };
    if (walls.some((w) => w.x === p.x && w.y === p.y)) {
        return false;
    }
    const box = boxes.find((b) => b.x === p.x && b.y === p.y);
    if (box) {
        const doesMove = move(box, { x, y });
        if (doesMove) {
            box.x = box.x + x;
            box.y = box.y + y;
        }
        return doesMove;
    }
    return true;
}

for (const movement of movements) {
    const x = movement === "<" ? -1 : movement === ">" ? 1 : 0;
    const y = movement === "^" ? -1 : movement === "v" ? 1 : 0;
    if (move(robotPosition, { x, y })) {
        robotPosition = {
            x: robotPosition.x + x,
            y: robotPosition.y + y,
        };
    }
}

const gpsSum = boxes.reduce((sum, cur) => sum + (cur.x + cur.y * 100), 0);

console.log(gpsSum);

let output = "";
for (let y = 0; y < mapLines.length; y++) {
    for (let x = 0; x < mapLines[y].length; x++) {
        output += walls.some((w) => w.y === y && w.x === x)
            ? "#"
            : boxes.some((w) => w.y === y && w.x === x)
            ? "O"
            : robotPosition.x === x && robotPosition.y === y
            ? "@"
            : ".";
    }
    output += "\n";
}

await Deno.writeTextFile(`${import.meta.dirname}/output.txt`, output);
