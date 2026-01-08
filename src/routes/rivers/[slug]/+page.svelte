<script lang="ts">
	import { onMount } from 'svelte';
	import { MapPin, Calendar, Gauge, AlertTriangle, Tent, Truck, ArrowLeft, Ruler, Waves, Clock, Ticket, Droplets } from 'lucide-svelte';
	import type { PageData } from './$types';
	import FlowIndicator from '$lib/components/FlowIndicator.svelte';
	import PermitBadge from '$lib/components/PermitBadge.svelte';
	import StarRating from '$lib/components/StarRating.svelte';
	import { formatMonthDay } from '$lib/utils/dates';

	let { data }: { data: PageData } = $props();

	let sections: { id: string; label: string }[] = $state([]);

	function slugify(text: string): string {
		return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
	}

	function shortenLabel(text: string): string {
		// Remove common prefixes and keep it concise
		const shortened = text
			.replace(/^(The|Special|Major|Best)\s+/i, '')
			.replace(/\s*&\s*Warnings$/i, '')
			.replace(/\s+Services$/i, '');
		return shortened;
	}

	function formatFlow(value: number): string {
		return value.toLocaleString();
	}

	function scrollToSection(e: MouseEvent, id: string) {
		e.preventDefault();
		const el = document.getElementById(id);
		if (el) {
			const y = el.getBoundingClientRect().top + window.scrollY - 200;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	}

	onMount(() => {
		const headers = document.querySelectorAll('.river-content h2');
		sections = Array.from(headers).map((h2) => {
			if (!h2.id) h2.id = slugify(h2.textContent || '');
			return { id: h2.id, label: shortenLabel(h2.textContent || '') };
		});
	});
</script>

<svelte:head>
	<title>{data.river?.name ?? 'River'} — River Guide</title>
	{#if data.river}
		<meta property="og:title" content="{data.river.name} — River Guide" />
		<meta property="og:description" content="{data.river.miles} miles, Class {data.river.class} in {data.river.state}. {data.river.daysMin}-{data.river.daysMax} day trip." />
		<meta property="og:url" content="https://rivers.saltyfox.xyz/rivers/{data.river.slug}" />
		<meta name="twitter:title" content="{data.river.name} — River Guide" />
		<meta name="twitter:description" content="{data.river.miles} miles, Class {data.river.class} in {data.river.state}. {data.river.daysMin}-{data.river.daysMax} day trip." />
		<link rel="canonical" href="https://rivers.saltyfox.xyz/rivers/{data.river.slug}" />
		{#if data.river.images?.hero}
			<meta property="og:image" content="{data.river.images.hero}" />
			<meta name="twitter:image" content="{data.river.images.hero}" />
		{/if}
	{/if}
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

		<!-- Section Navigation -->
		{#if sections.length > 0}
			<nav class="sticky top-0 z-10 -mx-4 mb-8 overflow-x-auto bg-bg-base/90 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
				<div class="flex gap-2">
					{#each sections as section}
						<a
							href="#{section.id}"
							onclick={(e) => scrollToSection(e, section.id)}
							class="whitespace-nowrap rounded-full bg-bg-elevated px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary"
						>
							{section.label}
						</a>
					{/each}
				</div>
			</nav>
		{/if}

		<div class="river-content">
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
		</div>
	{:else}
		<div class="flex h-64 items-center justify-center">
			<p class="text-text-muted">River not found</p>
		</div>
	{/if}
</div>

