import fs from 'fs';
import { normalizeConfig } from './defaults.js';

const PATH = 'src/lib/config/settings.json';

/** Read settings.json, falling back to defaults when it is missing, unreadable, or malformed. */
export function getConfig() {
	if (!fs.existsSync(PATH)) return normalizeConfig();
	try {
		return normalizeConfig(JSON.parse(fs.readFileSync(PATH, 'utf-8')));
	} catch (err) {
		console.error('[waystation] Failed to load config, using defaults:', err);
		return normalizeConfig();
	}
}

export function saveConfig(file) {
	fs.writeFileSync(PATH, JSON.stringify(normalizeConfig(file), null, 2));
}

export const startTime = Date.now();
