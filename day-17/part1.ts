#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${
        Deno.args.includes("test") ? "testinput.txt" : "input.txt"
    }`,
);

const lines = input.trim().split("\n");

const registers = { "A": 0, "B": 0, "C": 0 } as Record<"A" | "B" | "C", number>;

const program = [] as number[];

for (const line of lines) {
    if (line.startsWith("Program:")) {
        program.push(
            ...line.slice("Program:".length).trim().split(",").map(Number),
        );
    } else {
        const match = /Register (.): ([0-9]+)/.exec(line);
        if (match) {
            registers[match[1] as "A" | "B" | "C"] = Number(match[2]);
        }
    }
}
console.log("start", { program, registers });

function comboOperand(operand: number): number {
    switch (operand) {
        case 0:
            return 0;
        case 1:
            return 1;
        case 2:
            return 2;
        case 3:
            return 3;
        case 4:
            return registers["A"];
        case 5:
            return registers["B"];
        case 6:
            return registers["C"];
    }
    throw Error("invalid operand");
}

let instructionPointer = 0;

const output = [] as number[];

function operation(opcode: number, operand: number) {
    switch (opcode) {
        case 0: // adv
            registers["A"] = Math.floor(
                registers["A"] / (Math.pow(2, comboOperand(operand))),
            );
            break;
        case 1: // bxl
            registers["B"] = registers["B"] ^ operand;
            break;
        case 2: // bst
            registers["B"] = comboOperand(operand) % 8;
            break;
        case 3: // jnz
            if (registers["A"] !== 0) {
                instructionPointer = operand;
                return;
            }
            break;
        case 4: // bxc
            registers["B"] = registers["B"] ^ registers["C"];
            break;
        case 5: // out
            output.push(comboOperand(operand) % 8);
            break;
        case 6: // bdv
            registers["B"] = Math.floor(
                registers["A"] / (Math.pow(2, comboOperand(operand))),
            );
            break;
        case 7: // cdv
            registers["C"] = Math.floor(
                registers["A"] / (Math.pow(2, comboOperand(operand))),
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

run();

console.log("end", { registers, output });
console.log(output.join(","));
