<script>
	import { page } from '$app/state';
	import { DEFAULT_LOGO_URL, DEFAULT_REGION_NAME } from '$lib/config/branding.js';

	// Layout data is present unless the root layout load itself failed.
	const icon = $derived(page.data?.logoUrl || DEFAULT_LOGO_URL);
	const name = $derived(page.data?.regionName || DEFAULT_REGION_NAME);
</script>

<div
	class="text-brand-darkerblue flex h-screen flex-col items-center justify-center gap-y-10 whitespace-nowrap"
>
	<div class="flex items-center gap-x-5 text-6xl font-bold">
		<img src={icon} alt="Homepage" class="aspect-square w-16 rounded-sm" />
		<span>{name}</span>
	</div>
	<div class="text-brand-red text-9xl font-black">Out of Service!</div>
	<span class="text-3xl font-semibold">We will be back shortly...</span>
</div>
