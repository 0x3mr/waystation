<script>
	import '../app.css';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={data.logoUrl} />
	<title>{data.regionName}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	{#if data.brandingCss}
		<!-- brandingCss only ever contains server-validated hex colors -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<style>${data.brandingCss}</style>`}
	{/if}
</svelte:head>

{@render children()}
