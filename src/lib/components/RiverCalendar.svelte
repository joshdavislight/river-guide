<!--
  RiverCalendar.svelte
  Main calendar orchestrator - owns state and composes sub-components
-->
<script lang="ts">
	import type { CalendarRiver, PermitFilterValue, ClassFilterValue, SortByValue } from '$lib/types/calendar';
	import { getMonthStatus } from '$lib/utils/parseRiverSeasons';
	import CalendarFilters from './CalendarFilters.svelte';
	import CalendarLegend from './CalendarLegend.svelte';
	import CalendarGrid from './CalendarGrid.svelte';
	import CalendarPopup from './CalendarPopup.svelte';

	interface Props {
		rivers: CalendarRiver[];
	}

	let { rivers }: Props = $props();

	// Filter state
	let searchQuery = $state('');
	let permitFilter = $state<PermitFilterValue>('all');
	let classFilter = $state<ClassFilterValue>('all');
	let sortBy = $state<SortByValue>('name');
	let monthFilter = $state<number | null>(null);

	// Popup state
	let selectedCell = $state<{ river: CalendarRiver; month: number } | null>(null);

	// Filtered and sorted rivers
	const filteredRivers = $derived(() => {
		let result = rivers.filter((river) => {
			// Search filter
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				if (
					!river.name.toLowerCase().includes(query) &&
					!river.state.toLowerCase().includes(query)
				) {
					return false;
				}
			}

			// Permit difficulty filter
			if (permitFilter !== 'all') {
				const difficulty = river.ratings?.permitDifficulty ?? 0;
				if (difficulty !== parseInt(permitFilter)) {
					return false;
				}
			}

			// Class filter
			if (classFilter !== 'all') {
				const classMax = river.classMax ?? 0;
				const classNum = parseInt(classFilter);
				if (classMax < classNum || classMax > classNum + 0.9) {
					return false;
				}
			}

			// Month filter - show rivers where this month is optimal or good
			if (monthFilter !== null && river.seasons) {
				const status = getMonthStatus(river.seasons, monthFilter);
				if (status !== 'optimal' && status !== 'good') {
					return false;
				}
			}

			return true;
		});

		// Sort
		result.sort((a, b) => {
			if (sortBy === 'state') {
				return a.state.localeCompare(b.state) || a.name.localeCompare(b.name);
			}
			return a.name.localeCompare(b.name);
		});

		return result;
	});

	// Event handlers
	function handleCellClick(river: CalendarRiver, month: number) {
		selectedCell = { river, month };
	}

	function closePopup() {
		selectedCell = null;
	}

	function toggleMonthFilter(month: number) {
		if (monthFilter === month) {
			monthFilter = null;
		} else {
			monthFilter = month;
		}
	}
</script>

<div class="space-y-4">
	<CalendarFilters
		{searchQuery}
		{permitFilter}
		{classFilter}
		{sortBy}
		{monthFilter}
		onSearchChange={(v) => (searchQuery = v)}
		onPermitChange={(v) => (permitFilter = v)}
		onClassChange={(v) => (classFilter = v)}
		onSortChange={(v) => (sortBy = v)}
		onClearMonthFilter={() => (monthFilter = null)}
	/>

	<CalendarLegend />

	<!-- Results count -->
	<div class="text-sm text-text-muted">
		{filteredRivers().length} of {rivers.length} rivers
	</div>

	<CalendarGrid
		rivers={filteredRivers()}
		{monthFilter}
		onMonthClick={toggleMonthFilter}
		onCellClick={handleCellClick}
	/>
</div>

<CalendarPopup
	river={selectedCell?.river ?? null}
	month={selectedCell?.month ?? null}
	onClose={closePopup}
/>
