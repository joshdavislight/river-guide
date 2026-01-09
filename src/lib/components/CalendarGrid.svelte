<!--
  CalendarGrid.svelte
  Calendar table with month headers and river rows
-->
<script lang="ts">
	import type { CalendarRiver } from '$lib/types/calendar';
	import { getMonthStatus } from '$lib/utils/parseRiverSeasons';
	import {
		getCellBackground,
		getStatusLabel,
		getCaveatDotColor,
		getCaveatTypeLabel
	} from '$lib/utils/calendarHelpers';

	const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	interface Props {
		rivers: CalendarRiver[];
		monthFilter: number | null;
		onMonthClick: (month: number) => void;
		onCellClick: (river: CalendarRiver, month: number) => void;
	}

	let { rivers, monthFilter, onMonthClick, onCellClick }: Props = $props();

	// Extract month from "MM-DD" format
	function getMonthFromDate(dateStr: string | undefined): number | null {
		if (!dateStr) return null;
		const match = dateStr.match(/^(\d{1,2})-/);
		return match ? parseInt(match[1], 10) : null;
	}

	// Get permit season info for a river
	function getPermitSeasonInfo(river: CalendarRiver): {
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
	function isInControlSeason(
		month: number,
		startMonth: number | null,
		endMonth: number | null
	): boolean {
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

<div class="glass-card overflow-hidden rounded-xl">
	<div class="max-h-[70vh] overflow-auto">
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
								onclick={() => onMonthClick(i + 1)}
								class="rounded px-2 py-1 text-xs font-medium transition-colors {monthFilter ===
								i + 1
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
				{#each rivers as river (river.slug)}
					<tr class="group hover:bg-bg-elevated/30">
						<td class="sticky left-0 z-10 bg-bg-surface px-4 py-2 group-hover:bg-bg-elevated/50">
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
							{@const status = river.seasons ? getMonthStatus(river.seasons, month) : 'poor'}
							{@const caveat = river.seasons?.caveats[month]}
							{@const permitInfo = getPermitSeasonInfo(river)}
							{@const bracketPos = getBracketPosition(
								month,
								permitInfo.startMonth,
								permitInfo.endMonth
							)}
							{@const bracketClasses = getBracketClasses(bracketPos, permitInfo.isLottery)}
							<td class="px-1 py-2">
								<button
									onclick={() => onCellClick(river, month)}
									class="relative h-8 w-full transition-all hover:scale-105 hover:ring-2 hover:ring-white/30 focus:outline-none focus:ring-2 focus:ring-accent-primary {getCellBackground(
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

