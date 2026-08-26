import fs from 'fs';
import { normalizeConfig } from './defaults.js';

const PATH = 'src/lib/config/settings.json';

export function getConfig() {
	if (!fs.existsSync(PATH)) return normalizeConfig();
	return normalizeConfig(JSON.parse(fs.readFileSync(PATH, 'utf-8')));
}

export function saveConfig(file) {
	fs.writeFileSync(PATH, JSON.stringify(normalizeConfig(file), null, 2));
}

export const startTime = Date.now();
