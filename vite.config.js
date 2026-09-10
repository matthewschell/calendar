import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true // This allows us to test offline mode right now in VS Code!
      },
      workbox: {
        // Cache all the app's code and layout files
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        
        runtimeCaching: [
          {
            // This regex targets your exact Cloudflare R2 bucket URLs
            urlPattern: /^https:\/\/pub-c502b7afe8da4d518eea03a57bdd6e60\.r2\.dev\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'schell-media-cache',
              expiration: {
                maxEntries: 200, // Can hold up to 200 sounds/videos
                maxAgeSeconds: 60 * 60 * 24 * 365 // Keep them for 1 entire year
              },
              cacheableResponse: {
                // Status 200 = Normal download. 
                // Status 0 = Magic CORS bypass. It tells the worker to save it even if Cloudflare complains.
                statuses: [0, 200] 
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Schell Family Calendar',
        short_name: 'Family Calendar',
        description: 'Family Chore and Schedule Tracker',
        theme_color: '#667eea',
        background_color: '#ffffff',
        display: 'standalone', // Makes it look like a real app on mobile (no browser bars)
        icons: [] // You can generate and add app icons here later!
      }
    })
  ],
})