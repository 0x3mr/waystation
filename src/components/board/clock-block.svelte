<script>
	import { formatDate } from '$lib/formatters.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let { now } = $props();

	const dateText = $derived(formatDate(now));

	// Force Latin numerals via Unicode extension (ar-u-nu-latn).
	// Split into hm (numeric, always LTR) and ap (period marker, locale-aware).
	// In the board's LTR rendering context, ap is placed first in DOM so it
	// appears on the LEFT — which is the RTL end the user reads last.
	const timeParts = $derived.by(() => {
		const locale = getLocale();
		const latinLocale = `${locale}-u-nu-latn`;
		const parts = new Intl.DateTimeFormat(latinLocale, {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		}).formatToParts(now);
		const hm = parts
			.filter((p) => ['hour', 'literal', 'minute'].includes(p.type))
			.map((p) => p.value)
			.join('');
		const ap = parts.find((p) => p.type === 'dayPeriod')?.value ?? '';
		return { hm, ap };
	});

	const seconds = $derived(now.getSeconds().toString().padStart(2, '0'));
	const isRTL = $derived(getLocale() === 'ar');
</script>

<div style:text-align="right">
	<div
		class="sc"
		style:font-size="18px"
		style:letter-spacing="0.22em"
		style:color="var(--ink-mute)"
		style:margin-bottom="4px"
	>
		{dateText}
	</div>
	<div
		class="mono display"
		style:font-size="52px"
		style:font-weight="600"
		style:line-height="1"
		style:letter-spacing="-0.02em"
		style:color="var(--accent)"
		style:white-space="nowrap"
		style:display="flex"
		style:align-items="baseline"
		style:justify-content="flex-end"
		style:gap="4px"
	>
		{#if isRTL && timeParts.ap}
			<span style:color="var(--ink-dim)" style:font-weight="400" style:font-size="28px"
				>{timeParts.ap}</span
			>
		{/if}
		<span dir="ltr"
			>{timeParts.hm}<span
				style:color="var(--ink-dim)"
				style:font-weight="400"
				style:font-size="32px">:{seconds}</span
			></span
		>
		{#if !isRTL && timeParts.ap}
			<span style:color="var(--ink-dim)" style:font-weight="400" style:font-size="28px"
				>{timeParts.ap}</span
			>
		{/if}
	</div>
</div>
