/**
 * Script to update all HTML files with proper cache headers
 * Run this after making changes to ensure consistency
 */

const fs = require('fs');
const path = require('path');

// HTML files to update
const htmlFiles = [
    'xrhome.html',
    'xrabout.html',
    'xradmin-dashboard.html',
    'xrcategory-gallery.html',
    'xrdocs.html',
    'xrgallery-entrance.html',
    'xrhxmpgallery.html',
    'xrmembership.html',
    'xrmessaging.html',
    'xrmyhxmps.html',
    'xrphoto-gallery.html',
    'xrportalgallery.html',
    'xruploader.html',
    'xrvideo-gallery.html',
    'xrvideo-player.html',
    'xrvideoplayer.html',
    'xrgxy.html',
    'auth-gateway.html',
    'auth-login.html',
    'auth-signup.html',
    'admin-login.html',
    'admin-content-manager.html',
    'profile.html',
    'user-profile.html'
];

// Remove old cache meta tags
const oldCacheTags = [
    '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">',
    '<meta http-equiv="Pragma" content="no-cache">',
    '<meta http-equiv="Expires" content="0">'
];

// Cache buster script to add
const cacheBusterScript = '<script src="cache-buster.js"></script>';

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${file} - not found`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove old cache meta tags
    oldCacheTags.forEach(tag => {
        if (content.includes(tag)) {
            content = content.replace(new RegExp(tag + '\\s*', 'g'), '');
            modified = true;
        }
    });
    
    // Add cache buster if not present and there's a closing </head> tag
    if (!content.includes('cache-buster.js') && content.includes('</head>')) {
        content = content.replace('</head>', `    ${cacheBusterScript}\n</head>`);
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Updated ${file}`);
    } else {
        console.log(`- No changes needed for ${file}`);
    }
});

console.log('\nCache headers update complete!');
