import adapter from '@sveltejs/adapter-netlify';
import { svelte } from '@sveltejs/vite-plugin-svelte'; // Corrected import

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: svelte(), // Changed to svelte() for preprocessing

    kit: {
        adapter: adapter()
    }
};

export default config;
