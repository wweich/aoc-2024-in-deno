#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

const [map, movementsStr] = input.trim().split("\n\n");

const movements = movementsStr.replace(/\n/, "").split("");

const wideMap = map.trim()
    .replace(/#/g, "##")
    .replace(/O/g, "[]")
    .replace(/\./g, "..")
    .replace(/@/g, "@.");

const wideMapLines = wideMap.split("\n");

let robotPosition = { x: 0, y: 0 };
const boxes = [] as { x: [number, number]; y: number }[];
const walls = [] as { x: number; y: number }[];

for (let y = 0; y < wideMapLines.length; y++) {
    const chars = wideMapLines[y].split("");
    for (let x = 0; x < chars.length; x++) {
        if (chars[x] === "#") {
            walls.push({ x, y });
        } else if (chars[x] === "[") {
            boxes.push({ x: [x, x + 1], y });
        } else if (chars[x] === "@") {
            robotPosition = { x, y };
        }
    }
}

function moveBoxes(
    items: { x: [number, number]; y: number }[],
    { x, y }: { x: -1 | 0 | 1; y: -1 | 0 | 1 },
): boolean {
    const matchingBoxes = [] as { x: [number, number]; y: number }[];
    for (const item of items) {
        const p = {
            x: [item.x[0] + x, item.x[1] + x],
            y: item.y + y,
        };
        if (walls.some((w) => p.x.includes(w.x) && w.y === p.y)) {
            return false;
        }
        matchingBoxes.push(
            ...boxes.filter((b) =>
                new Set(p.x).intersection(new Set(b.x)).size > 0 &&
                b.y === p.y && !items.includes(b) && !matchingBoxes.includes(b)
            ),
        );
    }
    if (matchingBoxes.length) {
        if (!moveBoxes(matchingBoxes, { x, y })) {
            return false;
        }
    }
    for (const box of items) {
        box.x[0] = box.x[0] + x;
        box.x[1] = box.x[1] + x;
        box.y = box.y + y;
    }
    return true;
}

function moveRobot(
    item: { x: number; y: number },
    { x, y }: { x: -1 | 0 | 1; y: -1 | 0 | 1 },
): boolean {
    const p = {
        x: item.x + x,
        y: item.y + y,
    };
    if (walls.some((w) => w.x === p.x && w.y === p.y)) {
        return false;
    }
    const matchingBoxes = boxes.filter((b) => b.x.includes(p.x) && b.y === p.y);
    if (matchingBoxes.length) {
        if (!moveBoxes(matchingBoxes, { x, y })) {
            return false;
        }
    }
    robotPosition = {
        x: robotPosition.x + x,
        y: robotPosition.y + y,
    };
    return true;
}

for (const movement of movements) {
    const x = movement === "<" ? -1 : movement === ">" ? 1 : 0;
    const y = movement === "^" ? -1 : movement === "v" ? 1 : 0;
    moveRobot(robotPosition, { x, y });
}

const gpsSum = boxes.reduce((sum, cur) => sum + (cur.x[0] + cur.y * 100), 0);
console.log(gpsSum);

let output = "";
for (let y = 0; y < wideMapLines.length; y++) {
    for (let x = 0; x < wideMapLines[y].length; x++) {
        output += walls.some((w) => w.y === y && w.x === x)
            ? "#"
            : boxes.some((w) => w.y === y && w.x[0] === x)
            ? "["
            : boxes.some((w) => w.y === y && w.x[1] === x)
            ? "]"
            : robotPosition.x === x && robotPosition.y === y
            ? "@"
            : ".";
    }
    output += "\n";
}

await Deno.writeTextFile(`${import.meta.dirname}/output.txt`, output);
