// The multi-stop grid is designed for up to six cards (see multi-stop-board.svelte).
const MAX_STOPS = 6;

export function load({ params }) {
	// Dedupe and drop empty segments so keyed cards never collide and no fetch targets ''.
	const stopIDs = [
		...new Set(
			params.stopID
				.split('+')
				.map((s) => s.trim())
				.filter(Boolean)
		)
	].slice(0, MAX_STOPS);

	// `config`, `logoUrl`, and `regionName` arrive merged in from the root layout load.
	return { stopIDs };
}
