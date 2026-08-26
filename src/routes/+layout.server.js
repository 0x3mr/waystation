import { PUBLIC_OBA_LOGO_URL, PUBLIC_OBA_REGION_NAME } from '$env/static/public';
import { getConfig } from '$lib/config/config.js';
import { normalizeConfig } from '$lib/config/defaults.js';
import { buildBrandingCss } from '$lib/config/branding.js';

/**
 * Load settings.json once per request for every page. This is the single place that resolves
 * the configured logo/name against the env-var defaults.
 */
export function load() {
	let config;
	try {
		config = getConfig();
	} catch (err) {
		// getConfig only throws on an unreadable/unparseable settings.json; fall back to defaults.
		console.error('[waystation] Failed to load config:', err);
		config = normalizeConfig();
	}
	return {
		config,
		logoUrl: config.branding.logoUrl || PUBLIC_OBA_LOGO_URL,
		regionName: config.branding.regionName || PUBLIC_OBA_REGION_NAME,
		brandingCss: buildBrandingCss(config.branding)
	};
}
