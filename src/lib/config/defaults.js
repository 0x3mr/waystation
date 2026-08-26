export const THEMES = ['system', 'light', 'dark'];
export const COLOR_MODES = ['color', 'mono'];

export const DEFAULT_CONFIG = {
	maxDepartures: 4,
	updateInterval: 30,
	theme: THEMES[0],
	colorMode: COLOR_MODES[0]
};

function positiveInt(value, fallback) {
	const n = Math.floor(Number(value));
	return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Coerce a possibly hand-edited or malformed config into a fully valid one. */
export function normalizeConfig(raw = {}) {
	return {
		...raw,
		maxDepartures: positiveInt(raw.maxDepartures, DEFAULT_CONFIG.maxDepartures),
		updateInterval: positiveInt(raw.updateInterval, DEFAULT_CONFIG.updateInterval),
		theme: THEMES.includes(raw.theme) ? raw.theme : DEFAULT_CONFIG.theme,
		colorMode: COLOR_MODES.includes(raw.colorMode) ? raw.colorMode : DEFAULT_CONFIG.colorMode
	};
}
