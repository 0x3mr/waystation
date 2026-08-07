<script>
	import * as t from '$lib/paraglide/messages.js';

	const STATUS = {
		ONTIME: { glyph: '●', weight: 500 },
		EARLY: { glyph: '▲', weight: 700 },
		LATE: { glyph: '▼', weight: 700 },
		CANCEL: { glyph: '✕', weight: 700 },
		SCHED: { glyph: '○', weight: 500 }
	};

	let { status, delta = null, large = false } = $props();

	const s = $derived(STATUS[status]);
	const size = $derived(large ? 28 : 22);
	const label = $derived.by(() => {
		if (!s) return '';
		if (status === 'EARLY' && delta != null)
			return t.board_status_min_early({ delta: Math.abs(delta) });
		if (status === 'LATE' && delta != null) return t.board_status_min_late({ delta });
		if (status === 'ONTIME') return t.board_status_ontime();
		if (status === 'EARLY') return t.board_status_early();
		if (status === 'LATE') return t.board_status_delayed();
		if (status === 'CANCEL') return t.board_status_canceled();
		if (status === 'SCHED') return t.board_status_scheduled();
		return '';
	});
</script>

{#if s}
	<span
		class="status-{status} sc tnum"
		dir="ltr"
		style:display="inline-flex"
		style:align-items="center"
		style:gap="10px"
		style:font-weight={s.weight}
		style:font-size="{size}px"
		style:color="var(--status-tone)"
		style:letter-spacing="0.1em"
	>
		<span aria-hidden="true" style:font-size="{size * 0.95}px">{s.glyph}</span>
		<span>{label}</span>
	</span>
{/if}
