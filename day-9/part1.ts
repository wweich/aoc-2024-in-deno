#!/usr/bin/env deno

const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile(
    import.meta.dirname + "/" +
        (Deno.args.includes("test") ? "testinput.txt" : "input.txt"),
);
const input = decoder.decode(data);

const files = [] as { id: number; length: number }[];
const blocks = [] as ("." | number)[];

for (let i = 0; i < input.length; i++) {
    const length = Number(input[i]);
    if (i % 2 === 0) {
        files.push({ id: i / 2, length });
        for (let j = 0; j < length; j++) {
            blocks.push(i / 2);
        }
    } else {
        for (let j = 0; j < length; j++) {
            blocks.push(".");
        }
    }
}

mainloop:
for (const file of files.toReversed()) {
    for (let i = 0; i < file.length; i++) {
        const firstEmptyBlock = blocks.findIndex((b) => b === ".");
        const lastFileBlockIndex = blocks.findLastIndex((b) => b === file.id);
        if (lastFileBlockIndex <= firstEmptyBlock) {
            break mainloop;
        }
        blocks[firstEmptyBlock] = file.id;
        blocks[lastFileBlockIndex] = ".";
    }
}

if (Deno.args.includes("test")) {
    console.log(blocks.join(""));
}

console.log(
    blocks.filter((b) => b !== ".").reduce(
        (checksum, fileId, idx) => checksum + fileId * idx,
        0,
    ),
);
