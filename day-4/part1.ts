#!/usr/bin/env deno

const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile(
    import.meta.dirname + "/" +
        (Deno.args.includes("test") ? "testinput.txt" : "input.txt"),
);
const input = decoder.decode(data);

const lines = input.split("\n").filter((l) => l.trim());
const colCount = lines[0].length;
const lineCount = lines.length;

let count = 0;

for (let line = 0; line < lineCount; line++) {
    for (let col = 0; col < colCount; col++) {
        if (lines[line][col] === "X") {
            if (
                /* horizontal, left to right */
                lines[line][col + 1] === "M" &&
                lines[line][col + 2] === "A" &&
                lines[line][col + 3] === "S"
            ) {
                count++;
            }

            if (
                /* horizontal, right to left */
                lines[line][col - 1] === "M" &&
                lines[line][col - 2] === "A" &&
                lines[line][col - 3] === "S"
            ) {
                count++;
            }

            if (
                /* vertical, top to bottom */
                lines[line + 1]?.[col] === "M" &&
                lines[line + 2]?.[col] === "A" &&
                lines[line + 3]?.[col] === "S"
            ) {
                count++;
            }

            if (
                /* diagonal, left to right, top to bottom */
                lines[line + 1]?.[col + 1] === "M" &&
                lines[line + 2]?.[col + 2] === "A" &&
                lines[line + 3]?.[col + 3] === "S"
            ) {
                count++;
            }

            if (
                /* diagonal, right to left, top to bottom */
                lines[line + 1]?.[col - 1] === "M" &&
                lines[line + 2]?.[col - 2] === "A" &&
                lines[line + 3]?.[col - 3] === "S"
            ) {
                count++;
            }

            if (
                /* vertical, bottom to top */
                lines[line - 1]?.[col] === "M" &&
                lines[line - 2]?.[col] === "A" &&
                lines[line - 3]?.[col] === "S"
            ) {
                count++;
            }

            if (
                /* diagonal, left to right, bottom to top */
                lines[line - 1]?.[col + 1] === "M" &&
                lines[line - 2]?.[col + 2] === "A" &&
                lines[line - 3]?.[col + 3] === "S"
            ) {
                count++;
            }

            if (
                /* diagonal, right to left, bottom to top */
                lines[line - 1]?.[col - 1] === "M" &&
                lines[line - 2]?.[col - 2] === "A" &&
                lines[line - 3]?.[col - 3] === "S"
            ) {
                count++;
            }
        }
    }
}

console.log(count);
