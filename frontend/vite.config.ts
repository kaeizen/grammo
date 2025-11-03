import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Sitemap from 'vite-plugin-sitemap'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, __dirname);
	return {
		plugins: [
			react(),
			Sitemap({
				hostname: 'https://grammo.kaeizen.dev',
				changefreq: 'monthly',
			}),
			VitePWA({
				registerType: 'autoUpdate',
				includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
				manifest: {
					name: 'Grammo',
					short_name: 'Grammo',
					description: 'Translation & Grammar Assistant',
					background_color: '#202030',
        			theme_color: '#646cff',
					icons: [
						{
							src: 'grammo-16x16.png',
							sizes: '16x16',
							type: 'image/png'
						},
						{
							src: 'grammo-32x32.png',
							sizes: '32x32',
							type: 'image/png'
						},
						{
							src: 'grammo-192x192.png',
							sizes: '192x192',
							type: 'image/png'
						},
						{
							src: 'grammo-512x512.png',
							sizes: '512x512',
							type: 'image/png'
						},
						{
							src: 'grammo-512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any maskable'
						}
					]
				},
				workbox: {
					globPatterns: ['**/*.{js,css,html,ico,png,svg}']
				}
			})
		],
		server: {
			proxy: {
				'/api': {
					target: env.VITE_API_PROXY,
					changeOrigin: true,
					secure: mode === 'development' ? false : true, // can set to true if you're sure your API uses valid SSL
				},
			},
		}
	}
});
