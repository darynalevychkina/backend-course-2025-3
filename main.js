#!/usr/bin/env node

const fs = require('fs');
const { program } = require('commander');

program
  .requiredOption('-i, --input <file>', 'input file path')
  .option('-o, --output <file>', 'output file path')
  .option('-d, --display', 'display result in console')
  .option('-m, --mfo', 'show MFO code before bank name')
  .option('-n, --normal', 'show only banks with COD_STATE = 1');

program.parse(process.argv);
const options = program.opts();

if (!fs.existsSync(options.input)) {
    console.error('Cannot find input file');
    process.exit(1);
}

let data;
try {
    const raw = fs.readFileSync(options.input);
    data = JSON.parse(raw);
} catch (err) {
    console.error('Error reading input file:', err.message);
    process.exit(1);
}

if (options.normal) {
    data = data.filter(bank => bank.COD_STATE === 1);
}

const result = data.map(bank => {
    const name = `"${bank.NAME}"`;
    return options.mfo ? `${bank.MFO} ${name}` : `${name}`;
}).join('\n');

if (options.display) {
    console.log(result);
}

if (options.output) {
    try {
        fs.writeFileSync(options.output, result, 'utf-8');
    } catch (err) {
        console.error('Error writing output file:', err.message);
        process.exit(1);
    }
}
