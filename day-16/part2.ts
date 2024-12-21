#!/usr/bin/env deno

const start = new Date();
const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

type Position = { x: number; y: number };
type PositionArrayWithScore = Position[] & { score: number };

const map = input.trim().split("\n").map((l) => l.split(""));

const startPosition = { x: 0, y: 0 };
startPosition.y = map.findIndex((l) => l.includes("S"));
startPosition.x = map[startPosition.y].findIndex((c) => c === "S");

const endPosition = { x: 0, y: 0 };
endPosition.y = map.findIndex((l) => l.includes("E"));
endPosition.x = map[endPosition.y].findIndex((c) => c === "E");

function getDirection(
    pos: Position,
    lastPos: Position,
): "n" | "s" | "w" | "e" {
    return pos.x === lastPos.x
        ? pos.y > lastPos.y ? "s" : "n"
        : pos.x > lastPos.x
        ? "e"
        : "w";
}

function getShortestPath() {
    const queue = [] as PositionArrayWithScore[];
    const start = [startPosition] as PositionArrayWithScore;
    start.score = 0;
    queue.push(start);
    const visited = new Set<string>();
    while (queue.length > 0) {
        queue.sort((a, b) => a.score - b.score);
        const path = queue.shift()!;
        const pos = path[path.length - 1];
        const lastPos = path[path.length - 2];
        const direction = lastPos ? getDirection(pos, lastPos) : "e";
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
                return validPath;
            }

            if (map[newPos.y][newPos.x] !== ".") {
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

            const newPath = path.concat([newPos]) as PositionArrayWithScore;
            newPath.score = path.score +
                (getDirection(newPos, pos) === direction ? 1 : 1001);
            queue.push(newPath);
        }
    }
}

function getPaths(score: number) {
    const queue = [] as PositionArrayWithScore[];
    const start = [startPosition] as PositionArrayWithScore;
    start.score = 0;
    queue.push(start);
    const validPaths = [] as PositionArrayWithScore[];
    const visited = new Map<string, number>();
    while (queue.length > 0) {
        queue.sort((a, b) => a.score - b.score);
        const path = queue.shift()!;
        const pos = path[path.length - 1];
        const lastPos = path[path.length - 2];
        const direction = lastPos ? getDirection(pos, lastPos) : "e";
        const newPositions = [
            { x: pos.x + 1, y: pos.y },
            { x: pos.x, y: pos.y + 1 },
            { x: pos.x - 1, y: pos.y },
            { x: pos.x, y: pos.y - 1 },
        ];
        for (const newPos of newPositions) {
            const newScore = path.score +
                (getDirection(newPos, pos) === direction ? 1 : 1001);
            if (
                newPos.x === endPosition.x &&
                newPos.y == endPosition.y
            ) {
                const validPath = path.concat([
                    endPosition,
                ]) as PositionArrayWithScore;
                validPath.score = newScore;
                validPaths.push(validPath);
                continue;
            }

            if (map[newPos.y][newPos.x] !== ".") {
                // Wall
                continue;
            }
            if (path.some((p) => p.x === newPos.x && p.y === newPos.y)) {
                // visited position means, circle or backwards
                continue;
            }
            if (newScore > score) {
                continue;
            }
            const visitKey = `${newPos.x}|${newPos.y}|${
                getDirection(newPos, pos)
            }`;
            if (visited.has(visitKey) && visited.get(visitKey)! < newScore) {
                continue;
            }

            visited.set(visitKey, newScore);

            const newPath = path.concat([newPos]) as PositionArrayWithScore;
            newPath.score = newScore;
            queue.push(newPath);
        }
    }
    return validPaths;
}

const shortestPath = getShortestPath();
const minScore = shortestPath!.score;
console.log(minScore);

const shortestPaths = getPaths(minScore).toSorted((a, b) => a.score - b.score);
console.log(shortestPaths.length);

const uniquePositions = new Set<string>([
    `${startPosition.x}|${startPosition.y}`,
    `${endPosition.x}|${endPosition.y}`,
]);

for (const { x, y } of shortestPaths.flatMap((p) => p)) {
    uniquePositions.add(`${x}|${y}`);
}

console.log(uniquePositions.size);
console.log("runtime", +new Date() - +start, "ms");
