#!/usr/bin/env deno

const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile(import.meta.dirname + "/input.txt");
const input = decoder.decode(data);

const list1 = [] as number[];
const list2 = [] as number[];
for (const line of input.split("\n").filter((l) => !!l.trim())) {
    const [item1, item2] = line.trim().split(" ").filter((p) => !!p).map((p) =>
        parseInt(p, 10)
    );
    list1.push(item1);
    list2.push(item2);
}

const similarityScores = [];

for (let i = 0; i < list1.length; i++) {
    similarityScores.push(
        list2.filter((p) => p === list1[i]).length * list1[i],
    );
}

const similarityScore = similarityScores.reduce((sum, cur) => sum + cur, 0);

console.log(similarityScore);
