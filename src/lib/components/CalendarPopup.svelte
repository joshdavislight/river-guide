<!--
  CalendarPopup.svelte
  Modal popup showing river details for a selected month
-->
<script lang="ts">
	import { X, MapPin, Calendar, AlertTriangle, Info, Lightbulb } from 'lucide-svelte';
	import PermitBadge from './PermitBadge.svelte';
	import type { CalendarRiver } from '$lib/types/calendar';
	import { getMonthStatus, getSeverityHeading } from '$lib/utils/parseRiverSeasons';
	import { getCellBackground, getStatusLabel, getCaveatTypeLabel } from '$lib/utils/calendarHelpers';
	import { isSelfIssuePermit } from '$lib/utils/riverHelpers';

	const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	interface Props {
		river: CalendarRiver | null;
		month: number | null;
		onClose: () => void;
	}

	let { river, month, onClose }: Props = $props();

	// Handle escape key to close popup
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if river && month}
	{@const status = river.seasons ? getMonthStatus(river.seasons, month) : 'poor'}
	{@const caveat = river.seasons?.caveats[month]}

	<!-- Backdrop -->
	<button
		onclick={onClose}
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
				onclick={onClose}
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
			<span class="rounded-full px-3 py-1 text-sm font-medium {getCellBackground(status)} text-white">
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
							isSelfIssue={isSelfIssuePermit(river)}
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

