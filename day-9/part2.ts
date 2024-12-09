#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

const files = [] as { id: number; length: number }[];
const blocks = [] as ("." | number)[];

for (let i = 0; i < input.length; i++) {
    const length = Number(input[i]);
    if (i % 2 === 0) {
        files.push({ id: i / 2, length });
        blocks.push(...Array(length).fill(i / 2));
    } else {
        blocks.push(...Array(length).fill("."));
    }
}

function getCurrentEmptyBlocks() {
    const emptyBlocks = [] as { startIdx: number; length: number }[];
    let startIdx = blocks.findIndex((b) => b === ".");
    let isEmpty = false;
    for (let i = 0; i <= blocks.length; i++) {
        if (blocks[i] === ".") {
            if (!isEmpty) {
                startIdx = i;
            }
            isEmpty = true;
        } else {
            if (isEmpty) {
                emptyBlocks.push({ startIdx, length: i - startIdx });
                isEmpty = false;
            }
        }
    }
    return emptyBlocks;
}

if (Deno.args.includes("test")) {
    console.log(blocks.join(""));
}

for (const file of files.toReversed()) {
    const firstFileBlockIndex = blocks.findIndex((b) => b === file.id);
    const lastFileBlockIndex = blocks.findLastIndex((b) => b === file.id);
    const emptyBlocks = getCurrentEmptyBlocks();
    if (emptyBlocks.length === 0) {
        break;
    }

    if (Deno.args.includes("test")) {
        console.log({
            blocks: blocks.join(""),
            file,
            firstFileBlockIndex,
            lastFileBlockIndex,
            emptyBlocks,
        });
    }

    const firstMatchingHole = emptyBlocks.find((b) =>
        b.length >= file.length && b.startIdx < firstFileBlockIndex
    );
    if (firstMatchingHole) {
        for (let i = firstFileBlockIndex; i <= lastFileBlockIndex; i++) {
            blocks[i] = ".";
        }
        for (let i = 0; i < file.length; i++) {
            blocks[firstMatchingHole.startIdx + i] = file.id;
        }
    }
}

if (Deno.args.includes("test")) {
    console.log(blocks.join(""));
}

console.log(
    blocks.reduce(
        (checksum: number, fileId, idx) =>
            checksum + (fileId === "." ? 0 : (fileId * idx)),
        0,
    ),
);
