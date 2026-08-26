import { describe, expect, it } from 'vitest';
import {
	BOARD_TOKENS,
	BRANDING_DEFAULTS,
	SITE_TOKENS,
	buildBrandingCss,
	isValidLogoUrl,
	normalizeBranding,
	validateBranding
} from './branding.js';

describe('normalizeBranding', () => {
	it('returns defaults for empty or non-object input', () => {
		expect(normalizeBranding()).toEqual(BRANDING_DEFAULTS);
		expect(normalizeBranding(null)).toEqual(BRANDING_DEFAULTS);
		expect(normalizeBranding('x')).toEqual(BRANDING_DEFAULTS);
		expect(normalizeBranding([1])).toEqual(BRANDING_DEFAULTS);
	});

	it('keeps valid values and drops unknown keys', () => {
		const out = normalizeBranding({
			boardBg: '#112233',
			logoUrl: 'https://example.com/logo.png',
			regionName: ' Metro ',
			extra: 'nope'
		});
		expect(out.boardBg).toBe('#112233');
		expect(out.logoUrl).toBe('https://example.com/logo.png');
		expect(out.regionName).toBe('Metro');
		expect(out).not.toHaveProperty('extra');
	});

	it('never throws: malformed values fall back to empty', () => {
		const out = normalizeBranding({
			boardBg: '#fff',
			brandRed: 123,
			boardLate: 'red',
			logoUrl: 'javascript:alert(1)',
			regionName: 5
		});
		expect(out).toEqual(BRANDING_DEFAULTS);
	});
});

describe('validateBranding', () => {
	it('returns no errors for empty or valid branding', () => {
		expect(validateBranding()).toEqual([]);
		expect(validateBranding({ boardBg: '', logoUrl: '' })).toEqual([]);
		expect(validateBranding({ boardBg: '#AbCdEf', logoUrl: 'http://a.b/c' })).toEqual([]);
	});

	it('reports each malformed field', () => {
		const errors = validateBranding({ boardBg: '#fff', logoUrl: 'ftp://x', regionName: 1 });
		expect(errors).toHaveLength(3);
		expect(errors.join(' ')).toMatch(/boardBg/);
		expect(errors.join(' ')).toMatch(/Logo URL/);
		expect(errors.join(' ')).toMatch(/regionName/);
	});
});

describe('isValidLogoUrl', () => {
	it('accepts only http(s) URLs', () => {
		expect(isValidLogoUrl('https://example.com/a.png')).toBe(true);
		expect(isValidLogoUrl('http://example.com')).toBe(true);
		expect(isValidLogoUrl('javascript:alert(1)')).toBe(false);
		expect(isValidLogoUrl('data:image/png;base64,AAAA')).toBe(false);
		expect(isValidLogoUrl('not a url')).toBe(false);
	});
});

describe('buildBrandingCss', () => {
	it('returns an empty string when nothing is overridden', () => {
		expect(buildBrandingCss(BRANDING_DEFAULTS)).toBe('');
		expect(buildBrandingCss({})).toBe('');
	});

	it('emits site vars directly and board tokens as --brand-* overrides', () => {
		const css = buildBrandingCss({
			brandRed: '#ff0000',
			boardLate: '#00ff00',
			boardBadgeBg: '#0000ff'
		});
		expect(css).toBe(
			':root{--color-brand-red:#ff0000;--brand-badge-bg-1:#0000ff;--brand-late:#00ff00}'
		);
	});

	it('never targets a specific board theme', () => {
		const css = buildBrandingCss({ boardAccent: '#123456' });
		expect(css).not.toMatch(/theme-/);
	});
});

describe('token maps', () => {
	it('only contain hex defaults', () => {
		for (const { defaultHex } of [...Object.values(SITE_TOKENS), ...Object.values(BOARD_TOKENS)]) {
			expect(defaultHex).toMatch(/^#[0-9a-f]{6}$/);
		}
	});
});
