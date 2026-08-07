<script>
	import * as t from '$lib/paraglide/messages.js';

	const items = $derived([
		{ glyph: '●', label: t.board_status_ontime() },
		{ glyph: '▲', label: t.board_status_early() },
		{ glyph: '▼', label: t.board_status_delayed() },
		{ glyph: '○', label: t.board_status_scheduled() },
		{ glyph: '✕', label: t.board_status_canceled() }
	]);
</script>

<div style:display="flex" style:justify-content="center" style:gap="36px">
	{#each items as item (item.glyph)}
		<span
			class="sc tnum"
			style:display="inline-flex"
			style:gap="8px"
			style:align-items="center"
			style:font-size="14px"
			style:letter-spacing="0.18em"
			style:color="var(--ink-mute)"
		>
			<span style:font-size="16px" style:color="var(--ink-dim)">{item.glyph}</span>
			<span>{item.label}</span>
		</span>
	{/each}
</div>
