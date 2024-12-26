#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${Deno.args.includes('test') ? 'testinput.txt' : 'input.txt'}`,
);

type Gate = { inputs: [string, string]; op: 'OR' | 'XOR' | 'AND'; output: string };

const [_, gateStrings] = input.trim().split('\n\n').map((i) => i.split('\n'));

const gates = [] as Gate[];
for (const gateString of gateStrings) {
    const match = /(.*) (OR|XOR|AND) (.*) -> (.*)/.exec(gateString);
    gates.push({ inputs: [match![1], match![3]], op: match![2] as 'OR' | 'XOR' | 'AND', output: match![4] });
}

const count = Number(gates.filter((g) => g.output.startsWith('z')).map((g) => g.output).sort().reverse()[0].slice(1));

const faulty = [] as string[];
for (let i = 0; i < count; i++) {
    const padded = i.toString().padStart(2, '0');
    const xy = [`x${padded}`, `y${padded}`];

    const xyXor = gates.find((g) => g.inputs.every((input) => xy.includes(input)) && g.op === 'XOR');
    const xyAnd = gates.find((g) => g.inputs.every((input) => xy.includes(input)) && g.op === 'AND');
    const zOut = gates.find((g) => g.output === `z${padded}`);

    if (xyXor === undefined || xyAnd === undefined || zOut === undefined) {
        continue;
    }

    if (zOut.op !== 'XOR') {
        faulty.push(zOut.output);
    }

    // xyAnd must go to an OR (besides the first one, as it starts the carry flag)
    if (i > 0 && gates.find((g) => g.inputs.includes(xyAnd.output) && g.op !== 'OR')) {
        faulty.push(xyAnd.output);
    }

    // the xyXOR must only to go to XOR or AND
    if (gates.find((g) => g.inputs.includes(xyXor.output) && g.op === 'OR')) {
        faulty.push(xyXor.output);
    }
}

// each XOR must have x and y as input or z as output
faulty.push(
    ...gates.filter((g) =>
        g.op === 'XOR' && !(
            g.inputs.every((input) => input.startsWith('x') || input.startsWith('y')) ||
            g.output.startsWith('z')
        )
    ).map((g) => g.output),
);

console.log(faulty.sort().join(','));
