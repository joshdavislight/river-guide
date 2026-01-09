<!--
  CalendarFilters.svelte
  Filter controls for calendar view: search, permit, class, sort, and month chip
-->
<script lang="ts">
	import { X } from 'lucide-svelte';
	import type { PermitFilterValue, ClassFilterValue, SortByValue } from '$lib/types/calendar';

	const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	interface Props {
		searchQuery: string;
		permitFilter: PermitFilterValue;
		classFilter: ClassFilterValue;
		sortBy: SortByValue;
		monthFilter: number | null;
		onSearchChange: (value: string) => void;
		onPermitChange: (value: PermitFilterValue) => void;
		onClassChange: (value: ClassFilterValue) => void;
		onSortChange: (value: SortByValue) => void;
		onClearMonthFilter: () => void;
	}

	let {
		searchQuery,
		permitFilter,
		classFilter,
		sortBy,
		monthFilter,
		onSearchChange,
		onPermitChange,
		onClassChange,
		onSortChange,
		onClearMonthFilter
	}: Props = $props();
</script>

<div class="glass-card rounded-xl p-4">
	<div class="flex flex-wrap items-center gap-4">
		<!-- Search -->
		<div class="min-w-[200px] flex-1">
			<input
				type="text"
				placeholder="Search rivers..."
				value={searchQuery}
				oninput={(e) => onSearchChange(e.currentTarget.value)}
				class="w-full rounded-lg border border-border-subtle bg-bg-surface px-4 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent-primary/50 focus:outline-none"
			/>
		</div>

		<!-- Permit filter -->
		<select
			value={permitFilter}
			onchange={(e) => onPermitChange(e.currentTarget.value as PermitFilterValue)}
			class="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent-primary/50 focus:outline-none"
		>
			<option value="all">All Permits</option>
			<option value="1">Permit: 1</option>
			<option value="2">Permit: 2</option>
			<option value="3">Permit: 3</option>
			<option value="4">Permit: 4</option>
			<option value="5">Permit: 5</option>
		</select>

		<!-- Class filter -->
		<select
			value={classFilter}
			onchange={(e) => onClassChange(e.currentTarget.value as ClassFilterValue)}
			class="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent-primary/50 focus:outline-none"
		>
			<option value="all">All Classes</option>
			<option value="II">Class II</option>
			<option value="III">Class III</option>
			<option value="IV">Class IV</option>
			<option value="V">Class V</option>
		</select>

		<!-- Sort -->
		<select
			value={sortBy}
			onchange={(e) => onSortChange(e.currentTarget.value as SortByValue)}
			class="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent-primary/50 focus:outline-none"
		>
			<option value="name">Sort by Name</option>
			<option value="state">Sort by State</option>
		</select>

		<!-- Active month filter chip -->
		{#if monthFilter !== null}
			<button
				onclick={onClearMonthFilter}
				class="flex items-center gap-1.5 rounded-full bg-accent-primary/20 px-3 py-1.5 text-xs font-medium text-accent-primary hover:bg-accent-primary/30"
			>
				{MONTHS[monthFilter - 1]} rivers
				<X class="h-3 w-3" />
			</button>
		{/if}
	</div>
</div>

