<script>
	import {
		formatArrivalStatus,
		generateRandomID,
		removeDuplicates,
		sortEarliestDepartures
	} from '$lib/formatters';

	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';

	import * as t from '$lib/paraglide/messages.js';
	import Alerts from '$components/alerts/alerts.svelte';
	import Departure from '$components/departures/departure.svelte';

	let { stopIDs = [] } = $props();

	let footerHeight = $state(0);
	let sideDisplay = $state(false);

	let allDepartures = $state([]);
	let situations = $state([]);
	let loading = $state(true);

	let interval;

	const REFRESH_INTERVAL = 30000; // todo: make it a configurable option
	const MAX_DEPARTURES = 99;

	function stopRequestDataModel(dep, stopID, stopName) {
		const status = formatArrivalStatus(dep.predictedDepartureTime, dep.scheduledDepartureTime);
		const id = generateRandomID(dep.tripId, dep.stopId);

		return {
			...dep,
			stopID,
			status,
			stopName,
			uniqueId: id
		};
	}

	async function obaAPI(stopID) {
		const response = await fetch(`/api/oba/arrivals-and-departures-for-stop/${stopID}`);
		if (!response) throw new Error(`Fetch Error: Failed to fetch stop ${stopID}`);
		const json = await response.json();

		if (
			!json?.data?.references?.stops ||
			!json?.data?.entry?.arrivalsAndDepartures ||
			!json?.data?.references?.situations
		) {
			throw new Error(`Malformed API response for stop ${stopID}`);
		}

		return {
			stopID,
			stopName:
				Object.values(json.data.references.stops).find((targetStop) => targetStop.id === stopID)
					?.name ?? `Stop #` + stopID.split('_')[1],
			departures: json.data.entry.arrivalsAndDepartures,
			situations: json.data.references?.situations || []
		};
	}

	export async function fetchStops() {
		loading = true;
		try {
			const response = await Promise.all(stopIDs.map(async (id) => obaAPI(id)));

			allDepartures = response.flatMap((eachResponse) => {
				const stopID = eachResponse.stopID;
				const stopName = eachResponse.stopName;
				const departures = eachResponse.departures;

				return departures.map((dep) => {
					return stopRequestDataModel(dep, stopID, stopName);
				});
			});

			situations = response.flatMap((eachSituation) => eachSituation.situations);

			allDepartures = allDepartures.filter((dep) => dep.status !== null);
			allDepartures = removeDuplicates(allDepartures);
			allDepartures = sortEarliestDepartures(allDepartures);
			allDepartures = allDepartures.slice(0, MAX_DEPARTURES);
		} catch (error) {
			console.error('Error fetching stops:', error);
			allDepartures = [];
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		await fetchStops();

		if (browser) {
			clearInterval(interval);
			sideDisplay = window.innerWidth > 1680;
			interval = setInterval(fetchStops, REFRESH_INTERVAL);
			footerHeight = document.getElementById('footer').offsetHeight;
		}
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="flex flex-1 overflow-hidden">
	<div class="text-brand-darkblue flex flex-1 flex-col overflow-y-auto">
		{#if loading}
			<div class="flex h-[6.667vw] items-center justify-center">
				<p class="text-[1.542vw]">{t.controller_loading()}</p>
			</div>
		{:else if allDepartures.length > 0}
			<div class="flex flex-col">
				{#each allDepartures as dep (dep.uniqueId)}
					{#if dep.status}
						<Departure {dep} />
					{/if}
				{/each}
			</div>
		{:else}
			<div class="flex h-[6.667vw] items-center justify-center">
				<p class="text-[1.542vw]">{t.controller_unavailable()}</p>
			</div>
		{/if}
	</div>

	{#if situations.length > 0 && situations[0].summary?.value && allDepartures.length > 0}
		{#if sideDisplay}
			<div class="flex-shrink-0 basis-[35%] overflow-y-auto">
				<Alerts {situations} displayMode={sideDisplay} />
			</div>
		{:else}
			<div class="fixed" style={`bottom: ${footerHeight}px`}>
				<Alerts {situations} displayMode={sideDisplay} />
			</div>
		{/if}
	{/if}
</div>
