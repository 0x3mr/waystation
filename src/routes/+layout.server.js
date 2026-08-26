import { PUBLIC_OBA_LOGO_URL, PUBLIC_OBA_REGION_NAME } from '$env/static/public';
import { getConfig } from '$lib/config/config.js';
import { BRANDING_DEFAULTS } from '$lib/config/branding.js';

/** Branding for every page: configured values with the env-var defaults as fallback. */
export function load() {
	let branding = BRANDING_DEFAULTS;
	try {
		branding = getConfig().branding;
	} catch (err) {
		// getConfig only throws on an unreadable/unparseable settings.json; branding is optional.
		console.error('[waystation] Failed to load branding config:', err);
	}
	return {
		branding,
		logoUrl: branding.logoUrl || PUBLIC_OBA_LOGO_URL,
		regionName: branding.regionName || PUBLIC_OBA_REGION_NAME
	};
}
