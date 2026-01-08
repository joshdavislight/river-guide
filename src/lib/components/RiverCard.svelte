<script lang="ts">
	import { MapPin, Clock, Ruler, Waves, Calendar, Gauge, Users, Zap } from 'lucide-svelte';
	import FlowIndicator from './FlowIndicator.svelte';
	import PermitBadge from './PermitBadge.svelte';
	import StarRating from './StarRating.svelte';
	import { isLotteryOpen, getNextOccurrence, daysUntil, formatMonthDay } from '$lib/utils/dates';

	interface River {
		name: string;
		slug: string;
		state: string;
		miles: number;
		class: string;
		daysMin: number;
		daysMax: number;
		featured?: boolean;
		ratings?: {
			permitDifficulty?: number;
			amazingness?: number;
			technicalDifficulty?: number;
			familyFriendly?: number;
		};
		images?: {
			hero?: string;
		};
		tags?: string[];
		flows?: {
			season?: string;
		};
		permit?: {
			required?: boolean;
			system?: string;
			lotteryWindow?: {
				open: string;
				close: string;
			};
		};
	}

	interface Props {
		river: River;
		flowStatus?: 'low' | 'optimal' | 'high' | 'flood' | 'unknown';
		cfs?: number | null;
	}

	let { river, flowStatus = 'unknown', cfs = null }: Props = $props();

	// Check if lottery is closing soon (within 30 days)
	const lotteryClosingSoon = $derived(() => {
		const lotteryWindow = river.permit?.lotteryWindow;
		if (!lotteryWindow?.open || !lotteryWindow?.close) return null;

		if (isLotteryOpen(lotteryWindow.open, lotteryWindow.close)) {
			const closeDate = getNextOccurrence(lotteryWindow.close);
			const days = daysUntil(closeDate);
			if (days <= 30 && days >= 0) {
				return days;
			}
		}
		return null;
	});

	// Check if permit is self-issue type
	const isSelfIssue = $derived(() => {
		const system = river.permit?.system?.toLowerCase() ?? '';
		return system.includes('self-issue') || 
			system.includes('self issue') || 
			system.includes('boater pass') ||
			system.includes('first-come') ||
			system.includes('fcfs');
	});

	// Format lottery window for display
	const lotteryWindowFormatted = $derived(() => {
		const lotteryWindow = river.permit?.lotteryWindow;
		if (!lotteryWindow?.open || !lotteryWindow?.close) return null;
		return `${formatMonthDay(lotteryWindow.open)} – ${formatMonthDay(lotteryWindow.close)}`;
	});

	// Get permit display text
	const permitDisplay = $derived(() => {
		if (river.permit?.required === false) return 'No permit required';
		if (isSelfIssue()) return 'Self-issue';
		if (river.permit?.system) {
			// Shorten common permit system names
			const system = river.permit.system;
			if (system.toLowerCase().includes('lottery')) return 'Lottery';
			if (system.toLowerCase().includes('rolling')) return 'Rolling';
			return system.length > 15 ? system.substring(0, 15) + '…' : system;
		}
		return null;
	});
</script>

<a
	href="/rivers/{river.slug}"
	class="glass-card card-glow group block overflow-hidden rounded-xl transition-all hover:border-accent-primary/50"
