#!/usr/bin/env deno

const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile(
    import.meta.dirname + "/" +
        (Deno.args.includes("test") ? "testinput.txt" : "input.txt"),
);
const input = decoder.decode(data);

const lines = input.split("\n").filter((l) => !!l.trim());

const lineData = lines.map((l) => {
    const split = l.split(":").map((p) => p.trim());
    return {
        testValue: parseInt(split[0], 10),
        values: split[1].split(" ").map((p) => parseInt(p.trim(), 10)),
    };
});

const correctLines = [];

for (const line of lineData) {
    for (let i = 0; i < Math.pow(2, line.values.length - 1); i++) {
        const bitmask = i.toString(2).padStart(line.values.length - 1, "0");
        const bitArray = bitmask.split("").map((p) => p === "1");
        let sum = line.values[0];
        for (let j = 0; j < bitArray.length; j++) {
            if (bitArray[j]) {
                sum *= line.values[j + 1];
            } else {
                sum += line.values[j + 1];
            }
        }
        if (sum === line.testValue) {
            correctLines.push(line);
            break;
        }
    }
}

console.log(correctLines.reduce((sum, line) => sum + line.testValue, 0));
