import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'River Guide',
				short_name: 'Rivers',
				description: 'Multi-day rafting rivers of the Western US',
				theme_color: '#020617',
				background_color: '#020617',
				display: 'standalone',
				icons: [
					{
						src: '/favicon.svg',
						sizes: 'any',
						type: 'image/svg+xml',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/waterservices\.usgs\.gov\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'usgs-flows',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 30 // 30 minutes
							}
						}
					}
				]
			}
		})
	]
});
