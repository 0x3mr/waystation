import { getConfig } from '$lib/config/config.js';

// The multi-stop grid is designed for up to six cards (see multi-stop-board.svelte).
const MAX_STOPS = 6;

export async function load({ params }) {
	// Dedupe and drop empty segments so keyed cards never collide and no fetch targets ''.
	const stopIDs = [
		...new Set(
			params.stopID
				.split('+')
				.map((s) => s.trim())
				.filter(Boolean)
		)
	].slice(0, MAX_STOPS);

	return {
		stopIDs,
		config: getConfig()
	};
}
