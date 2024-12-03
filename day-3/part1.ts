#!/usr/bin/env deno

const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile(
    import.meta.dirname + "/" +
        (Deno.args.includes("test") ? "testinput.txt" : "input.txt"),
);
const input = decoder.decode(data);

let sum = 0;
const matches = input.matchAll(/mul\(([0-9]{1,3}),([0-9]{1,3})\)/g);
for (const match of matches) {
    sum += parseInt(match[1], 10) * parseInt(match[2], 10);
}

console.log(sum);
