<script>
	import { PUBLIC_OBA_LOGO_URL, PUBLIC_OBA_REGION_NAME } from '$env/static/public';
	import { buildBrandingCss } from '$lib/config/branding.js';
	import '../app.css';

	let { children, data } = $props();

	const logoUrl = $derived(data?.branding?.logoUrl || PUBLIC_OBA_LOGO_URL);
	const regionName = $derived(data?.branding?.regionName || PUBLIC_OBA_REGION_NAME);
	const brandingStyle = $derived(buildBrandingCss(data?.branding ?? {}));
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={logoUrl} />
	<title>{regionName}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	{#if brandingStyle}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<style id="waystation-branding">${brandingStyle}</style>`}
	{/if}
</svelte:head>

{@render children()}
