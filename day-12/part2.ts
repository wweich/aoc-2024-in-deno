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
    perimeterCoords: { x: number; y: number }[];
    perimeter?: number;
    sides?: number;
}[];

for (const plant of plants) {
    const possibleRegions = regions.filter((r) => r.type === plant.type);
    if (possibleRegions.length === 0) {
        regions.push({
            type: plant.type,
            plants: [plant],
            perimeterCoords: [],
            //cornerCoords: [],
        });
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
        regions.push({
            type: plant.type,
            plants: [plant],
            perimeterCoords: [],
        });
    } else if (adjacentRegions.length === 1) {
        adjacentRegions[0].plants.push(plant);
    } else {
        const newRegion = {
            type: plant.type,
            plants: [plant, ...adjacentRegions.flatMap((a) => a.plants)],
            perimeterCoords: [],
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
        region.perimeterCoords = [...region.perimeterCoords, ...perimeterCoords]
            .filter((p, idx, arr) =>
                arr.findIndex((p2) => p.x === p2.x && p.y === p2.y) === idx
            );
        perimeter += perimeterCoords.length;
    }
    region.perimeter = perimeter;
}

for (const region of regions) {
    const outerCorners = region.perimeterCoords.flatMap((p) =>
        [
            { x: p.x + 1, y: p.y - 1 },
            { x: p.x + 1, y: p.y + 1 },
            { x: p.x - 1, y: p.y - 1 },
            { x: p.x - 1, y: p.y + 1 },
        ].filter((c) =>
            region.perimeterCoords.some((p) => c.x === p.x && c.y == p.y)
        ).map((m) =>
            [p, m] as [{ x: number; y: number }, { x: number; y: number }]
        )
    ).filter((m1, idx, arr) =>
        arr.findIndex((m2) =>
                m2.some((m) => m.x === m1[0].x && m.y === m1[0].y) &&
                m2.some((m) => m.x === m1[1].x && m.y === m1[1].y)
            ) === idx &&
        region.plants.filter((plant) =>
                [{ x: m1[0].x, y: m1[1].y }, { x: m1[1].x, y: m1[0].y }].some(
                    (pm) => pm.x === plant.x && pm.y === plant.y,
                )
            ).length === 1
    );
    const topLeftInnerCorners = region.perimeterCoords.filter((p1) =>
        [
            { x: p1.x, y: p1.y - 1 },
            { x: p1.x - 1, y: p1.y },
        ].every((c) => region.plants.some((p) => p.x === c.x && p.y === c.y))
    );
    const topRightInnerCorners = region.perimeterCoords.filter((p1) =>
        [
            { x: p1.x, y: p1.y - 1 },
            { x: p1.x + 1, y: p1.y },
        ].every((c) => region.plants.some((p) => p.x === c.x && p.y === c.y))
    );
    const bottomLeftInnerCorners = region.perimeterCoords.filter((p1) =>
        [
            { x: p1.x, y: p1.y + 1 },
            { x: p1.x - 1, y: p1.y },
        ].every((c) => region.plants.some((p) => p.x === c.x && p.y === c.y))
    );
    const bottomRightInnerCorners = region.perimeterCoords.filter((p1) =>
        [
            { x: p1.x, y: p1.y + 1 },
            { x: p1.x + 1, y: p1.y },
        ].every((c) => region.plants.some((p) => p.x === c.x && p.y === c.y))
    );
    region.sides = outerCorners.length + topLeftInnerCorners.length +
        topRightInnerCorners.length + bottomLeftInnerCorners.length +
        bottomRightInnerCorners.length;
}

console.log(
    regions.reduce(
        (sum, region) => sum + (region.area! * region.perimeter!),
        0,
    ),
);

console.log(
    regions.reduce(
        (sum, region) => sum + (region.area! * region.sides!),
        0,
    ),
);
