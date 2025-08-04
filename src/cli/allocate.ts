#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { allocateDiscounts } from '../utils/allocationEngine';
import { DiscountInput } from '../types';

/**
 * CLI tool for running the discount allocation engine
 * 
 * Usage:
 * ts-node src/cli/allocate.ts <input-file> [output-file]
 * 
 * Example:
 * ts-node src/cli/allocate.ts src/data/sample-input.json output.json
 */

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Error: Input file is required');
  console.log('Usage: ts-node src/cli/allocate.ts <input-file> [output-file]');
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1];

// Read and parse input file
try {
  const inputPath = path.resolve(process.cwd(), inputFile);
  const inputData = fs.readFileSync(inputPath, 'utf8');
  const input: DiscountInput = JSON.parse(inputData);
  
  // Run allocation engine
  const result = allocateDiscounts(input);
  
  // Output results
  if (outputFile) {
    const outputPath = path.resolve(process.cwd(), outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`Results written to ${outputPath}`);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}