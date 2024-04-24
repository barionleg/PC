#!/usr/bin/env node

/* Select specific data about elements and write them to a named file.

Use the --help for options and examples.

*/

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ColorCodes = {
    PURPLE: '\x1b[95m',
    CYAN: '\x1b[96m',
    DARKCYAN: '\x1b[36m',
    BLUE: '\x1b[94m',
    GREEN: '\x1b[92m',
    YELLOW: '\x1b[93m',
    RED: '\x1b[91m',
    BOLD: '\x1b[1m',
    UNDERLINE: '\x1b[4m',
    END: '\x1b[0m'
};

const createCommandLineParser = (defaultFile) => {
    const parser = require('commander');

    parser
        .description('Select specific data about elements and write them to a named file.')
        .epilog(`examples:
          Properties written to a json file:
             $ ${path.basename(process.argv[1])} --properties=name,atomic_mass --output name_mass.json

          Properties written to a csv file:
             $ ${path.basename(process.argv[1])} --properties name,atomic_mass --output name_mass.csv

          Properties written into both files ${defaultFile}.json and ${defaultFile}.csv:
             $ ${path.basename(process.argv[1])} --properties=name,atomic_mass

          Union of properties written into both files ${defaultFile}.json and ${defaultFile}.csv:
             $ ${path.basename(process.argv[1])} --properties=name,atomic_mass --interactive

          Select properties interactively and write to files ${defaultFile}.json and ${defaultFile}.csv:
             $ ${path.basename(process.argv[1])} --interactive

        NOTE: output files are written to the directory above ${path.basename(process.argv[1])}.`)
        .option('--properties <P1,...>', 'comma separated list of properties')
        .option('--interactive', 'whether to interactively select data')
        .option('--output [FILENAME]', `where to output the data (default: ${defaultFile}.{json,csv})`, defaultFile);

    return parser;
};

const readPeriodicTable = () => {
    const elements = require(path.join(__dirname, '..', 'PeriodicTable.json')).elements;
    const keys = Object.keys(elements[0]);
    return [elements, keys];
};

const parseProperties = (dataNeeded, args, keys) => {
    const showBad = (pval) => {
        console.log(`${ColorCodes.RED}Property ${ColorCodes.BLUE}${pval}${ColorCodes.RED} not found.${ColorCodes.END}`);
    };

    const showGood = (pval) => {
        console.log(`${ColorCodes.GREEN}Property ${ColorCodes.BLUE}${pval}${ColorCodes.GREEN} found.${ColorCodes.END}`);
    };

    const props = new Set(args.properties.split(','));
    const keysAsSet = new Set(keys);
    const bad = new Set([...props].filter(x => !keysAsSet.has(x)));
    const good = new Set([...props].filter(x => keysAsSet.has(x)));

    for (const pval of bad) {
        showBad(pval);
    }
    for (const pval of good) {
        showGood(pval);
    }

    for (const k of good) {
        dataNeeded[k] = true;
    }

    return dataNeeded;
};

const parseInteractive = (dataNeeded, keys) => {
    const showSelected = () => {
        console.log(`${ColorCodes.BOLD}${ColorCodes.GREEN}${Object.keys(dataNeeded).length} Option(s) Selected ${ColorCodes.END}${ColorCodes.UNDERLINE}${Object.keys(dataNeeded)}${ColorCodes.END}`);
    };

    const showNext = (key) => {
        console.log(`Do you need ${ColorCodes.BOLD}${ColorCodes.BLUE}${key}${ColorCodes.END}?`);
    };

    const defaultInput = (prompt, defaultValue = 'y') => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question(prompt, (answer) => {
                rl.close();
                resolve(answer || defaultValue);
            });
        });
    };

    const selectNext = async () => {
        const prompt = `${ColorCodes.GREEN}y/${ColorCodes.RED}n/${ColorCodes.BLUE}q(uit)${ColorCodes.END}[${ColorCodes.PURPLE}default: ${ColorCodes.GREEN}y${ColorCodes.END}]: `;
        return await defaultInput(prompt);
    };

    const clear = () => {
        console.clear();
    };

    clear();
    for (const key of keys) {
        if (key in dataNeeded) {
            continue;
        }
        let done = false;
        while (true) {
            showSelected();
            showNext(key);
            const needed = await selectNext();
            if (needed === 'y') {
                dataNeeded[key] = true;
                break;
            }
            if (needed === 'n') {
                break;
            }
            if (needed === 'q') {
                done = true;
                break;
            }
            console.log('Invalid input');
            continue;
        }
        if (done) {
            break;
        }
        clear();
    }

    return dataNeeded;
};

const saveToFile = (args, elements, dataNeeded, defaultFile) => {
    const writeCsv = (output, elements, dataNeeded) => {
        const elemToWrite = [];
        elemToWrite.push(Object.keys(dataNeeded).join(','));

        for (const element of elements) {
            let elmnt = '';
            for (const key in dataNeeded) {
                if (dataNeeded[key]) {
                    elmnt += `${element[key]},`;
                }
            }
            if (elmnt.endsWith(',')) {
                elmnt = elmnt.slice(0, -1);
            }
            elemToWrite.push(elmnt);
        }

        fs.writeFileSync(path.join(__dirname, '..', `${output}.csv`), elemToWrite.join('\n') + '\n');
    };

    const writeJson = (output, elements, dataNeeded) => {
        const elemToWrite = [];

        for (const element of elements) {
            const elmnt = {};
            for (const key in dataNeeded) {
                if (dataNeeded[key]) {
                    elmnt[key] = element[key];
                }
            }
            elemToWrite.push(elmnt);
        }

        fs.writeFileSync(path.join(__dirname, '..', `${output}.json`), JSON.stringify(elemToWrite, null, 4) + '\n');
    };

    if (!args.output || args.output === defaultFile) {
        writeJson(defaultFile, elements, dataNeeded);
        writeCsv(defaultFile, elements, dataNeeded);
    } else {
        const output = args.output.replace('.json', '').replace('.csv', '');
        if (args.output.toLowerCase().includes('json')) {
            writeJson(output, elements, dataNeeded);
        }
        if (args.output.toLowerCase().includes('csv')) {
            writeCsv(output, elements, dataNeeded);
        }
    }
};

const main = () => {
    const defaultFile = 'SpecificData';
    const parser = createCommandLineParser(defaultFile);

    parser.parse(process.argv);

    const args = parser.opts();
    const [elements, keys] = readPeriodicTable();

    const dataNeeded = {};
    if (args.properties) {
        parseProperties(dataNeeded, args, keys);
    }
    if (args.interactive) {
        parseInteractive(dataNeeded, keys);
    }
    if (Object.keys(dataNeeded).length > 0) {
        saveToFile(args, elements, dataNeeded, defaultFile);
    } else {
        console.log(`${ColorCodes.RED}No properties selected.${ColorCodes.END}`);
    }
};

main();


