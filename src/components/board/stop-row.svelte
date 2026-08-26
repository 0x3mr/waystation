<script>
	import * as t from '$lib/paraglide/messages.js';

	const STATUS = {
		ONTIME: { glyph: '●', weight: 500 },
		EARLY: { glyph: '▲', weight: 700 },
		LATE: { glyph: '▼', weight: 700 },
		CANCEL: { glyph: '✕', weight: 700 },
		SCHED: { glyph: '○', weight: 500 }
	};

	let { arrival, last = false } = $props();

	const isCancel = $derived(arrival.status === 'CANCEL');
	const isSched = $derived(arrival.status === 'SCHED');
	const s = $derived(STATUS[arrival.status] ?? STATUS.SCHED);
	const phrase = $derived.by(() => {
		const { status, delta } = arrival;
		if (status === 'LATE' && delta != null) return t.board_status_min_late({ delta });
		if (status === 'EARLY' && delta != null)
			return t.board_status_min_early({ delta: Math.abs(delta) });
		if (status === 'ONTIME') return t.board_status_ontime();
		if (status === 'EARLY') return t.board_status_early();
		if (status === 'LATE') return t.board_status_delayed();
		if (status === 'CANCEL') return t.board_status_canceled();
		return t.board_status_scheduled();
	});
	const len = $derived(String(arrival.route).length);
	const badgeSize = $derived(54 * (len <= 2 ? 0.62 : len <= 3 ? 0.54 : len <= 4 ? 0.42 : 0.36));
</script>

<div
	class="status-{arrival.status}"
	style:display="grid"
	style:grid-template-columns="auto minmax(0, 1fr) 130px"
	style:gap="14px"
	style:align-items="center"
	style:border-bottom={last ? 'none' : '1px solid var(--rule)'}
	style:opacity={isCancel ? 0.7 : 1}
>
	<div
		class="route-badge"
		style:width="104px"
		style:height="54px"
		style:border-radius="8px"
		style:display="grid"
		style:place-items="center"
	>
		<div
			class="display tnum"
			style:font-size="{badgeSize}px"
			style:font-weight="800"
			style:line-height="1"
			style:letter-spacing="-0.01em"
			style:color="var(--badge-ink)"
			style:white-space="nowrap"
		>
			{arrival.route}
		</div>
	</div>

	<div style:min-width="0">
		<div
			class="display"
			style:font-size="27px"
			style:font-weight="600"
			style:line-height="1.15"
			style:white-space="nowrap"
			style:overflow="hidden"
			style:text-overflow="ellipsis"
		>
			{arrival.dest || arrival.name}
		</div>
		<div
			class="sc tnum"
			style:font-size="12px"
			style:letter-spacing="0.16em"
			style:margin-top="2px"
			style:color={isSched ? 'var(--ink-mute)' : 'var(--status-tone)'}
			style:font-weight={s.weight}
		>
			{phrase}
		</div>
	</div>

	<div
		dir="ltr"
		style:display="flex"
		style:align-items="baseline"
		style:gap="7px"
		style:justify-content="flex-end"
		style:overflow="hidden"
	>
		<span
			aria-hidden="true"
			style:font-size="16px"
			style:color="var(--status-tone)"
			style:font-weight={s.weight}
			style:align-self="center">{s.glyph}</span
		>
		{#if isCancel}
			<span
				class="sc display"
				style:font-size="26px"
				style:font-weight="700"
				style:color="var(--status-tone)">{t.board_status_canceled()}</span
			>
		{:else}
			<span
				class="display mono"
				style:font-size="48px"
				style:font-weight="700"
				style:line-height="0.9"
				style:letter-spacing="-0.03em"
				style:color={isSched ? 'var(--ink)' : 'var(--accent)'}
				>{arrival.min <= 0 ? t.board_now() : arrival.min}</span
			>
			{#if arrival.min > 0}
				<span
					class="sc display"
					style:font-size="16px"
					style:font-weight="700"
					style:letter-spacing="0.06em"
					style:color="var(--ink-mute)">{t.board_min()}</span
				>
			{/if}
		{/if}
	</div>
</div>
