#!/usr/bin/env deno

const start = new Date();

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${Deno.args.includes('test') ? 'testinput.txt' : 'input.txt'}`,
);

const lines = input.trim().split('\n');

type Position = { x: number; y: number };
type ButtonMap = { [key: string]: Position };

const BFS_DIRECTIONS = {
    '^': { x: 0, y: -1 },
    '>': { x: 1, y: 0 },
    'v': { x: 0, y: 1 },
    '<': { x: -1, y: 0 },
};

const numPadMap = `
789
456
123
X0A
`.trim().split('\n').map((l) => l.split(''));

const arrowPadMap = `
X^A
<v>
`.trim().split('\n').map((l) => l.split(''));

function getButtons(map: string[][]): ButtonMap {
    return map.flatMap((itm, y) => itm.map((btn, x) => ({ x, y, btn }))).reduce(
        (obj, itm) => {
            const { x, y } = itm;
            return { ...obj, [itm.btn]: { x, y } };
        },
        {},
    );
}

const numPadButtons = getButtons(numPadMap);
const arrowPadButtons = getButtons(arrowPadMap);

function getPaths(start: string, end: string, buttons: ButtonMap): string[] {
    const queue = [{ ...buttons[start], path: '' }] as (Position & { path: string })[];
    const validPaths = [] as string[];
    const endPos = buttons[end];
    const visited = new Map<string, number>();

    if (start === end) return ['A'];

    while (queue.length > 0) {
        queue.sort((a, b) => a.path.length - b.path.length);
        const current = queue.shift()!;

        if (current.x === endPos.x && current.y == endPos.y) {
            validPaths.push(current.path + 'A');
        }

        const visitkey = `${current.x}|${current.y}`;
        if (visited.has(visitkey) && visited.get(visitkey)! < current.path.length) {
            continue;
        }

        Object.entries(BFS_DIRECTIONS).forEach(([direction, vector]) => {
            const newPos = { x: current.x + vector.x, y: current.y + vector.y };

            if (buttons.X.x === newPos.x && buttons.X.y === newPos.y) {
                // Gap
                return;
            }

            if (!Object.values(buttons).find((b) => b.x === newPos.x && b.y === newPos.y)) {
                // not a button
                return;
            }

            const visitkey = `${newPos.x}|${newPos.y}`;
            if (visited.has(visitkey) && visited.get(visitkey)! < current.path.length + 1) {
                // previousely visited with lower length
                return;
            }
            visited.set(visitkey, current.path.length + 1);
            queue.push({ ...newPos, path: current.path + direction });
        });
    }
    return validPaths.sort((a, b) => a.length - b.length); //.map((s) => s.slice(1));
}

function getKeyPresses(
    code: string,
    buttons: ButtonMap = numPadButtons,
    robot: number = 2,
): number {
    let current = 'A';
    let length = 0;
    for (let i = 0; i < code.length; i++) {
        const moves = getPaths(current, code[i], buttons);
        if (robot === 0) {
            length += moves[0].length;
        } else {
            length += Math.min(...moves.map((move) => getKeyPresses(move, arrowPadButtons, robot - 1)));
        }
        current = code[i];
    }
    return length;
}

const total = lines.reduce(
    (sum, code) => {
        const codeNumber = Number(code.split('').filter((c) => !isNaN(Number(c))).join(''));
        const keyPresses = getKeyPresses(code);
        Deno.args.includes('test') && console.log(code, keyPresses, '*', codeNumber, '=', codeNumber * keyPresses);
        return sum + codeNumber * keyPresses;
    },
    0,
);

Deno.args.includes('test') &&
    console.log('--------------------------------------------------------------------------------');
console.log(total);
Deno.args.includes('test') &&
    console.log('--------------------------------------------------------------------------------');
console.log('runtime', +new Date() - +start, 'ms');
