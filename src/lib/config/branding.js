export const SITE_TOKENS = {
	brandRed: { cssVar: '--color-brand-red', label: 'Alert Red', defaultHex: '#eb3223' },
	brandBlue: { cssVar: '--color-brand-blue', label: 'Highlight Blue', defaultHex: '#0087e8' },
	brandDarkblue: { cssVar: '--color-brand-darkblue', label: 'Dark Blue', defaultHex: '#004b71' },
	brandDarkerblue: {
		cssVar: '--color-brand-darkerblue',
		label: 'Deep Blue',
		defaultHex: '#00273b'
	},
	brandGray: { cssVar: '--color-brand-gray', label: 'Neutral Gray', defaultHex: '#8d8d8d' },
	obaGreen: { cssVar: '--color-oba-green', label: 'Accent Green', defaultHex: '#5eb441' }
};

// Board tokens are consumed by app.css as `var(--brand-<name>, <theme default>)`, so an
// override applies to whichever board theme is active while `.theme-mono` still wins.
export const BOARD_TOKENS = {
	boardBg: { cssVar: '--bg', label: 'Background', defaultHex: '#0e1014' },
	boardBgElevated: { cssVar: '--bg-elev', label: 'Card Background', defaultHex: '#15181f' },
	boardInk: { cssVar: '--ink', label: 'Primary Text', defaultHex: '#f4ecd8' },
	boardInkDim: { cssVar: '--ink-dim', label: 'Secondary Text', defaultHex: '#9b9685' },
	boardInkMute: { cssVar: '--ink-mute', label: 'Muted Text', defaultHex: '#5e5a4f' },
	boardRule: { cssVar: '--rule', label: 'Row Borders', defaultHex: '#2a2f3a' },
	boardRuleStrong: { cssVar: '--rule-strong', label: 'Header Border', defaultHex: '#3d4453' },
	boardAccent: { cssVar: '--accent', label: 'Time Display', defaultHex: '#d4b14a' },
	boardBadgeBg: { cssVar: '--badge-bg-1', label: 'Route Badge BG', defaultHex: '#1a1d24' },
	boardBadgeEdge: { cssVar: '--badge-edge', label: 'Route Badge Border', defaultHex: '#3d4453' },
	boardBadgeInk: { cssVar: '--badge-ink', label: 'Route Badge Text', defaultHex: '#d4b14a' },
	boardOntime: { cssVar: '--ontime', label: 'On Time', defaultHex: '#7bdc8a' },
	boardEarly: { cssVar: '--early', label: 'Early', defaultHex: '#ffb14a' },
	boardLate: { cssVar: '--late', label: 'Late / Canceled', defaultHex: '#ff8b6a' },
	boardSched: { cssVar: '--sched', label: 'Scheduled', defaultHex: '#9bb6d9' }
};

const COLOR_KEYS = new Set([...Object.keys(SITE_TOKENS), ...Object.keys(BOARD_TOKENS)]);

export const BRANDING_DEFAULTS = Object.freeze({
	...Object.fromEntries([...COLOR_KEYS].map((key) => [key, ''])),
	logoUrl: '',
	regionName: ''
});

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export function isValidLogoUrl(url) {
	try {
		return ['http:', 'https:'].includes(new URL(url).protocol);
	} catch {
		return false;
	}
}

function brandingError(key, value) {
	if (typeof value !== 'string') return `Branding value for ${key} must be a string`;
	if (COLOR_KEYS.has(key) && !HEX_COLOR.test(value)) {
		return `Branding color ${key} must be a 6-digit hex value like #1a2b3c`;
	}
	if (key === 'logoUrl' && !isValidLogoUrl(value)) {
		return 'Logo URL must be an http or https URL';
	}
	return '';
}

/** Coerce anything that isn't a plain object into `{}`. */
export function asObject(raw) {
	return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
}

function isBlank(value) {
	return value == null || value === '';
}

/** Return a list of human-readable problems with a submitted branding object (empty when valid). */
export function validateBranding(raw) {
	const source = asObject(raw);
	return Object.keys(BRANDING_DEFAULTS)
		.filter((key) => !isBlank(source[key]))
		.map((key) => brandingError(key, source[key]))
		.filter(Boolean);
}

/** Fill in missing keys and drop malformed values so a hand-edited config never breaks the board. */
export function normalizeBranding(raw) {
	const source = asObject(raw);
	const branding = { ...BRANDING_DEFAULTS };
	for (const key of Object.keys(BRANDING_DEFAULTS)) {
		const value = source[key];
		if (isBlank(value) || brandingError(key, value)) continue;
		branding[key] = key === 'regionName' ? value.trim() : value;
	}
	return branding;
}

/** Build a stylesheet that overrides the site colors and supplies board-token overrides. */
export function buildBrandingCss(branding) {
	const declarations = [
		...Object.entries(SITE_TOKENS).map(([key, { cssVar }]) => [cssVar, branding[key]]),
		// app.css reads each board token's override as `--brand-<name>`.
		...Object.entries(BOARD_TOKENS).map(([key, { cssVar }]) => [
			cssVar.replace(/^--/, '--brand-'),
			branding[key]
		])
	]
		.filter(([, value]) => value)
		.map(([name, value]) => `${name}:${value}`)
		.join(';');

	return declarations ? `:root{${declarations}}` : '';
}
