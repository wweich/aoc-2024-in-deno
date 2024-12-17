#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

const lines = input.trim().split("\n");

const registers = { "A": 0n, "B": 0n, "C": 0n } as Record<
    "A" | "B" | "C",
    bigint
>;

const program = [] as bigint[];

for (const line of lines) {
    if (line.startsWith("Program:")) {
        program.push(
            ...line.slice("Program:".length).trim().split(",").map(BigInt),
        );
    } else {
        const match = /Register (.): ([0-9]+)/.exec(line);
        if (match) {
            registers[match[1] as "A" | "B" | "C"] = BigInt(match[2]);
        }
    }
}

const origRegisters = structuredClone(registers);

function comboOperand(operand: bigint): bigint {
    switch (operand) {
        case 0n:
            return 0n;
        case 1n:
            return 1n;
        case 2n:
            return 2n;
        case 3n:
            return 3n;
        case 4n:
            return registers["A"];
        case 5n:
            return registers["B"];
        case 6n:
            return registers["C"];
    }
    throw Error("invalid operand");
}

let instructionPointer = 0;

const output = [] as bigint[];

function operation(opcode: bigint, operand: bigint) {
    switch (opcode) {
        case 0n: // adv
            registers["A"] = BigInt(
                registers["A"] / (2n ** comboOperand(operand)),
            );
            break;
        case 1n: // bxl
            registers["B"] = registers["B"] ^ operand;
            break;
        case 2n: // bst
            registers["B"] = comboOperand(operand) % 8n;
            break;
        case 3n: // jnz
            if (registers["A"] !== 0n) {
                instructionPointer = Number(operand);
                return;
            }
            break;
        case 4n: // bxc
            registers["B"] = registers["B"] ^ registers["C"];
            break;
        case 5n: // out
            output.push(comboOperand(operand) % 8n);
            break;
        case 6n: // bdv
            registers["B"] = BigInt(
                registers["A"] / (2n ** comboOperand(operand)),
            );
            break;
        case 7n: // cdv
            registers["C"] = BigInt(
                registers["A"] / (2n ** comboOperand(operand)),
            );
            break;
    }
    instructionPointer += 2;
}

function run() {
    while (instructionPointer < program.length) {
        operation(program[instructionPointer], program[instructionPointer + 1]);
    }
}

function findAValue(val = 0n, i = program.length - 1): bigint {
    if (i < 0) {
        return val;
    }
    for (let a = val << 3n; a < (val << 3n) + 8n; a++) {
        instructionPointer = 0;
        output.length = 0;
        registers["A"] = a;
        registers["B"] = origRegisters["B"];
        registers["C"] = origRegisters["C"];
        run();
        if (output[0] === program[i]) {
            const result = findAValue(a, i - 1);
            if (result >= 0) {
                return result;
            }
        }
    }
    return -1n;
}

console.log(findAValue());
