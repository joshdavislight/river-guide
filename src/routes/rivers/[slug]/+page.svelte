<script lang="ts">
	import { MapPin, Calendar, Gauge, AlertTriangle, Tent, Truck, ArrowLeft, Ruler, Waves, Clock, Ticket, Droplets } from 'lucide-svelte';
	import type { PageData } from './$types';
	import FlowIndicator from '$lib/components/FlowIndicator.svelte';
	import PermitBadge from '$lib/components/PermitBadge.svelte';
	import StarRating from '$lib/components/StarRating.svelte';
	import { formatMonthDay } from '$lib/utils/dates';

	let { data }: { data: PageData } = $props();

	function formatFlow(value: number): string {
		return value.toLocaleString();
	}
</script>

<svelte:head>
	<title>{data.river?.name ?? 'River'} — River Guide</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Back link -->
	<a
		href="/"
		class="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
	>
		<ArrowLeft class="h-4 w-4" />
		Back to all rivers
	</a>

	{#if data.river}
		<!-- Header -->
		<header class="mb-8">
			<h1 class="mb-3 text-4xl font-bold text-text-primary">{data.river.name}</h1>
			<div class="mb-6">
				<PermitBadge difficulty={data.river.ratings?.permitDifficulty ?? 1} />
			</div>

			<!-- At a Glance Grid -->
			<div class="glass-card rounded-xl p-5">
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<!-- Location -->
					<div class="flex items-start gap-3">
						<div class="rounded-lg bg-bg-elevated p-2">
							<MapPin class="h-4 w-4 text-accent-primary" />
						</div>
						<div>
							<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Location</p>
							<p class="font-semibold text-text-primary">{data.river.state}</p>
						</div>
					</div>

					<!-- Length -->
					<div class="flex items-start gap-3">
						<div class="rounded-lg bg-bg-elevated p-2">
							<Ruler class="h-4 w-4 text-accent-primary" />
						</div>
						<div>
							<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Length</p>
							<p class="font-semibold text-text-primary">{data.river.miles} miles</p>
						</div>
					</div>

					<!-- Class -->
					<div class="flex items-start gap-3">
						<div class="rounded-lg bg-bg-elevated p-2">
							<Waves class="h-4 w-4 text-accent-primary" />
						</div>
						<div>
							<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Class</p>
							<p class="font-semibold text-text-primary">{data.river.class}</p>
						</div>
					</div>

					<!-- Trip Length -->
					<div class="flex items-start gap-3">
						<div class="rounded-lg bg-bg-elevated p-2">
							<Clock class="h-4 w-4 text-accent-primary" />
						</div>
						<div>
							<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Trip Length</p>
							<p class="font-semibold text-text-primary">{data.river.daysMin}–{data.river.daysMax} days</p>
						</div>
					</div>

					<!-- Permit Style -->
					<div class="flex items-start gap-3">
						<div class="rounded-lg bg-bg-elevated p-2">
							<Ticket class="h-4 w-4 text-accent-primary" />
						</div>
						<div>
							<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Permit</p>
							<p class="font-semibold text-text-primary">
								{#if data.river.permit?.required === false}
									No permit required
								{:else if data.river.permit?.system}
									{data.river.permit.system}
								{:else}
									—
								{/if}
							</p>
						</div>
					</div>

					<!-- Lottery Season -->
					<div class="flex items-start gap-3">
						<div class="rounded-lg bg-bg-elevated p-2">
							<Calendar class="h-4 w-4 text-accent-primary" />
						</div>
						<div>
							<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Lottery Season</p>
							<p class="font-semibold text-text-primary">
								{#if data.river.permit?.lotteryWindow?.open && data.river.permit?.lotteryWindow?.close}
									{formatMonthDay(data.river.permit.lotteryWindow.open)} – {formatMonthDay(data.river.permit.lotteryWindow.close)}
								{:else if data.river.permit?.required === false}
									N/A
								{:else}
									No lottery
								{/if}
							</p>
						</div>
					</div>

					<!-- Peak Season -->
					<div class="flex items-start gap-3">
						<div class="rounded-lg bg-bg-elevated p-2">
							<Gauge class="h-4 w-4 text-accent-primary" />
						</div>
						<div>
							<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Peak Season</p>
							<p class="font-semibold text-text-primary">{data.river.flows?.season ?? '—'}</p>
						</div>
					</div>

					<!-- Optimal Flow -->
					<div class="flex items-start gap-3">
						<div class="rounded-lg bg-bg-elevated p-2">
							<Droplets class="h-4 w-4 text-accent-primary" />
						</div>
						<div>
							<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Optimal Flow</p>
							<p class="font-semibold text-text-primary">
								{#if data.river.flows?.optimal}
									{formatFlow(data.river.flows.optimal.low)}–{formatFlow(data.river.flows.optimal.high)} cfs
								{:else}
									—
								{/if}
							</p>
						</div>
					</div>
				</div>
			</div>
		</header>

		<!-- Ratings -->
		{#if data.river.ratings}
			<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<div class="glass-card rounded-xl p-4">
					<p class="mb-1 text-sm text-text-muted">Amazingness</p>
					<StarRating rating={data.river.ratings.amazingness} />
				</div>
				<div class="glass-card rounded-xl p-4">
					<p class="mb-1 text-sm text-text-muted">Technical Difficulty</p>
					<StarRating rating={data.river.ratings.technicalDifficulty} />
				</div>
				<div class="glass-card rounded-xl p-4">
					<p class="mb-1 text-sm text-text-muted">Family Friendly</p>
					<StarRating rating={data.river.ratings.familyFriendly} />
				</div>
			</div>
		{/if}

		<!-- Content -->
		<article class="prose prose-invert max-w-none">
			{@html data.content}
		</article>

		<!-- Rapids -->
		{#if data.river.rapids?.length}
			<section class="mt-12">
				<h2 class="mb-4 text-2xl font-bold text-text-primary">Major Rapids</h2>
				<div class="space-y-3">
					{#each data.river.rapids as rapid}
						<div class="glass-card rounded-xl p-4">
							<div class="flex items-start justify-between gap-4">
								<div>
									<p class="font-semibold text-text-primary">{rapid.name}</p>
									<p class="text-sm text-text-secondary">{rapid.description}</p>
								</div>
								<div class="text-right">
									<p class="font-mono text-sm text-accent-primary">Mile {rapid.mile}</p>
									<p class="text-sm text-text-muted">Class {rapid.class}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Camps -->
		{#if data.river.camps?.length}
			<section class="mt-12">
				<h2 class="mb-4 flex items-center gap-2 text-2xl font-bold text-text-primary">
					<Tent class="h-6 w-6" />
					Best Camps
				</h2>
				<div class="grid gap-4 sm:grid-cols-2">
					{#each data.river.camps as camp}
						<div class="glass-card rounded-xl p-4">
							<p class="font-semibold text-text-primary">{camp.name}</p>
							<p class="font-mono text-sm text-text-muted">Mile {camp.mile}</p>
							{#if camp.features?.length}
								<div class="mt-2 flex flex-wrap gap-2">
									{#each camp.features as feature}
										<span
											class="rounded-full bg-bg-elevated px-2 py-1 text-xs text-text-secondary"
										>
											{feature}
										</span>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Dangers -->
		{#if data.river.dangers?.length}
			<section class="mt-12">
				<h2 class="mb-4 flex items-center gap-2 text-2xl font-bold text-text-primary">
					<AlertTriangle class="h-6 w-6 text-flow-flood" />
					Dangers & Warnings
				</h2>
				<div class="space-y-3">
					{#each data.river.dangers as danger}
						<div class="glass-card border-l-4 border-flow-flood rounded-xl p-4">
							<p class="font-semibold capitalize text-text-primary">{danger.type}</p>
							<p class="text-text-secondary">{danger.description}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Shuttle Services -->
		{#if data.river.shuttles?.length}
			<section class="mt-12">
				<h2 class="mb-4 flex items-center gap-2 text-2xl font-bold text-text-primary">
					<Truck class="h-6 w-6" />
					Shuttle Services
				</h2>
				<div class="grid gap-4 sm:grid-cols-2">
					{#each data.river.shuttles as shuttle}
						<div class="glass-card rounded-xl p-4">
							<p class="font-semibold text-text-primary">{shuttle.name}</p>
							<p class="text-sm text-text-secondary">{shuttle.location}</p>
							{#if shuttle.phone}
								<p class="mt-1 font-mono text-sm text-accent-primary">{shuttle.phone}</p>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}
	{:else}
		<div class="flex h-64 items-center justify-center">
			<p class="text-text-muted">River not found</p>
		</div>
	{/if}
</div>

