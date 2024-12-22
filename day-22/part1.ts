#!/usr/bin/env deno

const input = await Deno.readTextFile(
    `${import.meta.dirname}/${Deno.args.includes('test') ? 'testinput.txt' : 'input.txt'}`,
);

const lines = input.trim().split('\n');

function mix(secret: bigint, value: bigint) {
    return secret ^ value;
}
function prune(secret: bigint) {
    return secret % 16777216n;
}

function newSecret(secret: bigint) {
    const step1 = prune(mix(secret, secret * 64n));
    const step2 = prune(mix(step1, BigInt(step1 / 32n)));
    return prune(mix(step2, step2 * 2048n));
}

const initialSecrets = lines.map((line) => BigInt(line));

let result = 0n;
for (let secret of initialSecrets) {
    if (Deno.args.includes('test')) {
        console.log('calculating 2000 iterations for secret', secret);
    }
    for (let i = 0; i < 2000; i++) {
        secret = newSecret(secret);
    }
    result += secret;
}
console.log(result);
