<script>
	import { buildBrandingCss } from '$lib/config/branding.js';
	import '../app.css';

	let { children, data } = $props();

	const brandingStyle = $derived(buildBrandingCss(data.branding));
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={data.logoUrl} />
	<title>{data.regionName}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	{#if brandingStyle}
		<!-- brandingStyle only ever contains server-validated hex colors -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<style>${brandingStyle}</style>`}
	{/if}
</svelte:head>

{@render children()}
