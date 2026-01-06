<script lang="ts">
	import { MapPin, Clock } from 'lucide-svelte';
	import FlowIndicator from './FlowIndicator.svelte';
	import PermitBadge from './PermitBadge.svelte';
	import StarRating from './StarRating.svelte';
	import { isLotteryOpen, getNextOccurrence, daysUntil } from '$lib/utils/dates';

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
		};
		images?: {
			hero?: string;
		};
		tags?: string[];
		permit?: {
			required?: boolean;
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

		// Check if lottery is currently open
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

	// Generate a consistent color based on river name for placeholder
	function getPlaceholderGradient(name: string): string {
		const colors = [
			'from-sky-900/40 via-slate-800 to-slate-900',
			'from-emerald-900/40 via-slate-800 to-slate-900',
			'from-blue-900/40 via-slate-800 to-slate-900',
			'from-cyan-900/40 via-slate-800 to-slate-900',
			'from-teal-900/40 via-slate-800 to-slate-900'
		];
		const index = name.charCodeAt(0) % colors.length;
		return colors[index];
	}
</script>

<a
	href="/rivers/{river.slug}"
	class="glass-card card-glow group block overflow-hidden rounded-xl transition-all hover:border-accent-primary/50"
>
	<!-- Hero image -->
	<div class="relative h-44 overflow-hidden bg-gradient-to-br {getPlaceholderGradient(river.name)}">
		{#if river.images?.hero}
			<img
				src={river.images.hero}
				alt={river.name}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		{:else}
			<!-- Stylized river/mountain placeholder -->
			<div class="absolute inset-0 overflow-hidden">
				<svg class="absolute inset-0 h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
					<!-- Mountains silhouette -->
					<path
						d="M0 200 L80 80 L120 120 L180 40 L240 100 L300 60 L360 90 L400 70 L400 200 Z"
						fill="rgba(30, 41, 59, 0.8)"
					/>
					<path
						d="M0 200 L60 120 L100 150 L160 90 L220 130 L280 100 L340 130 L400 110 L400 200 Z"
						fill="rgba(51, 65, 85, 0.6)"
					/>
					<!-- River -->
					<path
						d="M0 180 Q 100 160, 200 175 T 400 165"
						stroke="rgba(14, 165, 233, 0.3)"
						stroke-width="8"
						fill="none"
						stroke-linecap="round"
					/>
					<path
						d="M0 190 Q 100 175, 200 185 T 400 180"
						stroke="rgba(56, 189, 248, 0.2)"
						stroke-width="4"
						fill="none"
						stroke-linecap="round"
					/>
				</svg>
			</div>
		{/if}

		<!-- Flow indicator overlay (left) -->
		<div class="absolute left-3 top-3">
			<FlowIndicator status={flowStatus} {cfs} compact />
		</div>

		<!-- Lottery closing soon badge (right) -->
		{#if lotteryClosingSoon() !== null}
			<div class="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-1 text-xs font-medium text-slate-900">
				<Clock class="h-3 w-3" />
				{#if lotteryClosingSoon() === 0}
					Closes today
				{:else if lotteryClosingSoon() === 1}
					1 day left
				{:else}
					{lotteryClosingSoon()}d left
				{/if}
			</div>
		{/if}

		<!-- Gradient overlay for text readability -->
		<div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
	</div>

	<!-- Content -->
	<div class="p-4">
		<div class="mb-2 flex items-start justify-between gap-2">
			<h3 class="font-semibold text-text-primary transition-colors group-hover:text-accent-primary">
				{river.name}
			</h3>
			{#if river.ratings?.permitDifficulty || river.permit?.required === false || isSelfIssue()}
				<PermitBadge 
					difficulty={river.ratings?.permitDifficulty ?? 1} 
					permitRequired={river.permit?.required !== false}
					isSelfIssue={isSelfIssue()}
					compact 
				/>
			{/if}
		</div>

		<div class="mb-3 flex items-center gap-1 text-sm text-text-muted">
			<MapPin class="h-3.5 w-3.5" />
			<span>{river.state}</span>
		</div>

		<div class="flex items-center justify-between text-sm">
			<div class="flex items-center gap-3 text-text-secondary">
				<span>{river.miles} mi</span>
				<span class="font-medium text-accent-primary">Class {river.class}</span>
				<span>{river.daysMin}-{river.daysMax}d</span>
			</div>

			{#if river.ratings?.amazingness}
				<StarRating rating={river.ratings.amazingness} />
			{/if}
		</div>

		<!-- Tags -->
		{#if river.tags && river.tags.length > 0}
			<div class="mt-3 flex flex-wrap gap-1.5">
				{#each river.tags.slice(0, 3) as tag}
					<span class="rounded-full bg-bg-elevated px-2 py-0.5 text-xs text-text-muted">
						{tag}
					</span>
				{/each}
				{#if river.tags.length > 3}
					<span class="rounded-full bg-bg-elevated px-2 py-0.5 text-xs text-text-muted">
						+{river.tags.length - 3}
					</span>
				{/if}
			</div>
		{/if}
	</div>
</a>
