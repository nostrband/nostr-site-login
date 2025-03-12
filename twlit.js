#!/usr/bin/env node

import * as fs from 'fs'
import yargs from 'yargs'
import chalk from 'chalk'

const argv = yargs(process.argv.slice(2))
  .option('input', {
    type: 'string',
    default: 'src/modules/tw/tw.css',
    description: 'Path to the input CSS file',
  })
  .option('output', {
    type: 'string',
    default: 'src/modules/tw/twlit.ts',
    description: 'Path to the output TS file',
  })
  .option('watch', {
    type: 'boolean',
    default: false,
    description: 'Enable watch mode',
  })
  .help().argv

const input = argv.input
const output = argv.output
const watch = argv.watch

console.log(`Reading from file: ${input}`)
console.log(`Writing to file: ${output}`)
console.log(`Watch mode: ${watch}`)

function buildLitFile() {
  try {
    const contents = fs.readFileSync(input, 'utf8')
    let cleanContents = contents.replaceAll('`', '').replaceAll('\\', '\\\\')
    const litContents = `import { css } from "lit"; \n export const TWStyles = css\`${cleanContents}\`;`
    fs.writeFileSync(output, litContents)
    console.log(chalk.green(`Succesfully wrote "TWStyles" to the ${output} file!`))
  } catch (error) {
    console.log(chalk.red(`Failed to process file:`, error))
  }
}

if (watch) fs.watchFile(input, { interval: 1000 }, () => buildLitFile())
else buildLitFile()
