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
    if (matchingAntennas.length < 2) {
        continue;
    }
    antinodes.push(...matchingAntennas);
    for (let i = 0; i < matchingAntennas.length; i++) {
        for (let j = i + 1; j < matchingAntennas.length; j++) {
            const antenna1 = matchingAntennas[i];
            const antenna2 = matchingAntennas[j];
            let factor = 1;
            while (true) {
                const antinode1 = {
                    key,
                    line: antenna1.line +
                        ((antenna1.line - antenna2.line) * factor),
                    col: antenna1.col +
                        ((antenna1.col - antenna2.col) * factor),
                };
                const antinode2 = {
                    key,
                    line: antenna2.line +
                        ((antenna2.line - antenna1.line) * factor),
                    col: antenna2.col +
                        ((antenna2.col - antenna1.col) * factor),
                };
                const antinode1Valid = antinode1.col >= 0 &&
                    antinode1.line >= 0 && antinode1.col < colCount &&
                    antinode1.line < lineCount;
                const antinode2Valid = antinode2.col >= 0 &&
                    antinode2.line >= 0 &&
                    antinode2.col < colCount && antinode2.line < lineCount;
                if (!(antinode1Valid || antinode2Valid)) {
                    break;
                }
                if (antinode1Valid) {
                    antinodes.push(antinode1);
                }
                if (antinode2Valid) {
                    antinodes.push(antinode2);
                }
                factor++;
            }
        }
    }
}

const validUniqueAntinodes = antinodes.filter((a, idx) =>
    a.col >= 0 && a.line >= 0 && a.col < colCount && a.line < lineCount &&
    antinodes.findIndex((a1) => a1.col === a.col && a1.line === a.line) === idx
);

console.log(validUniqueAntinodes.length);
