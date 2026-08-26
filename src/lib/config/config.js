import fs from 'fs';
import { normalizeConfig } from './defaults.js';
import { normalizeBranding } from './branding.js';

const PATH = 'src/lib/config/settings.json';

function normalize(raw) {
	const config = normalizeConfig(raw);
	config.branding = normalizeBranding(config.branding);
	return config;
}

export function getConfig() {
	if (!fs.existsSync(PATH)) return normalize();
	return normalize(JSON.parse(fs.readFileSync(PATH, 'utf-8')));
}

export function saveConfig(file) {
	fs.writeFileSync(PATH, JSON.stringify(normalize(file), null, 2));
}

export const startTime = Date.now();
