#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

const lines = input.trim().split("\n");
const lineCount = lines.length;
const colCount = lines[0].length;

const plants = [] as { x: number; y: number; type: string }[];

for (let y = 0; y < lineCount; y++) {
    for (let x = 0; x < colCount; x++) {
        plants.push({ x, y, type: lines[y][x] });
    }
}

const regions = [] as {
    type: string;
    plants: { x: number; y: number; type: string }[];
    area?: number;
    perimeter?: number;
}[];

for (const plant of plants) {
    const possibleRegions = regions.filter((r) => r.type === plant.type);
    if (possibleRegions.length === 0) {
        regions.push({ type: plant.type, plants: [plant] });
        continue;
    }
    const adjacentCoords = [
        { x: plant.x - 1, y: plant.y },
        { x: plant.x + 1, y: plant.y },
        { x: plant.x, y: plant.y - 1 },
        { x: plant.x, y: plant.y + 1 },
    ];
    const adjacentRegions = possibleRegions.filter((r) =>
        r.plants.some((p) =>
            adjacentCoords.some((a) => a.x === p.x && a.y === p.y)
        )
    );
    if (adjacentRegions.length === 0) {
        regions.push({ type: plant.type, plants: [plant] });
    } else if (adjacentRegions.length === 1) {
        adjacentRegions[0].plants.push(plant);
    } else {
        const newRegion = {
            type: plant.type,
            plants: [plant, ...adjacentRegions.flatMap((a) => a.plants)],
        };
        for (const a of adjacentRegions) {
            regions.splice(
                regions.findIndex((r) =>
                    r.type === a.type && r.plants[0].x === a.plants[0].x &&
                    r.plants[0].y === a.plants[0].y
                ),
                1,
            );
        }
        regions.push(newRegion);
    }
}
regions.forEach((r) => r.area = r.plants.length);

for (const region of regions) {
    let perimeter = 0;
    for (const plant of region.plants) {
        const adjacentCoords = [
            { x: plant.x - 1, y: plant.y },
            { x: plant.x + 1, y: plant.y },
            { x: plant.x, y: plant.y - 1 },
            { x: plant.x, y: plant.y + 1 },
        ];
        const perimeterCoords = adjacentCoords.filter((a) =>
            !region.plants.some((p) => p.x === a.x && p.y === a.y)
        );
        perimeter += perimeterCoords.length;
    }
    region.perimeter = perimeter;
}

console.log(
    regions.reduce(
        (sum, region) => sum + (region.area! * region.perimeter!),
        0,
    ),
);
