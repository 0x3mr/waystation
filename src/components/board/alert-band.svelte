<script>
	import * as t from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import { formatTimestamp, translate } from '$lib/formatters.js';

	let { situation } = $props();

	const rawHeadline = $derived(situation?.summary?.value?.trim?.() ?? '');
	const rawBody = $derived(situation?.description?.value?.trim?.() ?? '');
	const activeWindow = $derived(situation?.activeWindows?.[0]);
	const windowStart = $derived(activeWindow?.from ? formatTimestamp(activeWindow.from) : '');
	const windowEnd = $derived(activeWindow?.to ? formatTimestamp(activeWindow.to) : '');
	const severity = $derived(situation?.severity?.toLowerCase?.() ?? 'alert');
	const isRTL = $derived(getLocale() === 'ar');

	let translated = $state({ headline: '', body: '' });

	$effect(() => {
		const locale = getLocale();
		const headline = rawHeadline;
		const body = rawBody;
		let cancelled = false;

		if (!headline || locale === 'en') {
			translated = { headline, body };
			return;
		}

		// Show the new alert's raw text while its translation is in flight rather
		// than the previous alert's translated text.
		translated = { headline: '', body: '' };

		Promise.all([translate(headline, locale), body ? translate(body, locale) : ''])
			.then(([h, b]) => {
				if (!cancelled) translated = { headline: h, body: b };
			})
			.catch(() => {
				if (!cancelled) translated = { headline, body };
			});

		return () => {
			cancelled = true;
		};
	});

	const headline = $derived(translated.headline || rawHeadline);
	const body = $derived(translated.body || rawBody);
</script>

<div
	class="alert-badge alert-{severity}"
	style:display="grid"
	style:grid-template-columns="auto 1fr auto"
	style:gap="22px"
	style:align-items="center"
	style:padding="12px 20px"
	style:border-radius="4px"
>
	<div
		class="alert-glyph"
		style:width="44px"
		style:height="44px"
		style:display="grid"
		style:place-items="center"
		style:border="2px solid currentColor"
	>
		<span style:font-size="26px" style:font-weight="800" style:line-height="1">!</span>
	</div>
	<div
		style:min-width="0"
		style:direction={isRTL ? 'rtl' : 'ltr'}
		style:text-align={isRTL ? 'right' : 'left'}
	>
		<div
			style:font-size="24px"
			style:font-weight="600"
			style:line-height="1.2"
			style:color="var(--ink)"
			style:white-space="nowrap"
			style:overflow="hidden"
			style:text-overflow="ellipsis"
		>
			{headline}
		</div>
		{#if body}
			<div
				style:font-size="18px"
				style:line-height="1.25"
				style:color="var(--ink-dim)"
				style:margin-top="3px"
				style:white-space="nowrap"
				style:overflow="hidden"
				style:text-overflow="ellipsis"
			>
				{body}
			</div>
		{/if}
	</div>
	<div
		class="sc"
		style:font-size="13px"
		style:letter-spacing="0.2em"
		style:color="var(--ink-mute)"
		style:text-align="right"
		style:white-space="nowrap"
	>
		{t.board_service_advisory()}
		{#if windowStart}
			<br />{windowStart}{#if windowEnd}
				{isRTL ? '←' : '→'} {windowEnd}{/if}
		{/if}
	</div>
</div>
