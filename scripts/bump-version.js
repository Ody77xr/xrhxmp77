/**
 * Version bumping utility
 * Usage: npm run version:patch | version:minor | version:major
 */

const fs = require('fs');
const path = require('path');

const bumpType = process.argv[2] || 'patch';

// Read cache-buster.js
const cacheBusterPath = path.join(__dirname, '..', 'cache-buster.js');
let content = fs.readFileSync(cacheBusterPath, 'utf8');

// Extract current version
const versionMatch = content.match(/const APP_VERSION = '(\d+)\.(\d+)\.(\d+)';/);
if (!versionMatch) {
    console.error('❌ Could not find version in cache-buster.js');
    process.exit(1);
}

let [, major, minor, patch] = versionMatch.map(Number);

// Bump version based on type
switch (bumpType) {
    case 'major':
        major++;
        minor = 0;
        patch = 0;
        break;
    case 'minor':
        minor++;
        patch = 0;
        break;
    case 'patch':
    default:
        patch++;
        break;
}

const newVersion = `${major}.${minor}.${patch}`;

// Update cache-buster.js
content = content.replace(
    /const APP_VERSION = '[^']+';/,
    `const APP_VERSION = '${newVersion}';`
);

fs.writeFileSync(cacheBusterPath, content, 'utf8');

console.log(`\n✅ Version bumped: ${versionMatch[0].match(/'([^']+)'/)[1]} → ${newVersion}`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Review changes`);
console.log(`   2. Run: npm run build`);
console.log(`   3. Run: npm run deploy`);
console.log(`\n🚀 Users will automatically get the new version!\n`);
