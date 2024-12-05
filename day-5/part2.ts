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

const incorrectPrintJobs = [];

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
            incorrectPrintJobs.push(pages);
            continue mainloop;
        }
        if (
            pagesAfter.some((pa) =>
                orderings.filter((o) => o[0] === pa && o[1] === pages[i])
                    .length > 0
            )
        ) {
            incorrectPrintJobs.push(pages);
            continue mainloop;
        }
    }
}

for (const pages of incorrectPrintJobs) {
    while (
        pages.some((page, idx) =>
            orderings.some((o) =>
                o[1] === pages[idx] && o[0] === pages[idx + 1]
            )
        )
    ) {
        for (let i = 0; i < pages.length - 1; i++) {
            if (
                orderings.some((o) =>
                    o[1] === pages[i] && o[0] === pages[i + 1]
                )
            ) {
                const tmp = pages[i];
                pages[i] = pages[i + 1];
                pages[i + 1] = tmp;
            }
        }
    }
    sum += pages[(pages.length - 1) / 2];
}

console.log(sum);
