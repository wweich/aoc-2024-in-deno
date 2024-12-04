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
        if (lines[line][col] === "A") {
            /*
            M · M
            · A ·
            S · S
            */
            if (
                lines[line - 1]?.[col - 1] === "M" &&
                lines[line - 1]?.[col + 1] === "M" &&
                lines[line + 1]?.[col - 1] === "S" &&
                lines[line + 1]?.[col + 1] === "S"
            ) {
                count++;
            }

            /*
            M · S
            · A ·
            M · S
            */
            if (
                lines[line - 1]?.[col - 1] === "M" &&
                lines[line - 1]?.[col + 1] === "S" &&
                lines[line + 1]?.[col - 1] === "M" &&
                lines[line + 1]?.[col + 1] === "S"
            ) {
                count++;
            }

            /*
            S · M
            · A ·
            S · M
            */
            if (
                lines[line - 1]?.[col - 1] === "S" &&
                lines[line - 1]?.[col + 1] === "M" &&
                lines[line + 1]?.[col - 1] === "S" &&
                lines[line + 1]?.[col + 1] === "M"
            ) {
                count++;
            }

            /*
            S · S
            · A ·
            M · M
            */
            if (
                lines[line - 1]?.[col - 1] === "S" &&
                lines[line - 1]?.[col + 1] === "S" &&
                lines[line + 1]?.[col - 1] === "M" &&
                lines[line + 1]?.[col + 1] === "M"
            ) {
                count++;
            }
        }
    }
}

console.log(count);
