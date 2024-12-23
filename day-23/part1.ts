#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${Deno.args.includes('test') ? 'testinput.txt' : 'input.txt'}`,
);

const lines = input.trim().split('\n');

class Graph {
    adjList: Map<string, string[]>;
    constructor() {
        this.adjList = new Map<string, string[]>();
    }
    addEdge(v: string, w: string) {
        if (!this.adjList.has(v)) {
            this.adjList.set(v, []);
        }
        this.adjList.get(v)!.push(w);
        if (!this.adjList.has(w)) {
            this.adjList.set(w, []);
        }
        this.adjList.get(w)!.push(v);
    }
}

const graph = new Graph();
for (const connection of lines.map((l) => l.split('-').sort((a, b) => a.localeCompare(b)))) {
    graph.addEdge(connection[0], connection[1]);
}

if (Deno.args.includes('test')) {
    console.log(graph.adjList);
}

const trippleConnections = new Set<string>();

for (const c of graph.adjList.keys()) {
    const firstLevelNeighbours = graph.adjList.get(c)!.values().toArray();
    for (const c1 of firstLevelNeighbours) {
        const secondLevelNeighbours = graph.adjList.get(c1)!.values().toArray();
        for (const c2 of secondLevelNeighbours.filter((n) => n !== c && firstLevelNeighbours.includes(n))) {
            trippleConnections.add(
                new Set<string>([c, c1, c2]).values().toArray().toSorted((a, b) => a.localeCompare(b)).join(','),
            );
        }
    }
}
if (Deno.args.includes('test')) {
    console.log(trippleConnections);
    console.log(trippleConnections.values().filter((t) => /^t|,t/.test(t)).toArray());
}
console.log(trippleConnections.values().filter((t) => /^t|,t/.test(t)).toArray().length);
