# Deployment Checklist

## Before Every Deployment

### 1. Update Version
Choose the appropriate version bump:

```bash
# For bug fixes and small changes
npm run version:patch

# For new features (backward compatible)
npm run version:minor

# For breaking changes
npm run version:major
```

### 2. Test Locally
```bash
# Start dev server
npm run dev

# Test in browser at http://localhost:5173
# Verify all features work correctly
```

### 3. Build and Preview
```bash
# Build for production
npm run build

# Preview the build
npm run preview

# Test at http://localhost:4173
```

### 4. Deploy

#### Option A: Netlify (Recommended)
```bash
npm run deploy
```

#### Option B: Vercel
```bash
vercel --prod
```

#### Option C: GitHub Pages
```bash
npm run deploy:gh
```

### 5. Verify Deployment
1. Visit your deployed URL
2. Open DevTools Console
3. Look for: "Service Worker registered"
4. Check Application → Cache Storage
5. Test on multiple devices

## Cache Verification

### Check Current Version
Open browser console on your site:
```javascript
console.log('Version:', window.CacheBuster.version);
console.log('Timestamp:', window.CacheBuster.timestamp);
```

### Force Cache Clear (if needed)
```javascript
await window.CacheBuster.clearCache();
location.reload();
```

### Check Service Worker Status
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
    console.log('Active service workers:', regs.length);
    regs.forEach(reg => console.log('SW:', reg.active?.scriptURL));
});
```

## Troubleshooting

### Problem: Users seeing old version

**Solution 1: Verify version was bumped**
```bash
# Check current version
grep "APP_VERSION" cache-buster.js
```

**Solution 2: Clear browser cache**
- Chrome: Ctrl+Shift+Delete → Clear browsing data
- Firefox: Ctrl+Shift+Delete → Clear cache
- Safari: Cmd+Option+E

**Solution 3: Hard refresh**
- Windows: Ctrl+Shift+R
- Mac: Cmd+Shift+R

### Problem: Service worker not updating

**Solution:**
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister());
});
location.reload();
```

### Problem: Assets not loading

**Solution: Check cache headers**
1. Open DevTools → Network tab
2. Refresh page
3. Click on any .js or .css file
4. Check Response Headers for "Cache-Control"
5. Should see: "public, max-age=31536000, immutable"

## Quick Commands Reference

```bash
# Development
npm run dev                 # Start dev server

# Version Management
npm run version:patch       # 1.0.0 → 1.0.1
npm run version:minor       # 1.0.0 → 1.1.0
npm run version:major       # 1.0.0 → 2.0.0

# Building
npm run prebuild           # Prepare for deployment
npm run build              # Build for production
npm run preview            # Preview production build

# Deployment
npm run deploy             # Deploy to Netlify
vercel --prod              # Deploy to Vercel
npm run deploy:gh          # Deploy to GitHub Pages

# Utilities
npm run update-cache       # Update all HTML files
npm run verify             # Verify build output
```

## Best Practices

1. ✅ **Always bump version** before deploying
2. ✅ **Test locally** before deploying
3. ✅ **Use semantic versioning** (major.minor.patch)
4. ✅ **Document changes** in commit messages
5. ✅ **Test on multiple devices** after deployment
6. ✅ **Monitor console** for errors
7. ✅ **Keep dependencies updated**

## Version History Template

Keep track of your deployments:

```
v1.0.0 - 2024-01-15
- Initial release
- Basic features implemented

v1.0.1 - 2024-01-16
- Fixed cache issues
- Improved loading speed

v1.1.0 - 2024-01-20
- Added new gallery feature
- Enhanced mobile experience

v2.0.0 - 2024-02-01
- Complete redesign
- Breaking changes to API
```

## Emergency Rollback

If something goes wrong:

### Netlify
```bash
# List recent deployments
netlify deploy:list

# Restore previous deployment
netlify deploy:restore <deploy-id>
```

### Vercel
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

### GitHub Pages
```bash
# Revert to previous commit
git revert HEAD
git push origin main
npm run deploy:gh
```

## Success Indicators

After deployment, you should see:

1. ✅ Console: "Service Worker registered"
2. ✅ Console: Shows correct version number
3. ✅ DevTools → Application → Cache Storage has entries
4. ✅ Network tab shows 304 (Not Modified) for cached assets
5. ✅ HTML files show 200 (OK) with revalidation
6. ✅ Page loads instantly on repeat visits
7. ✅ Same version across all devices

## Support

If you encounter issues:
1. Check this checklist
2. Review CACHE-SOLUTION.md
3. Check browser console for errors
4. Verify deployment logs
5. Test in incognito/private mode
