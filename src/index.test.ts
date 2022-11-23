// This file tests the index.ts file for:
// Does the authentication work?
// Does the download work?
// Is the JSON output valid?

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { strictEqual } from 'assert';

const outdir = join(__dirname, 'output');
const jsonFile = join(outdir, 'filters.json');
const yamlFile = join(outdir, 'filters.yaml');

// Run the binary
execSync('node dist/index.js');

// Check that the JSON file exists
strictEqual(existsSync(jsonFile), true);

// Check that the YAML file exists
strictEqual(existsSync(yamlFile), true);

// Check that the JSON file is valid
JSON.parse(readFileSync(jsonFile, 'utf8'));

// Check that the YAML file is valid
require('yaml').parse(readFileSync('yamlFile', 'utf8'));
