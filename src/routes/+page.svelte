<script lang="ts">
	import {
		SlidersHorizontal,
		LayoutGrid,
		List,
		MapPin,
		Waves,
		ArrowUpDown,
		ChevronUp,
		ChevronDown
	} from 'lucide-svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import RiverCard from '$lib/components/RiverCard.svelte';
	import PermitBadge from '$lib/components/PermitBadge.svelte';
	import { formatMonthDay, getDeadlineInfo } from '$lib/utils/dates';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Read search query from URL (only in browser, empty during prerender)
	const searchQuery = $derived(browser ? ($page.url.searchParams.get('q') ?? '') : '');
	let showFilters = $state(false);
	let selectedState = $state('all');
	let selectedPermit = $state('all');
	let viewMode = $state<'cards' | 'table'>('table');

	// Sorting state for table view
	let sortColumn = $state<string>('name');
	let sortDirection = $state<'asc' | 'desc'>('asc');

	// Get unique states for filter
	const states = $derived(Array.from(new Set(data.rivers.map((r) => r.state))).sort());

	// Filter rivers based on search and filters
	const filteredRivers = $derived(
		data.rivers.filter((river) => {
			// Search filter
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const matchesName = river.name.toLowerCase().includes(query);
				const matchesState = river.state.toLowerCase().includes(query);
				const matchesTags = river.tags?.some((tag) => tag.toLowerCase().includes(query));
				if (!matchesName && !matchesState && !matchesTags) return false;
			}

			// State filter
			if (selectedState !== 'all' && river.state !== selectedState) return false;

			// Permit filter
			if (selectedPermit !== 'all') {
				const difficulty = river.ratings?.permitDifficulty ?? 0;
				if (selectedPermit === 'lottery' && difficulty < 4) return false;
				if (selectedPermit === 'easy' && difficulty > 2) return false;
				if (selectedPermit === 'none' && river.permit?.required !== false) return false;
			}

			return true;
		})
	);

	// Sort rivers based on current sort settings
	const sortedRivers = $derived(() => {
		const rivers = [...filteredRivers];

		rivers.sort((a, b) => {
			let comparison = 0;

			switch (sortColumn) {
				case 'name':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'state':
					comparison = a.state.localeCompare(b.state);
					break;
				case 'miles':
					comparison = a.miles - b.miles;
					break;
				case 'days':
					comparison = a.daysMin - b.daysMin;
					break;
				case 'permit':
					comparison =
						(a.ratings?.permitDifficulty ?? 0) - (b.ratings?.permitDifficulty ?? 0);
					break;
				case 'class':
					comparison = (a.classMax ?? 0) - (b.classMax ?? 0);
					break;
				default:
					comparison = a.name.localeCompare(b.name);
			}

			return sortDirection === 'asc' ? comparison : -comparison;
		});

		return rivers;
	});

	function toggleSort(column: string) {
		if (sortColumn === column) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column;
			sortDirection = 'asc';
		}
	}

	function getPermitDeadline(river: (typeof data.rivers)[0]): string | null {
		// No permit required
		if (river.permit?.required === false) return 'No permit required';

		// No permit info at all
		if (!river.permit) return null;

		// Check if lottery window has valid dates
		const lotteryWindow = river.permit.lotteryWindow;
		if (!lotteryWindow?.open || !lotteryWindow?.close) {
			// No lottery - check for rolling availability or self-issue in system string
			const system = river.permit.system;
			if (system) {
				// Check for self-issue permits
				if (system.toLowerCase().includes('self-issue') || system.toLowerCase().includes('self issue')) {
					return 'Self issue';
				}
				// Extract number of days from patterns like "(60 days advance)" or "(60 days)"
				const match = system.match(/\((\d+)\s*days/i);
				if (match) {
					return `Rolling - ${match[1]} days`;
				}
			}
			return null;
		}

		const info = getDeadlineInfo(lotteryWindow);
		if (!info) return null;

		if (info.status === 'open') {
			return `Closes ${info.closesOn}`;
		} else if (info.status === 'upcoming' && info.daysUntilOpen && info.daysUntilOpen <= 60) {
			return `Opens ${info.opensOn}`;
		}
		return info.opensOn ? `Opens ${info.opensOn}` : null;
	}

	function isLotteryClosingSoon(river: (typeof data.rivers)[0]): boolean {
		const lotteryWindow = river.permit?.lotteryWindow;
		if (!lotteryWindow?.open || !lotteryWindow?.close) return false;

		const info = getDeadlineInfo(lotteryWindow);
		if (!info) return false;

		// Check if lottery is open and closing within 30 days
		return info.status === 'open' && (info.daysUntilClose ?? 999) <= 30;
	}

	function isSelfIssuePermit(river: (typeof data.rivers)[0]): boolean {
		const system = river.permit?.system?.toLowerCase() ?? '';
		return system.includes('self-issue') || 
			system.includes('self issue') || 
			system.includes('boater pass') ||
			system.includes('first-come') ||
			system.includes('fcfs');
	}
</script>

<svelte:head>
	<title>River Guide — Multi-day Rafting Rivers</title>
	<meta property="og:title" content="River Guide — Multi-day Rafting Rivers" />
	<meta property="og:description" content="Flow data, permits, and trip planning for Western US rivers." />
	<meta property="og:url" content="https://rivers.saltyfox.xyz/" />
	<meta name="twitter:title" content="River Guide — Multi-day Rafting Rivers" />
	<meta name="twitter:description" content="Flow data, permits, and trip planning for Western US rivers." />
	<link rel="canonical" href="https://rivers.saltyfox.xyz/" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header with title and controls -->
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-text-primary sm:text-4xl">Multi-day Rafting Rivers</h1>
			<p class="mt-1 text-text-secondary">Flow data, permits, and trip planning for Western US rivers.</p>
			{#if searchQuery}
				<p class="mt-2 text-sm text-text-muted">
					Showing results for "<span class="font-medium text-accent-primary">{searchQuery}</span>"
				</p>
			{/if}
		</div>

		<div class="flex shrink-0 gap-2">
			<!-- View toggle -->
			<div class="flex rounded-xl border border-border-default bg-bg-elevated p-1">
				<button
					type="button"
					onclick={() => (viewMode = 'cards')}
					class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors
						{viewMode === 'cards'
						? 'bg-accent-primary/20 text-accent-primary'
						: 'text-text-secondary hover:text-text-primary'}"
					aria-label="Card view"
				>
					<LayoutGrid class="h-4 w-4" />
					<span class="hidden sm:inline">Cards</span>
				</button>
				<button
					type="button"
					onclick={() => (viewMode = 'table')}
					class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors
						{viewMode === 'table'
						? 'bg-accent-primary/20 text-accent-primary'
						: 'text-text-secondary hover:text-text-primary'}"
					aria-label="Table view"
				>
					<List class="h-4 w-4" />
					<span class="hidden sm:inline">Table</span>
				</button>
			</div>

			<button
				type="button"
				onclick={() => (showFilters = !showFilters)}
				class="flex items-center justify-center gap-2 rounded-xl border px-4 py-2 font-medium transition-colors
					{showFilters
					? 'border-accent-primary/50 bg-accent-primary/10 text-accent-primary'
					: 'border-border-default bg-bg-elevated text-text-secondary hover:bg-bg-surface hover:text-text-primary'}"
			>
				<SlidersHorizontal class="h-5 w-5" />
				<span class="hidden sm:inline">Filters</span>
				{#if selectedState !== 'all' || selectedPermit !== 'all'}
					<span
						class="flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary text-xs text-white"
					>
						{(selectedState !== 'all' ? 1 : 0) + (selectedPermit !== 'all' ? 1 : 0)}
					</span>
				{/if}
			</button>
		</div>
	</div>

	<!-- Filter panel -->
	{#if showFilters}
		<div class="glass-card mb-6 rounded-xl p-4 sm:p-6">
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<!-- State filter -->
				<div>
					<label for="state-filter" class="mb-2 block text-sm font-medium text-text-secondary">
						State
					</label>
					<select
						id="state-filter"
						bind:value={selectedState}
						class="w-full rounded-lg border border-border-subtle bg-bg-surface px-4 py-2 text-text-primary focus:border-accent-primary/50 focus:outline-none"
					>
						<option value="all">All States</option>
						{#each states as state}
							<option value={state}>{state}</option>
						{/each}
					</select>
				</div>

				<!-- Permit filter -->
				<div>
					<label for="permit-filter" class="mb-2 block text-sm font-medium text-text-secondary">
						Permit Type
					</label>
					<select
						id="permit-filter"
						bind:value={selectedPermit}
						class="w-full rounded-lg border border-border-subtle bg-bg-surface px-4 py-2 text-text-primary focus:border-accent-primary/50 focus:outline-none"
					>
						<option value="all">All Permits</option>
						<option value="lottery">Lottery Only</option>
						<option value="easy">Easy Permit</option>
						<option value="none">No Permit</option>
					</select>
				</div>

				<!-- Clear filters -->
				<div class="flex items-end">
					<button
						type="button"
						onclick={() => {
							selectedState = 'all';
							selectedPermit = 'all';
							goto('/', { replaceState: true, noScroll: true });
						}}
						class="rounded-lg px-4 py-2 text-sm text-text-muted transition-colors hover:text-text-primary"
					>
						Clear all filters
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Results count -->
	<div class="mb-4 flex items-center justify-between">
		<p class="text-sm text-text-muted">
			{#if sortedRivers().length === data.rivers.length}
				{data.rivers.length} rivers
			{:else}
				{sortedRivers().length} of {data.rivers.length} rivers
			{/if}
		</p>
	</div>

	<!-- Card View -->
	{#if viewMode === 'cards'}
		{#if sortedRivers().length > 0}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each sortedRivers() as river (river.slug)}
					<RiverCard {river} />
				{/each}
			</div>
		{:else}
			<div class="glass-card flex h-64 flex-col items-center justify-center rounded-xl">
				<Waves class="mb-4 h-12 w-12 text-text-muted" />
				<p class="text-lg font-medium text-text-primary">No rivers found</p>
				<p class="mt-1 text-text-secondary">Try adjusting your search or filters</p>
			</div>
		{/if}
	{/if}

	<!-- Table View -->
	{#if viewMode === 'table'}
		{#if sortedRivers().length > 0}
			<div class="glass-card overflow-hidden rounded-xl">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-border-subtle bg-bg-elevated/50">
								<th class="px-4 py-3 text-left">
									<button
										type="button"
										onclick={() => toggleSort('name')}
										class="flex items-center gap-1 text-sm font-semibold text-text-primary hover:text-accent-primary"
									>
										River
										{#if sortColumn === 'name'}
											{#if sortDirection === 'asc'}
												<ChevronUp class="h-4 w-4" />
											{:else}
												<ChevronDown class="h-4 w-4" />
											{/if}
										{:else}
											<ArrowUpDown class="h-3 w-3 text-text-muted" />
										{/if}
									</button>
								</th>
								<th class="px-4 py-3 text-left">
									<button
										type="button"
										onclick={() => toggleSort('state')}
										class="flex items-center gap-1 text-sm font-semibold text-text-primary hover:text-accent-primary"
									>
										Location
										{#if sortColumn === 'state'}
											{#if sortDirection === 'asc'}
												<ChevronUp class="h-4 w-4" />
											{:else}
												<ChevronDown class="h-4 w-4" />
											{/if}
										{:else}
											<ArrowUpDown class="h-3 w-3 text-text-muted" />
										{/if}
									</button>
								</th>
								<th class="hidden px-4 py-3 text-left sm:table-cell">
									<button
										type="button"
										onclick={() => toggleSort('class')}
										class="flex items-center gap-1 text-sm font-semibold text-text-primary hover:text-accent-primary"
									>
										Class
										{#if sortColumn === 'class'}
											{#if sortDirection === 'asc'}
												<ChevronUp class="h-4 w-4" />
											{:else}
												<ChevronDown class="h-4 w-4" />
											{/if}
										{:else}
											<ArrowUpDown class="h-3 w-3 text-text-muted" />
										{/if}
									</button>
								</th>
								<th class="hidden px-4 py-3 text-left md:table-cell">
									<button
										type="button"
										onclick={() => toggleSort('miles')}
										class="flex items-center gap-1 text-sm font-semibold text-text-primary hover:text-accent-primary"
									>
										Miles
										{#if sortColumn === 'miles'}
											{#if sortDirection === 'asc'}
												<ChevronUp class="h-4 w-4" />
											{:else}
												<ChevronDown class="h-4 w-4" />
											{/if}
										{:else}
											<ArrowUpDown class="h-3 w-3 text-text-muted" />
										{/if}
									</button>
								</th>
								<th class="hidden px-4 py-3 text-left lg:table-cell">
									<button
										type="button"
										onclick={() => toggleSort('days')}
										class="flex items-center gap-1 text-sm font-semibold text-text-primary hover:text-accent-primary"
									>
										Days
										{#if sortColumn === 'days'}
											{#if sortDirection === 'asc'}
												<ChevronUp class="h-4 w-4" />
											{:else}
												<ChevronDown class="h-4 w-4" />
											{/if}
										{:else}
											<ArrowUpDown class="h-3 w-3 text-text-muted" />
										{/if}
									</button>
								</th>
								<th class="hidden px-4 py-3 text-left lg:table-cell">
									<span class="text-sm font-semibold text-text-primary">Season</span>
								</th>
								<th class="px-4 py-3 text-left">
									<button
										type="button"
										onclick={() => toggleSort('permit')}
										class="flex items-center gap-1 text-sm font-semibold text-text-primary hover:text-accent-primary"
									>
										Permit
										{#if sortColumn === 'permit'}
											{#if sortDirection === 'asc'}
												<ChevronUp class="h-4 w-4" />
											{:else}
												<ChevronDown class="h-4 w-4" />
											{/if}
										{:else}
											<ArrowUpDown class="h-3 w-3 text-text-muted" />
										{/if}
									</button>
								</th>
								<th class="hidden px-4 py-3 text-left xl:table-cell">
									<span class="text-sm font-semibold text-text-primary">Deadline</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border-subtle">
							{#each sortedRivers() as river (river.slug)}
								<tr
									class="group cursor-pointer transition-colors hover:bg-bg-elevated/50"
									onclick={() => (window.location.href = `/rivers/${river.slug}`)}
								>
									<td class="px-4 py-3">
										<a
											href="/rivers/{river.slug}"
											class="font-medium text-text-primary transition-colors group-hover:text-accent-primary"
										>
											{river.name}
										</a>
									</td>
									<td class="px-4 py-3">
										<span class="flex items-center gap-1 text-sm text-text-secondary">
											<MapPin class="h-3.5 w-3.5" />
											{river.state}
										</span>
									</td>
									<td class="hidden px-4 py-3 sm:table-cell">
										<span class="font-medium text-accent-primary">{river.class}</span>
									</td>
									<td class="hidden px-4 py-3 md:table-cell">
										<span class="font-mono text-sm text-text-secondary">{river.miles}</span>
									</td>
									<td class="hidden px-4 py-3 lg:table-cell">
										<span class="text-sm text-text-secondary">
											{river.daysMin}-{river.daysMax}
										</span>
									</td>
									<td class="hidden px-4 py-3 lg:table-cell">
										{#if river.flows?.season}
											<span class="text-sm font-medium text-accent-primary">{river.flows.season}</span>
										{:else}
											<span class="text-sm text-text-muted">—</span>
										{/if}
									</td>
									<td class="px-4 py-3">
										{#if river.ratings?.permitDifficulty || river.permit?.required === false || isSelfIssuePermit(river)}
											<PermitBadge 
												difficulty={river.ratings?.permitDifficulty ?? 1} 
												permitRequired={river.permit?.required !== false}
												isSelfIssue={isSelfIssuePermit(river)}
												compact 
											/>
										{:else}
											<span class="text-sm text-text-muted">—</span>
										{/if}
									</td>
									<td class="hidden px-4 py-3 xl:table-cell">
										{#if getPermitDeadline(river)}
											{@const deadline = getPermitDeadline(river)}
											{@const closingSoon = isLotteryClosingSoon(river)}
											<span class="text-sm {closingSoon ? 'font-medium text-amber-400' : 'text-text-secondary'}">
												{deadline}
											</span>
										{:else}
											<span class="text-sm text-text-muted">—</span>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{:else}
			<div class="glass-card flex h-64 flex-col items-center justify-center rounded-xl">
				<Waves class="mb-4 h-12 w-12 text-text-muted" />
				<p class="text-lg font-medium text-text-primary">No rivers found</p>
				<p class="mt-1 text-text-secondary">Try adjusting your search or filters</p>
			</div>
		{/if}
	{/if}
</div>
