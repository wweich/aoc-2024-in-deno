#!/usr/bin/env deno

const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile(
    import.meta.dirname + "/" +
        (Deno.args.includes("test") ? "testinput.txt" : "input.txt"),
);
const input = decoder.decode(data);

const lines = input.split("\n").map((l) => l.trim()).filter((l) => !!l);

const obstructions: [number, number][] = [];

const lineCount = lines.length;
const colCount = lines[0].length;

let guardPosition = null as [number, number] | null;

for (let l = 0; l < lineCount; l++) {
    for (let c = 0; c < colCount; c++) {
        if (lines[l][c] === "#") {
            obstructions.push([l, c]);
        }
        if (lines[l][c] === "^") {
            guardPosition = [l, c];
        }
    }
}

if (guardPosition == null) {
    throw new Error("no guardPosition");
}

const directions = {
    "up": [-1, 0],
    "down": [1, 0],
    "left": [0, -1],
    "right": [0, 1],
};
let direction: keyof (typeof directions) = "up";

function turn() {
    switch (direction) {
        case "up":
            direction = "right";
            break;
        case "down":
            direction = "left";
            break;
        case "left":
            direction = "up";
            break;
        case "right":
            direction = "down";
            break;
    }
}

const visitedCoords: [number, number][] = [];

visitedCoords.push(guardPosition);
while (true) {
    const moveCoords = directions[direction];
    const nextPosition: [number, number] = [
        guardPosition[0] + moveCoords[0],
        guardPosition[1] + moveCoords[1],
    ];
    if (Deno.args.includes("test")) {
        //console.log({ direction, guardPosition, moveCoords, nextPosition });
    }
    if (
        obstructions.some((o) =>
            o[0] === nextPosition[0] && o[1] === nextPosition[1]
        )
    ) {
        turn();
        if (Deno.args.includes("test")) {
            console.log("turn", direction, guardPosition);
        }
        continue;
    }
    if (
        nextPosition[0] >= lineCount || nextPosition[1] >= colCount ||
        nextPosition[0] < 0 || nextPosition[1] < 0
    ) {
        break;
    }
    guardPosition = nextPosition;
    if (
        !visitedCoords.some((coord) =>
            coord[0] === guardPosition![0] && coord[1] === guardPosition![1]
        )
    ) {
        visitedCoords.push(guardPosition);
    }
}

console.log(visitedCoords.length);
