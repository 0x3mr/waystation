<script>
	import { getLocale } from '$lib/paraglide/runtime.js';
	import * as t from '$lib/paraglide/messages.js';
	import AlertBand from '$components/board/alert-band.svelte';
	import ClockBlock from '$components/board/clock-block.svelte';
	import Legend from '$components/board/legend.svelte';
	import LiveDot from '$components/board/live-dot.svelte';
	import StopCard from '$components/board/stop-card.svelte';

	const STALE_THRESHOLD_MS = 90_000;

	let {
		agencyName = '',
		agencyLogo = '',
		stops = [],
		alert = null,
		now,
		lastUpdatedAt = null,
		isStale = false,
		maxDepartures = 6,
		showFooter = true,
		showAlerts = true
	} = $props();

	// Grid shape follows the design table: 2 stops → 2 cols × 6 rows;
	// 3–4 → 2 cols × 4 rows; 5–6 → 3 cols × 4 rows. The admin departure
	// limit still caps rows per card.
	const n = $derived(stops.length);
	const cols = $derived(n <= 2 ? Math.max(n, 1) : n <= 4 ? 2 : 3);
	const gridRows = $derived(Math.ceil(n / cols));
	const perCard = $derived(Math.min(maxDepartures, gridRows === 1 ? 6 : 4));
	const rowHeight = $derived(gridRows === 1 ? 78 : 64);

	const hasAlert = $derived(showAlerts && !!alert);
	const liveCount = $derived(
		stops.reduce((c, s) => c + s.arrivals.filter((a) => a.delta != null).length, 0)
	);
	const updatedDate = $derived(lastUpdatedAt ? new Date(lastUpdatedAt) : null);
	const updatedLabel = $derived(
		updatedDate
			? updatedDate.toLocaleTimeString(getLocale(), {
					hour: 'numeric',
					minute: '2-digit',
					second: '2-digit'
				})
			: ''
	);
	const ageMs = $derived(updatedDate ? now.getTime() - updatedDate.getTime() : null);
	const stale = $derived(isStale || (ageMs != null && ageMs > STALE_THRESHOLD_MS));
	const showLive = $derived(liveCount > 0 && !stale);
</script>

<div
	style:position="absolute"
	style:inset="0"
	style:background="var(--bg)"
	style:color="var(--ink)"
	style:padding="26px 32px 22px"
	style:display="grid"
	style:grid-template-rows={hasAlert ? '104px 1fr auto auto' : '104px 1fr auto'}
	style:gap="18px"
	style:z-index="1"
>
	<!-- HEADER -->
	<header
		style:display="grid"
		style:grid-template-columns="auto 1fr auto"
		style:align-items="center"
		style:border-bottom="2px solid var(--rule-strong)"
		style:padding-bottom="16px"
	>
		<div style:display="flex" style:align-items="center" style:gap="16px">
			{#if agencyLogo}
				<img
					src={agencyLogo}
					alt={agencyName}
					style:height="58px"
					style:width="auto"
					style:object-fit="contain"
				/>
			{/if}
			{#if agencyName}
				<div
					class="display"
					style:font-size="30px"
					style:font-weight="700"
					style:line-height="1.05"
				>
					{agencyName}
				</div>
			{/if}
		</div>

		<div style:display="flex" style:justify-content="center">
			<div
				class="sc display"
				style:font-weight="800"
				style:font-size="28px"
				style:letter-spacing="0.26em"
				style:color="var(--ink-dim)"
			>
				{t.board_departures()}
			</div>
		</div>

		<ClockBlock {now} />
	</header>

	<!-- STOP GRID -->
	<div
		style:display="grid"
		style:grid-template-columns="repeat({cols}, 1fr)"
		style:grid-auto-rows="min-content"
		style:align-content="start"
		style:gap="20px"
		style:min-height="0"
	>
		{#each stops as stop (stop.id)}
			<StopCard {stop} limit={perCard} {rowHeight} />
		{/each}
	</div>

	{#if hasAlert}
		<AlertBand situation={alert} />
	{/if}

	<!-- FOOTER -->
	{#if showFooter}
		<footer
			style:display="grid"
			style:grid-template-columns="auto 1fr auto"
			style:align-items="center"
			style:gap="32px"
			style:border-top="1px solid var(--rule)"
			style:padding-top="12px"
		>
			<div
				class="sc"
				style:font-size="14px"
				style:letter-spacing="0.18em"
				style:color="var(--ink-mute)"
			>
				<span style:color="var(--ink-dim)" style:font-weight="600">{t.board_waystation()}</span>
				<span style:margin="0 12px" style:color="var(--rule-strong)">/</span>
				<span>{t.board_otsf()}</span>
			</div>

			<Legend />

			<div style:display="flex" style:align-items="center" style:gap="22px">
				<LiveDot hasRealtime={showLive} />
				<span
					class="sc tnum"
					style:font-size="14px"
					style:letter-spacing="0.14em"
					style:color={stale ? 'var(--late)' : 'var(--ink-mute)'}
					style:font-weight={stale ? 700 : 400}
				>
					{#if !updatedDate}
						{t.board_updating()}
					{:else if stale}
						{t.board_stale_prefix()}
						{updatedLabel}
					{:else}
						{t.board_updated()}
						{updatedLabel}
					{/if}
				</span>
			</div>
		</footer>
	{/if}
</div>
