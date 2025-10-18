import { defineConfig } from 'vite'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  // base path for GitHub Pages deployment
  base: '/xrhxmp77/',
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        home: './xrhome.html',
        about: './xrabout.html',
        adminLogin: './admin-login.html',
        adminDashboard: './xradmin-dashboard.html',
        categoryGallery: './xrcategory-gallery.html',
        docs: './xrdocs.html',
        galleryEntrance: './xrgallery-entrance.html',
        hxmpGallery: './xrhxmpgallery.html',
        membership: './xrmembership.html',
        messaging: './xrmessaging.html',
        myHxmps: './xrmyhxmps.html',
        photoGallery: './xrphoto-gallery.html',
        portalGallery: './xrportalgallery.html',
        uploader: './xruploader.html',
        videoGallery: './xrvideo-gallery.html',
        videoPlayer: './xrvideo-player.html',
        videoPlayerAlt: './xrvideoplayer.html',
        xrgxy: './xrgxy.html'
      }
    },
    copyPublicDir: true
  },
  server: {
    host: true,
    port: 5173
  },
  publicDir: 'assets',
  plugins: [
    {
      name: 'copy-js-files',
      writeBundle() {
        // Copy JavaScript files to dist directory
        const jsFiles = [
          'floating-nav.js',
          'app.js',
          'supabase-config.js',
          'admin-dashboard.js',
          'video-gallery.js',
          'hxmp-video-player.js',
          'access-control.js',
          'category-gallery.js',
          'photo-gallery.js',
          'gallery.js'
        ]
        
        jsFiles.forEach(file => {
          const src = resolve(file)
          const dest = resolve('dist', file)
          if (existsSync(src)) {
            try {
              copyFileSync(src, dest)
              console.log(`Copied ${file} to dist/`)
            } catch (error) {
              console.warn(`Failed to copy ${file}:`, error.message)
            }
          }
        })

        // Copy CSS files
        const cssFiles = [
          'styles.css',
          'floating-nav.css'
        ]
        
        cssFiles.forEach(file => {
          const src = resolve(file)
          const dest = resolve('dist', file)
          if (existsSync(src)) {
            try {
              copyFileSync(src, dest)
              console.log(`Copied ${file} to dist/`)
            } catch (error) {
              console.warn(`Failed to copy ${file}:`, error.message)
            }
          }
        })

        // Copy other important files
        const otherFiles = [
          '_redirects',
          'netlify.toml',
          'cache-buster.js',
          'service-worker.js'
        ]
        
        otherFiles.forEach(file => {
          const src = resolve(file)
          const dest = resolve('dist', file)
          if (existsSync(src)) {
            try {
              copyFileSync(src, dest)
              console.log(`Copied ${file} to dist/`)
            } catch (error) {
              console.warn(`Failed to copy ${file}:`, error.message)
            }
          }
        })
      }
    }
  ]
})