<script lang="ts">
	import { X, MapPin, Waves, Calendar, AlertTriangle, Info, Lightbulb } from 'lucide-svelte';
	import PermitBadge from './PermitBadge.svelte';
	import type { SeasonData, Caveat } from '$lib/utils/parseRiverSeasons';
	import { getMonthStatus, getSeverityLabel, getSeverityHeading } from '$lib/utils/parseRiverSeasons';

	interface River {
		name: string;
		slug: string;
		state: string;
		class: string;
		classMax?: number;
		daysMin: number;
		daysMax: number;
		ratings?: {
			permitDifficulty?: number;
			amazingness?: number;
		};
		permit?: {
			required?: boolean;
			system?: string;
			controlSeason?: {
				start?: string; // "MM-DD" format
				end?: string;
			};
		};
		flows?: {
			season?: string;
		};
		seasons?: SeasonData;
	}

	interface Props {
		rivers: River[];
	}

	let { rivers }: Props = $props();

	// Months for header
	const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	// Search and filter state
	let searchQuery = $state('');
	let permitFilter = $state<'all' | '1' | '2' | '3' | '4' | '5'>('all');
	let classFilter = $state<'all' | 'II' | 'III' | 'IV' | 'V'>('all');
	let sortBy = $state<'name' | 'state'>('name');
	let monthFilter = $state<number | null>(null);

	// Popup state
	let selectedCell = $state<{ river: River; month: number } | null>(null);

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

	// Get cell background color based on status
	function getCellBg(status: 'optimal' | 'good' | 'avoid' | 'poor'): string {
		switch (status) {
			case 'optimal':
				return 'bg-emerald-500/90';
			case 'good':
				return 'bg-blue-500/70';
			case 'avoid':
				return 'bg-red-500/70';
			case 'poor':
				return 'bg-slate-700/30';
		}
	}

	// Get status label for display
	function getStatusLabel(status: 'optimal' | 'good' | 'avoid' | 'poor'): string {
		switch (status) {
			case 'optimal':
				return 'Optimal';
			case 'good':
				return 'Good';
			case 'avoid':
				return 'Avoid';
			case 'poor':
				return 'Off-season';
		}
	}

	// Get caveat icon color
	function getCaveatDotColor(severity: Caveat['severity']): string {
		switch (severity) {
			case 'severe':
				return 'bg-yellow-400';
			case 'moderate':
				return 'bg-orange-400';
			case 'minor':
				return 'bg-slate-300';
		}
	}

	// Get caveat type label
	function getCaveatTypeLabel(type: Caveat['type']): string {
		switch (type) {
			case 'crowds':
				return 'Crowds';
			case 'heat':
				return 'Heat';
			case 'bugs':
				return 'Bugs';
			case 'flow-window':
				return 'Flow';
		}
	}

	// Handle cell click
	function handleCellClick(river: River, month: number) {
		selectedCell = { river, month };
	}

	// Close popup
	function closePopup() {
		selectedCell = null;
	}

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closePopup();
		}
	}

	// Toggle month filter when clicking header
	function toggleMonthFilter(month: number) {
		if (monthFilter === month) {
			monthFilter = null;
		} else {
			monthFilter = month;
		}
	}

	// Check if permit is self-issue
	function isSelfIssue(river: River): boolean {
		const system = river.permit?.system?.toLowerCase() ?? '';
		return (
			system.includes('self-issue') ||
			system.includes('self issue') ||
			system.includes('boater pass') ||
			system.includes('first-come') ||
			system.includes('fcfs')
		);
	}

	// Extract month from "MM-DD" format
	function getMonthFromDate(dateStr: string | undefined): number | null {
		if (!dateStr) return null;
		const match = dateStr.match(/^(\d{1,2})-/);
		return match ? parseInt(match[1], 10) : null;
	}

	// Get permit season info for a river
	function getPermitSeasonInfo(river: River): {
		startMonth: number | null;
		endMonth: number | null;
		isLottery: boolean;
	} {
		const controlSeason = river.permit?.controlSeason;
		const startMonth = getMonthFromDate(controlSeason?.start);
		const endMonth = getMonthFromDate(controlSeason?.end);
		const isLottery = (river.ratings?.permitDifficulty ?? 0) >= 4;

		return { startMonth, endMonth, isLottery };
	}

	// Check if a month is within the control season
	function isInControlSeason(month: number, startMonth: number | null, endMonth: number | null): boolean {
		if (startMonth === null || endMonth === null) return false;
		
		// Handle season that wraps around year (e.g., Nov-Feb)
		if (startMonth <= endMonth) {
			return month >= startMonth && month <= endMonth;
		} else {
			return month >= startMonth || month <= endMonth;
		}
	}

	// Get bracket position for a month in the control season
	function getBracketPosition(
		month: number,
		startMonth: number | null,
		endMonth: number | null
	): 'start' | 'middle' | 'end' | 'single' | null {
		if (startMonth === null || endMonth === null) return null;
		if (!isInControlSeason(month, startMonth, endMonth)) return null;

		// Single month season
		if (startMonth === endMonth) return 'single';

		if (month === startMonth) return 'start';
		if (month === endMonth) return 'end';
		return 'middle';
	}

	// Get bracket CSS classes based on position and type
	function getBracketClasses(
		position: 'start' | 'middle' | 'end' | 'single' | null,
		isLottery: boolean
	): string {
		if (!position) return '';

		const color = isLottery ? 'border-amber-500' : 'border-slate-400';

		switch (position) {
			case 'single':
				return `border-2 ${color} rounded`;
			case 'start':
				return `border-l-2 border-t-2 border-b-2 ${color} rounded-l`;
			case 'end':
				return `border-r-2 border-t-2 border-b-2 ${color} rounded-r`;
			case 'middle':
				return `border-t-2 border-b-2 ${color}`;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="space-y-4">
	<!-- Filters -->
	<div class="glass-card rounded-xl p-4">
		<div class="flex flex-wrap items-center gap-4">
			<!-- Search -->
			<div class="flex-1 min-w-[200px]">
				<input
					type="text"
					placeholder="Search rivers..."
					bind:value={searchQuery}
					class="w-full rounded-lg border border-border-subtle bg-bg-surface px-4 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent-primary/50 focus:outline-none"
				/>
			</div>

			<!-- Permit filter -->
			<select
				bind:value={permitFilter}
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
				bind:value={classFilter}
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
				bind:value={sortBy}
				class="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent-primary/50 focus:outline-none"
			>
				<option value="name">Sort by Name</option>
				<option value="state">Sort by State</option>
			</select>

			<!-- Active filters indicator -->
			{#if monthFilter !== null}
				<button
					onclick={() => (monthFilter = null)}
					class="flex items-center gap-1.5 rounded-full bg-accent-primary/20 px-3 py-1.5 text-xs font-medium text-accent-primary hover:bg-accent-primary/30"
				>
					{MONTHS[monthFilter - 1]} rivers
					<X class="h-3 w-3" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Legend -->
	<div class="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
		<div class="flex items-center gap-2">
			<span class="h-3 w-3 rounded bg-emerald-500/90"></span>
			<span>Optimal</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="h-3 w-3 rounded bg-blue-500/70"></span>
			<span>Good</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="h-3 w-3 rounded bg-red-500/70"></span>
			<span>Avoid</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="h-3 w-3 rounded bg-slate-700/30"></span>
			<span>Off-season</span>
		</div>
		<span class="text-text-muted">|</span>
		<div class="flex items-center gap-2">
			<span class="h-2 w-2 rounded-full bg-yellow-400"></span>
			<span>⚠️ Be aware</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="h-2 w-2 rounded-full bg-orange-400"></span>
			<span>ℹ️ Note</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="h-2 w-2 rounded-full bg-slate-300"></span>
			<span>💡 Tip</span>
		</div>
		<span class="text-text-muted">|</span>
		<div class="flex items-center gap-2">
			<span class="h-3 w-6 rounded border-2 border-amber-500 bg-slate-700/30"></span>
			<span>Lottery Season</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="h-3 w-6 rounded border-2 border-slate-400 bg-slate-700/30"></span>
			<span>Permit Season</span>
		</div>
	</div>

	<!-- Results count -->
	<div class="text-sm text-text-muted">
		{filteredRivers().length} of {rivers.length} rivers
	</div>

	<!-- Calendar Grid -->
	<div class="glass-card overflow-hidden rounded-xl">
		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead class="sticky top-0 z-20">
					<tr class="bg-bg-elevated">
						<th
							class="sticky left-0 z-30 min-w-[200px] bg-bg-elevated px-4 py-3 text-left text-sm font-semibold text-text-primary"
						>
							River
						</th>
						{#each MONTHS as month, i}
							<th class="min-w-[48px] bg-bg-elevated px-1 py-3 text-center">
								<button
									onclick={() => toggleMonthFilter(i + 1)}
									class="rounded px-2 py-1 text-xs font-medium transition-colors {monthFilter === i + 1
										? 'bg-accent-primary/30 text-accent-primary'
										: 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'}"
								>
									{month}
								</button>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-border-subtle">
					{#each filteredRivers() as river (river.slug)}
						<tr class="group hover:bg-bg-elevated/30">
							<td
								class="sticky left-0 z-10 bg-bg-surface px-4 py-2 group-hover:bg-bg-elevated/50"
							>
								<a
									href="/rivers/{river.slug}"
									class="block font-medium text-text-primary transition-colors hover:text-accent-primary"
								>
									{river.name}
								</a>
								<span class="text-xs text-text-muted">{river.state}</span>
							</td>
								{#each MONTHS as _, monthIndex}
								{@const month = monthIndex + 1}
								{@const status = river.seasons
									? getMonthStatus(river.seasons, month)
									: 'poor'}
								{@const caveat = river.seasons?.caveats[month]}
								{@const permitInfo = getPermitSeasonInfo(river)}
								{@const bracketPos = getBracketPosition(month, permitInfo.startMonth, permitInfo.endMonth)}
								{@const bracketClasses = getBracketClasses(bracketPos, permitInfo.isLottery)}
								<td class="px-1 py-2">
									<button
										onclick={() => handleCellClick(river, month)}
										class="relative h-8 w-full transition-all hover:scale-105 hover:ring-2 hover:ring-white/30 focus:outline-none focus:ring-2 focus:ring-accent-primary {getCellBg(
											status
										)} {bracketClasses || 'rounded'}"
										title="{river.name} - {MONTHS[monthIndex]}: {getStatusLabel(status)}{caveat
											? ` (${getCaveatTypeLabel(caveat.type)})`
											: ''}{bracketPos ? ` [Permit Season]` : ''}"
									>
										{#if caveat}
											<span
												class="absolute right-0.5 top-0.5 h-2 w-2 rounded-full {getCaveatDotColor(
													caveat.severity
												)}"
											></span>
										{/if}
									</button>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Detail Popup -->
{#if selectedCell}
	{@const { river, month } = selectedCell}
	{@const status = river.seasons ? getMonthStatus(river.seasons, month) : 'poor'}
	{@const caveat = river.seasons?.caveats[month]}

	<!-- Backdrop -->
	<button
		onclick={closePopup}
		class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
		aria-label="Close popup"
	></button>

	<!-- Popup -->
	<div
		class="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border-default bg-bg-surface p-6 shadow-2xl"
	>
		<!-- Header -->
		<div class="mb-4 flex items-start justify-between">
			<div>
				<h3 class="text-xl font-semibold text-text-primary">{river.name}</h3>
				<div class="mt-1 flex items-center gap-2 text-sm text-text-secondary">
					<MapPin class="h-4 w-4" />
					<span>{river.state}</span>
				</div>
			</div>
			<button
				onclick={closePopup}
				class="rounded-lg p-1 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
				aria-label="Close"
			>
				<X class="h-5 w-5" />
			</button>
		</div>

		<!-- Month & Status -->
		<div class="mb-4 flex items-center gap-3">
			<div class="flex items-center gap-2">
				<Calendar class="h-4 w-4 text-text-muted" />
				<span class="font-medium text-text-primary">{MONTHS[month - 1]}</span>
			</div>
			<span class="rounded-full px-3 py-1 text-sm font-medium {getCellBg(status)} text-white">
				{getStatusLabel(status)}
			</span>
		</div>

		<!-- River Info -->
		<div class="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-bg-elevated/50 p-3 text-sm">
			<div>
				<span class="text-text-muted">Class:</span>
				<span class="ml-2 font-medium text-accent-primary">{river.class}</span>
			</div>
			<div>
				<span class="text-text-muted">Days:</span>
				<span class="ml-2 font-medium text-text-primary">{river.daysMin}-{river.daysMax}</span>
			</div>
			{#if river.ratings?.permitDifficulty || river.permit?.required === false}
				<div class="col-span-2">
					<span class="text-text-muted">Permit:</span>
					<span class="ml-2">
						<PermitBadge
							difficulty={river.ratings?.permitDifficulty ?? 1}
							permitRequired={river.permit?.required !== false}
							isSelfIssue={isSelfIssue(river)}
							compact
						/>
					</span>
				</div>
			{/if}
			{#if river.flows?.season}
				<div class="col-span-2">
					<span class="text-text-muted">Season:</span>
					<span class="ml-2 font-medium text-text-primary">{river.flows.season}</span>
				</div>
			{/if}
		</div>

		<!-- Season Notes -->
		{#if river.seasons?.notes}
			<div class="mb-4 text-sm text-text-secondary">
				<p>{river.seasons.notes}</p>
			</div>
		{/if}

		<!-- Caveat Warning -->
		{#if caveat}
			<div
				class="mb-4 rounded-lg p-3 {caveat.severity === 'severe'
					? 'bg-red-500/20 border border-red-500/30'
					: caveat.severity === 'moderate'
						? 'bg-amber-500/20 border border-amber-500/30'
						: 'bg-slate-500/20 border border-slate-500/30'}"
			>
				<div class="mb-1 flex items-center gap-2 text-sm font-medium">
					{#if caveat.severity === 'severe'}
						<AlertTriangle class="h-4 w-4 text-red-400" />
						<span class="text-red-400">{getSeverityHeading(caveat.severity)}</span>
					{:else if caveat.severity === 'moderate'}
						<Info class="h-4 w-4 text-amber-400" />
						<span class="text-amber-400">{getSeverityHeading(caveat.severity)}</span>
					{:else}
						<Lightbulb class="h-4 w-4 text-slate-400" />
						<span class="text-slate-400">{getSeverityHeading(caveat.severity)}</span>
					{/if}
					<span class="text-xs text-text-muted">({getCaveatTypeLabel(caveat.type)})</span>
				</div>
				<p class="text-sm text-text-secondary">{caveat.description}</p>
			</div>
		{/if}

		<!-- Link to river page -->
		<a
			href="/rivers/{river.slug}"
			class="block w-full rounded-lg bg-accent-primary px-4 py-2 text-center font-medium text-white transition-colors hover:bg-accent-hover"
		>
			View River Details
		</a>
	</div>
{/if}

