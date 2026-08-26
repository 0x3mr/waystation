export const SITE_TOKENS = {
	brandRed: { cssVar: '--color-brand-red', label: 'Alert Red', defaultHex: '#e83223' },
	brandBlue: { cssVar: '--color-brand-blue', label: 'Highlight Blue', defaultHex: '#4a7fd4' },
	brandDarkblue: { cssVar: '--color-brand-darkblue', label: 'Dark Blue', defaultHex: '#2d5380' },
	brandDarkerblue: {
		cssVar: '--color-brand-darkerblue',
		label: 'Deep Blue',
		defaultHex: '#1e3a52'
	},
	brandGray: { cssVar: '--color-brand-gray', label: 'Neutral Gray', defaultHex: '#9a9a9a' },
	obaGreen: { cssVar: '--color-oba-green', label: 'Accent Green', defaultHex: '#4dc76a' }
};

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

const COLOR_KEYS = [...Object.keys(SITE_TOKENS), ...Object.keys(BOARD_TOKENS)];

export const BRANDING_DEFAULTS = Object.freeze({
	...Object.fromEntries(COLOR_KEYS.map((key) => [key, ''])),
	logoUrl: '',
	regionName: ''
});

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/** Fill in missing keys and reject malformed color values. Throws on invalid input. */
export function normalizeBranding(raw) {
	const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
	const branding = { ...BRANDING_DEFAULTS };
	for (const key of Object.keys(BRANDING_DEFAULTS)) {
		const value = source[key];
		if (value == null || value === '') continue;
		if (typeof value !== 'string') throw new Error(`Invalid branding value for ${key}`);
		if (COLOR_KEYS.includes(key) && !HEX_COLOR.test(value)) {
			throw new Error(`Invalid color value for branding token: ${key}`);
		}
		branding[key] = value;
	}
	return branding;
}

/** Build a stylesheet that overrides the site and dark-board CSS variables with the agency's colors. */
export function buildBrandingCss(branding) {
	const siteOverrides = Object.entries(SITE_TOKENS)
		.filter(([key]) => branding[key])
		.map(([key, { cssVar }]) => `${cssVar}:${branding[key]}`)
		.join(';');

	const boardOverrides = Object.entries(BOARD_TOKENS)
		.filter(([key]) => branding[key])
		.map(([key, { cssVar }]) => {
			const base = `${cssVar}:${branding[key]}`;
			if (key === 'boardLate') return `${base};--cancel:${branding[key]}`;
			if (key === 'boardBadgeBg') return `${base};--badge-bg-2:${branding[key]}`;
			return base;
		})
		.join(';');

	const parts = [];
	if (siteOverrides) parts.push(`:root{${siteOverrides}}`);
	if (boardOverrides) parts.push(`:root .theme-departure.theme-dark{${boardOverrides}}`);
	return parts.join('');
}
