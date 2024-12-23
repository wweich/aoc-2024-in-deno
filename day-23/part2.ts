#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${Deno.args.includes('test') ? 'testinput.txt' : 'input.txt'}`,
);

const lines = input.trim().split('\n');

class Graph<T> {
    adjList = new Map<T, Set<T>>();

    constructor(edges: [T, T][] = []) {
        edges.forEach(([a, b]) => this.addEdge(a, b));
    }

    addEdge(v: T, w: T) {
        if (!this.adjList.has(v)) {
            this.adjList.set(v, new Set<T>());
        }
        this.adjList.get(v)!.add(w);
        if (!this.adjList.has(w)) {
            this.adjList.set(w, new Set<T>());
        }
        this.adjList.get(w)!.add(v);
    }

    cliques(sizeSort: 'asc' | 'desc' | null = null) {
        const result = Array.from(this.#cliques());
        if (sizeSort === 'desc') {
            result.sort((a, b) => b.size - a.size);
        } else if (sizeSort === 'asc') {
            result.sort((a, b) => a.size - b.size);
        }
        return result.map((q) => Array.from(q));
    }

    /**
     * Bron–Kerbosch
     */
    *#cliques(
        clique = new Set<T>(),
        remaining: Set<T> = new Set(this.adjList.keys()),
        skip = new Set<T>(),
    ): IterableIterator<Set<T>> {
        if (remaining.size === 0 && skip.size === 0) {
            yield clique;
            return;
        }
        for (const r of remaining) {
            yield* this.#cliques(
                new Set([...clique, r]),
                remaining.intersection(this.adjList.get(r)!),
                skip.intersection(this.adjList.get(r)!),
            );
            remaining.delete(r);
            skip.add(r);
        }
    }
}

const graph = new Graph<string>(lines.map((l) => l.split('-') as [string, string]));

const cliques = graph.cliques('desc');
console.log(cliques[0].toSorted().join(','));
