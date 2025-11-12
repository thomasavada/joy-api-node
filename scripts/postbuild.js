#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist/index.js');
let content = fs.readFileSync(indexPath, 'utf8');

// Add CommonJS default export support at the end of the file
const commonJSExport = `
// Support CommonJS default import: const JoyApi = require('joy-api-node')
module.exports = joy_api_1.JoyApi;
// Preserve named exports
Object.assign(module.exports, exports);
`;

// Replace the last line (exports.default = ...) with our enhanced version
content = content.replace(
  /exports\.default = joy_api_1\.JoyApi;\s*$/m,
  commonJSExport.trim()
);

fs.writeFileSync(indexPath, content);
console.log('✓ Post-build: Added CommonJS default export support');