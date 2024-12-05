#!/usr/bin/env deno

const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile(
    import.meta.dirname + "/" +
        (Deno.args.includes("test") ? "testinput.txt" : "input.txt"),
);
const input = decoder.decode(data);

const lines = input.split("\n").map((l) => l.trim()).filter((l) => !!l);
const orderings = lines.filter((l) => l.includes("|")).map((l) =>
    l.split("|").map((n) => parseInt(n, 10))
);
const printJobs = lines.filter((l) => l.includes(",")).map((l) =>
    l.split(",").map((n) => parseInt(n, 10))
);

let sum = 0;

mainloop:
for (const pages of printJobs) {
    for (let i = 0; i < pages.length; i++) {
        const pagesBefore = pages.slice(0, i);
        const pagesAfter = pages.slice(i + 1);
        if (
            pagesBefore.some((pb) =>
                orderings.filter((o) => o[1] === pb && o[0] === pages[i])
                    .length > 0
            )
        ) {
            continue mainloop;
        }
        if (
            pagesAfter.some((pa) =>
                orderings.filter((o) => o[0] === pa && o[1] === pages[i])
                    .length > 0
            )
        ) {
            continue mainloop;
        }
    }
    sum += pages[(pages.length - 1) / 2];
}

console.log(sum);
