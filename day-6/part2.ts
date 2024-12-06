#!/usr/bin/env deno

const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();
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

const origGuardPosition = guardPosition;

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

const origVisitedCoords: [number, number][] = [];

origVisitedCoords.push(guardPosition);
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
        !origVisitedCoords.some((coord) =>
            coord[0] === guardPosition![0] && coord[1] === guardPosition![1]
        )
    ) {
        origVisitedCoords.push(guardPosition);
    }
}

let numberOfPossibleNewObsctructions = 0;
for (const visitedCoord of origVisitedCoords) {
    const line = visitedCoord[0];
    const col = visitedCoord[1];
    if (obstructions.some((o) => o[0] === line && o[1] === col)) {
        // allready an obstruction in this position
        await Deno.stdout.write(encoder.encode("#"));
        continue;
    }
    if (origGuardPosition[0] === line && origGuardPosition[1] === col) {
        // new obstruction cannot be placed in front of guard
        await Deno.stdout.write(encoder.encode("#"));
        continue;
    }
    const newObstruction = [line, col];
    if (Deno.args.includes("test")) {
        console.log({ newObstruction });
    } else {
        await Deno.stdout.write(encoder.encode("O"));
        //console.log(newObstruction);
    }
    guardPosition = origGuardPosition;
    direction = "up";
    const visitedCoords: [number, number, string][] = [];
    visitedCoords.push([...guardPosition, direction]);
    while (true) {
        const moveCoords = directions[direction];
        const nextPosition: [number, number] = [
            guardPosition[0] + moveCoords[0],
            guardPosition[1] + moveCoords[1],
        ];
        if (
            obstructions.some((o) =>
                o[0] === nextPosition[0] && o[1] === nextPosition[1]
            ) ||
            newObstruction[0] === nextPosition[0] &&
                newObstruction[1] === nextPosition[1]
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
            visitedCoords.some((coord) =>
                coord[0] === guardPosition![0] &&
                coord[1] === guardPosition![1] &&
                coord[2] === direction
            )
        ) {
            numberOfPossibleNewObsctructions++;
            break;
        }
        if (
            !visitedCoords.some((coord) =>
                coord[0] === guardPosition![0] &&
                coord[1] === guardPosition![1]
            )
        ) {
            visitedCoords.push([...guardPosition, direction]);
        }
    }
}

console.log("");
console.log(numberOfPossibleNewObsctructions);
