// bump-version.js
const fs = require('fs');
const path = './public/version.json';

function bumpVersion(version) {
  const parts = version.split('.').map(Number);
  parts[2]++; // Increment patch version (e.g. 1.0.1 → 1.0.2)
  return parts.join('.');
}

const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const newVersion = bumpVersion(data.version);

data.version = newVersion;
fs.writeFileSync(path, JSON.stringify(data, null, 2));

console.log('Version bumped to:', newVersion);
