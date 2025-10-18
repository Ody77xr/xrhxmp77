/**
 * Pre-deployment script
 * Automatically updates version and prepares for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing for deployment...\n');

// 1. Update build timestamp in cache-buster.js
const cacheBusterPath = path.join(__dirname, '..', 'cache-buster.js');
let cacheBusterContent = fs.readFileSync(cacheBusterPath, 'utf8');

// Update timestamp
const timestamp = Date.now();
cacheBusterContent = cacheBusterContent.replace(
    /const BUILD_TIMESTAMP = \d+;/,
    `const BUILD_TIMESTAMP = ${timestamp};`
);

fs.writeFileSync(cacheBusterPath, cacheBusterContent, 'utf8');
console.log('✓ Updated build timestamp:', timestamp);

// 2. Extract current version
const versionMatch = cacheBusterContent.match(/const APP_VERSION = '([^']+)';/);
const currentVersion = versionMatch ? versionMatch[1] : 'unknown';
console.log('✓ Current version:', currentVersion);

// 3. Update service worker version
const swPath = path.join(__dirname, '..', 'service-worker.js');
let swContent = fs.readFileSync(swPath, 'utf8');
swContent = swContent.replace(
    /const CACHE_VERSION = '[^']+';/,
    `const CACHE_VERSION = 'v${currentVersion}';`
);
fs.writeFileSync(swPath, swContent, 'utf8');
console.log('✓ Updated service worker cache version');

// 4. Create deployment info file
const deployInfo = {
    version: currentVersion,
    timestamp: timestamp,
    date: new Date(timestamp).toISOString(),
    environment: process.env.NODE_ENV || 'production'
};

const deployInfoPath = path.join(__dirname, '..', 'deploy-info.json');
fs.writeFileSync(deployInfoPath, JSON.stringify(deployInfo, null, 2), 'utf8');
console.log('✓ Created deployment info file');

console.log('\n✅ Pre-deployment preparation complete!');
console.log('\nDeployment Info:');
console.log('  Version:', deployInfo.version);
console.log('  Timestamp:', deployInfo.timestamp);
console.log('  Date:', deployInfo.date);
console.log('\n📦 Ready to build and deploy!\n');
