import { getConfig } from '$lib/config/config.js';

export function load() {
	try {
		return { branding: getConfig().branding };
	} catch (err) {
		console.error('[waystation] Failed to load branding config:', err);
		return { branding: {} };
	}
}
