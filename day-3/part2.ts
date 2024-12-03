#!/usr/bin/env deno

const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile(
    import.meta.dirname + "/" +
        (Deno.args.includes("test") ? "testinput.txt" : "input.txt"),
);
const input = decoder.decode(data);

const enablementIndexis = [
    { index: 0, enabled: true },
    ...Array.from(input.matchAll(/do\(\)/g)).map((m) => ({
        index: m.index,
        enabled: true,
    })),
    ...Array.from(input.matchAll(/don't\(\)/g)).map((m) => ({
        index: m.index,
        enabled: false,
    })),
].toSorted((a, b) => a.index - b.index);

let sum = 0;
const matches = Array.from(input.matchAll(/mul\(([0-9]{1,3}),([0-9]{1,3})\)/g));
for (const enablementIndex of enablementIndexis) {
    if (!enablementIndex.enabled) {
        continue;
    }
    const low = enablementIndex.index;
    const high = enablementIndexis.find((i) => i.index > low)?.index ??
        Number.MAX_SAFE_INTEGER;
    for (
        const match of matches.filter((m) => m.index > low && m.index < high)
    ) {
        sum += parseInt(match[1], 10) * parseInt(match[2], 10);
    }
}

console.log(sum);
