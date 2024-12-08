#!/usr/bin/env deno

const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile(
    import.meta.dirname + "/" +
        (Deno.args.includes("test") ? "testinput.txt" : "input.txt"),
);
const input = decoder.decode(data);

const lines = input.split("\n");
const lineCount = lines.length;
const colCount = lines[0].length;

const antennas = [];
for (let line = 0; line < lineCount; line++) {
    antennas.push(
        ...Array.from(lines[line].matchAll(/[a-z0-9]/gi)).map((m) => ({
            key: m[0],
            line,
            col: m.index,
        })),
    );
}

const keys = new Set(antennas.map((a) => a.key));
const antinodes = [] as { key: string; line: number; col: number }[];
for (const key of keys.values()) {
    const matchingAntennas = antennas.filter((a) => a.key === key);
    for (let i = 0; i < matchingAntennas.length; i++) {
        for (let j = i + 1; j < matchingAntennas.length; j++) {
            antinodes.push({
                key,
                line: matchingAntennas[i].line +
                    (matchingAntennas[i].line - matchingAntennas[j].line),
                col: matchingAntennas[i].col +
                    (matchingAntennas[i].col - matchingAntennas[j].col),
            });
            antinodes.push({
                key,
                line: matchingAntennas[j].line +
                    (matchingAntennas[j].line - matchingAntennas[i].line),
                col: matchingAntennas[j].col +
                    (matchingAntennas[j].col - matchingAntennas[i].col),
            });
        }
    }
}

const validUniqueAntinodes = antinodes.filter((a, idx) =>
    a.col >= 0 && a.line >= 0 && a.col < colCount && a.line < lineCount &&
    antinodes.findIndex((a1) => a1.col === a.col && a1.line === a.line) === idx
);

console.log(validUniqueAntinodes.length);
