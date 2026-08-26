import { describe, expect, it } from 'vitest';
import { COLOR_MODES, DEFAULT_CONFIG, THEMES, normalizeConfig } from './defaults.js';

describe('normalizeConfig', () => {
	it('returns defaults for an empty or missing config', () => {
		expect(normalizeConfig()).toEqual(DEFAULT_CONFIG);
		expect(normalizeConfig({})).toEqual(DEFAULT_CONFIG);
	});

	it('returns defaults for non-object values such as a null settings file', () => {
		expect(normalizeConfig(null)).toEqual(DEFAULT_CONFIG);
		expect(normalizeConfig('dark')).toEqual(DEFAULT_CONFIG);
		expect(normalizeConfig([1, 2])).toEqual(DEFAULT_CONFIG);
	});

	it('keeps valid values', () => {
		const cfg = { maxDepartures: 6, updateInterval: 15, theme: 'light', colorMode: 'mono' };
		expect(normalizeConfig(cfg)).toEqual(cfg);
	});

	it('falls back on invalid theme, colorMode, and numbers', () => {
		expect(
			normalizeConfig({ maxDepartures: 'abc', updateInterval: -2, theme: 'neon', colorMode: 'x' })
		).toEqual(DEFAULT_CONFIG);
	});

	it('exposes defaults that are members of the option lists', () => {
		expect(THEMES).toContain(DEFAULT_CONFIG.theme);
		expect(COLOR_MODES).toContain(DEFAULT_CONFIG.colorMode);
	});
});
