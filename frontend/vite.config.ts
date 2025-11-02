import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, __dirname);

	console.log('env', env);

	return {
		plugins: [react()],
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
