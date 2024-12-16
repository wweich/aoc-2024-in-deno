#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

type Position = { x: number; y: number };
type PositionArrayWithScore = Position[] & { score: number };

const map = input.trim().split("\n").map((l) => l.split(""));

let startPosition = { x: 0, y: 0 };
let endPosition = { x: 0, y: 0 };

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === "S") {
            startPosition = { x, y };
        } else if (map[y][x] === "E") {
            endPosition = { x, y };
        }
    }
}

function getDirection(pos: Position, lastPos: Position): "h" | "v" {
    return pos.x === lastPos.x ? "v" : "h";
}

const queue = [] as PositionArrayWithScore[];
const start = [startPosition] as PositionArrayWithScore;
start.score = 0;
queue.push(start);

let shortestPath: PositionArrayWithScore;

mainloop:
while (queue.length > 0) {
    queue.sort((a, b) => a.score - b.score);
    const path = queue.shift()!;
    const pos = path[path.length - 1];
    const lastPos = path[path.length - 2];
    const direction = lastPos ? getDirection(pos, lastPos) : "h";
    const newPositions = [
        { x: pos.x + 1, y: pos.y },
        { x: pos.x, y: pos.y + 1 },
        { x: pos.x - 1, y: pos.y },
        { x: pos.x, y: pos.y - 1 },
    ];
    for (const newPos of newPositions) {
        if (
            newPos.x === endPosition.x &&
            newPos.y == endPosition.y
        ) {
            const validPath = path.concat([
                endPosition,
            ]) as PositionArrayWithScore;
            validPath.score = path.score +
                (getDirection(newPos, pos) === direction ? 1 : 1001);
            shortestPath = validPath;
            break mainloop;
        }

        if (map[newPos.y][newPos.x] !== ".") {
            // Wall
            continue;
        }
        if (path.some((p) => p.x === newPos.x && p.y === newPos.y)) {
            // visited position means, circle or backwards
            continue;
        }

        map[newPos.y][newPos.x] = "x";

        const newPath = path.concat([newPos]) as PositionArrayWithScore;
        newPath.score = path.score +
            (getDirection(newPos, pos) === direction ? 1 : 1001);
        queue.push(newPath);
    }
}

const minScore = shortestPath!.score;
console.log(minScore);
