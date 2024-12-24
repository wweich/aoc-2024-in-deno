#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${Deno.args.includes('test') ? 'testinput.txt' : 'input.txt'}`,
);

type Gate = { sources: [string, string]; op: 'OR' | 'XOR' | 'AND'; target: string };

const [initialWires, gateStrings] = input.trim().split('\n\n').map((i) => i.split('\n'));

const wires = new Map<string, 0 | 1>(initialWires.map((w) => {
    const [name, value] = w.split(':');
    return [name, Number(value)] as [string, 0 | 1];
}));

const gates = [] as Gate[];
for (const gateString of gateStrings) {
    const match = /(.*) (OR|XOR|AND) (.*) -> (.*)/.exec(gateString);
    gates.push({ sources: [match![1], match![3]], op: match![2] as 'OR' | 'XOR' | 'AND', target: match![4] });
}

function gateOperation(gate: Gate): 0 | 1 | null {
    let result = null;
    if (!gate.sources.every((s) => wires.has(s))) {
        return result;
    }
    switch (gate.op) {
        case 'AND':
            result = gate.sources.every((s) => wires.get(s) === 1);
            break;
        case 'OR':
            result = gate.sources.some((s) => wires.get(s) === 1);
            break;
        case 'XOR':
            result = gate.sources.filter((s) => wires.get(s) === 1).length === 1 &&
                gate.sources.filter((s) => wires.get(s) === 0).length === 1;
            break;
    }
    return result ? 1 : 0;
}

if (Deno.args.includes('test')) {
    console.log({ wires, gates });
}

while (gates.length > 0) {
    const gate = gates.shift()!;
    const result = gateOperation(gate);
    if (result === null) {
        gates.push(gate);
        continue;
    }
    wires.set(gate.target, result);
}

if (Deno.args.includes('test')) {
    console.log(wires);
}

const zWires = wires.entries().filter(([name]) => name.startsWith('z')).toArray().sort().reverse();
console.log(parseInt(zWires.map((z) => z[1]).join(''), 2));
