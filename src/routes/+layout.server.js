import { PUBLIC_OBA_LOGO_URL, PUBLIC_OBA_REGION_NAME } from '$env/static/public';
import { getConfig } from '$lib/config/config.js';
import { DEFAULT_LOGO_URL, DEFAULT_REGION_NAME, buildBrandingCss } from '$lib/config/branding.js';

/**
 * Load settings.json once per request for every page. This is the single place that resolves
 * the configured logo/name against the env-var defaults.
 */
export function load({ depends, url }) {
	// Reading `url` makes SvelteKit rerun this load on every client-side navigation, so a config
	// saved from another tab is picked up without a hard reload; the admin page invalidates
	// 'app:config' after its own save.
	depends('app:config');
	void url.pathname;

	const config = getConfig();
	return {
		config,
		logoUrl: config.branding.logoUrl || PUBLIC_OBA_LOGO_URL || DEFAULT_LOGO_URL,
		regionName: config.branding.regionName || PUBLIC_OBA_REGION_NAME || DEFAULT_REGION_NAME,
		brandingCss: buildBrandingCss(config.branding)
	};
}
