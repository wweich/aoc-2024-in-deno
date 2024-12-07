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
    for (let i = 0; i < Math.pow(3, line.values.length - 1); i++) {
        const bitmask = i.toString(3).padStart(line.values.length - 1, "0");
        const bitArray = bitmask.split("").map((p) => parseInt(p, 10));
        let sum = line.values[0];
        for (let j = 0; j < bitArray.length; j++) {
            if (bitArray[j] === 0) {
                sum *= line.values[j + 1];
            } else if (bitArray[j] === 1) {
                sum += line.values[j + 1];
            } else {
                sum = parseInt(`${sum}${line.values[j + 1]}`, 10);
            }
        }
        if (sum === line.testValue) {
            correctLines.push(line);
            break;
        }
    }
}

console.log(correctLines.reduce((sum, line) => sum + line.testValue, 0));
