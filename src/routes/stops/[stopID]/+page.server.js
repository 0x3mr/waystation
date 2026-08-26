// The multi-stop grid is designed for up to six cards (see multi-stop-board.svelte).
const MAX_STOPS = 6;

export async function load({ params, parent }) {
	// Dedupe and drop empty segments so keyed cards never collide and no fetch targets ''.
	const stopIDs = [
		...new Set(
			params.stopID
				.split('+')
				.map((s) => s.trim())
				.filter(Boolean)
		)
	].slice(0, MAX_STOPS);

	const { config } = await parent();
	return { stopIDs, config };
}
