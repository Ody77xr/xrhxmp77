/**
 * Cache Buster Utility
 * Ensures users always get the latest version of the app
 */

// Version number - increment this with each deployment
const APP_VERSION = '1.0.0';
const BUILD_TIMESTAMP = Date.now();

// Check and update app version
function checkAppVersion() {
    const storedVersion = localStorage.getItem('appVersion');
    const storedTimestamp = localStorage.getItem('buildTimestamp');
    
    if (storedVersion !== APP_VERSION || storedTimestamp !== BUILD_TIMESTAMP.toString()) {
        console.log('New version detected. Clearing cache...');
        clearAppCache();
        localStorage.setItem('appVersion', APP_VERSION);
        localStorage.setItem('buildTimestamp', BUILD_TIMESTAMP.toString());
        
        // Force reload from server
        if (storedVersion && storedVersion !== APP_VERSION) {
            window.location.reload(true);
        }
    }
}

// Clear all app caches
async function clearAppCache() {
    try {
        // Clear service worker caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('Service worker caches cleared');
        }
        
        // Clear localStorage items that might be stale (preserve auth)
        const preserveKeys = ['userLoggedIn', 'guestMode', 'ageVerified', 'supabaseSession'];
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
            if (!preserveKeys.includes(key) && !key.startsWith('sb-')) {
                localStorage.removeItem(key);
            }
        });
        
        console.log('Cache cleared successfully');
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}

// Add version query parameter to script and link tags
function addVersionToAssets() {
    const version = `v=${APP_VERSION}-${BUILD_TIMESTAMP}`;
    
    // Add to all script tags
    document.querySelectorAll('script[src]').forEach(script => {
        const src = script.getAttribute('src');
        if (src && !src.includes('?v=') && !src.startsWith('http')) {
            script.setAttribute('src', `${src}?${version}`);
        }
    });
    
    // Add to all link tags (CSS)
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.includes('?v=') && !href.startsWith('http')) {
            link.setAttribute('href', `${href}?${version}`);
        }
    });
}

// Force reload assets if needed
function forceReloadAssets() {
    const lastReload = sessionStorage.getItem('lastAssetReload');
    const currentTime = Date.now();
    
    // Only force reload once per session
    if (!lastReload) {
        sessionStorage.setItem('lastAssetReload', currentTime.toString());
        
        // Reload all scripts
        document.querySelectorAll('script[src]').forEach(script => {
            const src = script.getAttribute('src');
            if (src && !src.startsWith('http')) {
                const newScript = document.createElement('script');
                newScript.src = `${src}?t=${currentTime}`;
                script.parentNode.replaceChild(newScript, script);
            }
        });
    }
}

// Initialize cache buster
function initCacheBuster() {
    checkAppVersion();
    
    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addVersionToAssets);
    } else {
        addVersionToAssets();
    }
}

// Export for use in other scripts
window.CacheBuster = {
    version: APP_VERSION,
    timestamp: BUILD_TIMESTAMP,
    clearCache: clearAppCache,
    checkVersion: checkAppVersion,
    init: initCacheBuster
};

// Auto-initialize
initCacheBuster();
