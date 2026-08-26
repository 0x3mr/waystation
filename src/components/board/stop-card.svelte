<script>
	import * as t from '$lib/paraglide/messages.js';
	import StopRow from '$components/board/stop-row.svelte';

	let { stop, limit = 4, rowHeight = 64 } = $props();

	const rows = $derived(stop.arrivals.slice(0, limit));
	const direction = $derived.by(() => {
		const key = `board_dir_${String(stop.direction ?? '').toUpperCase()}`;
		return key in t ? t[key]() : '';
	});
</script>

<section
	style:display="grid"
	style:grid-template-rows="auto auto"
	style:align-self="start"
	style:min-height="0"
	style:background="var(--bg-elev)"
	style:border="1px solid var(--rule)"
	style:border-radius="6px"
	style:padding="16px 18px 10px"
>
	<div style:padding-bottom="10px" style:border-bottom="1px solid var(--rule)">
		<div
			class="display"
			style:font-size="30px"
			style:font-weight="700"
			style:line-height="1.12"
			style:white-space="nowrap"
			style:overflow="hidden"
			style:text-overflow="ellipsis"
		>
			{stop.name}
		</div>
		<div
			class="sc tnum"
			style:font-size="13px"
			style:letter-spacing="0.18em"
			style:color="var(--ink-mute)"
			style:margin-top="6px"
			style:white-space="nowrap"
			style:overflow="hidden"
			style:text-overflow="ellipsis"
		>
			{t.board_stop_label({ stopId: stop.code })}{#if direction}<span
					style:margin="0 8px"
					style:color="var(--rule-strong)">·</span
				>{direction}{/if}
		</div>
	</div>

	{#if stop.failed}
		<div
			class="sc"
			style:display="grid"
			style:place-items="center"
			style:height="{rowHeight}px"
			style:color="var(--late)"
			style:font-size="16px"
			style:letter-spacing="0.18em"
			style:font-weight="700"
		>
			{t.board_data_unavailable()}
		</div>
	{:else if rows.length === 0}
		<div
			class="sc"
			style:display="grid"
			style:place-items="center"
			style:height="{rowHeight}px"
			style:color="var(--ink-mute)"
			style:font-size="16px"
			style:letter-spacing="0.18em"
		>
			{t.board_no_departures()}
		</div>
	{:else}
		<div style:display="grid" style:grid-auto-rows="{rowHeight}px" style:min-height="0">
			{#each rows as arrival, i (arrival.tripId ?? `${arrival.route}-${arrival.departureAt}`)}
				<StopRow {arrival} last={i === rows.length - 1} />
			{/each}
		</div>
	{/if}
</section>