>
	<div class="p-4">
		<!-- Header: Name + Amazingness -->
		<div class="mb-3 flex items-start justify-between gap-2">
			<h3 class="text-lg font-semibold text-text-primary transition-colors group-hover:text-accent-primary">
				{river.name}
			</h3>
			{#if river.ratings?.amazingness}
				<div class="shrink-0">
					<StarRating rating={river.ratings.amazingness} />
				</div>
			{/if}
		</div>

		<!-- Location + Permit Badge + Lottery Alert -->
		<div class="mb-4 flex flex-wrap items-center gap-2">
			<span class="flex items-center gap-1 text-sm text-text-muted">
				<MapPin class="h-3.5 w-3.5" />
				{river.state}
			</span>
			{#if river.ratings?.permitDifficulty || river.permit?.required === false || isSelfIssue()}
				<PermitBadge 
					difficulty={river.ratings?.permitDifficulty ?? 1} 
					permitRequired={river.permit?.required !== false}
					isSelfIssue={isSelfIssue()}
					compact 
				/>
			{/if}
			{#if lotteryClosingSoon() !== null}
				<span class="flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-xs font-medium text-slate-900">
					<Clock class="h-3 w-3" />
					{#if lotteryClosingSoon() === 0}
						Closes today
					{:else if lotteryClosingSoon() === 1}
						1 day left
					{:else}
						{lotteryClosingSoon()}d left
					{/if}
				</span>
			{/if}
			{#if flowStatus !== 'unknown'}
				<FlowIndicator status={flowStatus} {cfs} compact />
			{/if}
		</div>

		<!-- Core Stats Grid -->
		<div class="mb-4 grid grid-cols-3 gap-3 rounded-lg bg-bg-elevated/50 p-3">
			<div class="text-center">
				<div class="flex items-center justify-center gap-1 text-text-muted">
					<Ruler class="h-3.5 w-3.5" />
				</div>
				<p class="mt-1 text-sm font-semibold text-text-primary">{river.miles} mi</p>
			</div>
			<div class="text-center">
				<div class="flex items-center justify-center gap-1 text-text-muted">
					<Waves class="h-3.5 w-3.5" />
				</div>
				<p class="mt-1 text-sm font-semibold text-accent-primary">{river.class}</p>
			</div>
			<div class="text-center">
				<div class="flex items-center justify-center gap-1 text-text-muted">
					<Calendar class="h-3.5 w-3.5" />
				</div>
				<p class="mt-1 text-sm font-semibold text-text-primary">{river.daysMin}–{river.daysMax}d</p>
			</div>
		</div>

		<!-- Details Section -->
		<div class="mb-4 space-y-2 text-sm">
			<!-- Season -->
			{#if river.flows?.season}
				<div class="flex items-center gap-2">
					<Gauge class="h-3.5 w-3.5 text-text-muted" />
					<span class="text-text-muted">Season:</span>
					<span class="font-medium text-text-primary">{river.flows.season}</span>
				</div>
			{/if}

			<!-- Permit System & Lottery Window -->
			{#if permitDisplay()}
				<div class="flex items-center gap-2">
					<Calendar class="h-3.5 w-3.5 text-text-muted" />
					<span class="text-text-muted">Permit:</span>
					<span class="font-medium text-text-primary">
						{permitDisplay()}
						{#if lotteryWindowFormatted()}
							<span class="text-text-muted">({lotteryWindowFormatted()})</span>
						{/if}
					</span>
				</div>
			{/if}
		</div>

		<!-- Ratings Row -->
		{#if river.ratings?.technicalDifficulty || river.ratings?.familyFriendly}
			<div class="mb-4 flex flex-wrap gap-4 text-xs">
				{#if river.ratings?.technicalDifficulty}
					<div class="flex items-center gap-1.5">
						<Zap class="h-3.5 w-3.5 text-text-muted" />
						<span class="text-text-muted">Technical:</span>
						<StarRating rating={river.ratings.technicalDifficulty} />
					</div>
				{/if}
				{#if river.ratings?.familyFriendly}
					<div class="flex items-center gap-1.5">
						<Users class="h-3.5 w-3.5 text-text-muted" />
						<span class="text-text-muted">Family:</span>
						<StarRating rating={river.ratings.familyFriendly} />
					</div>
				{/if}
			</div>
		{/if}

		<!-- Tags -->
		{#if river.tags && river.tags.length > 0}
			<div class="flex flex-wrap gap-1.5 border-t border-border-subtle pt-3">
				{#each river.tags as tag}
					<span class="rounded-full bg-bg-elevated px-2 py-0.5 text-xs text-text-muted">
						{tag}
					</span>
				{/each}
			</div>
		{/if}
	</div>
</a>
