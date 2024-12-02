#!/usr/bin/env deno

const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile(import.meta.dirname + "/input.txt");
const input = decoder.decode(data);

const reports = input.split("\n").filter((l) => !!l.trim()).map((line) =>
    line.split(" ").map((lvl) => parseInt(lvl, 10))
);

let safeReportCount = 0;

mainloop:
for (const report of reports) {
    const isIncreasing = report[1] > report[0];
    for (let i = 1; i < report.length; i++) {
        if (![1, 2, 3].includes(Math.abs(report[i] - report[i - 1]))) {
            continue mainloop;
        }
        if (isIncreasing) {
            if (report[i] <= report[i - 1]) {
                continue mainloop;
            }
        } else {
            if (report[i] >= report[i - 1]) {
                continue mainloop;
            }
        }
    }
    safeReportCount++;
}

console.log(safeReportCount);
