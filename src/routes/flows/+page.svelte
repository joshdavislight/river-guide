<script lang="ts">
	import { Gauge, TrendingUp, TrendingDown, Minus } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Flow Dashboard — River Guide</title>
	<meta property="og:title" content="Flow Dashboard — River Guide" />
	<meta property="og:description" content="Real-time USGS flow data for multi-day rafting rivers." />
	<meta property="og:url" content="https://rivers.saltyfox.xyz/flows" />
	<meta name="twitter:title" content="Flow Dashboard — River Guide" />
	<meta name="twitter:description" content="Real-time USGS flow data for multi-day rafting rivers." />
	<link rel="canonical" href="https://rivers.saltyfox.xyz/flows" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold text-text-primary">Flow Dashboard</h1>
		<p class="text-text-secondary">Real-time USGS flow data for all rivers</p>
	</div>

	<!-- Flow status summary -->
	<div class="mb-8 grid gap-4 sm:grid-cols-4">
		{#each [
			{ label: 'Optimal', count: 0, color: 'bg-flow-optimal' },
			{ label: 'Low', count: 0, color: 'bg-flow-low' },
			{ label: 'High', count: 0, color: 'bg-flow-high' },
			{ label: 'Flood', count: 0, color: 'bg-flow-flood' }
		] as status}
			<div class="glass-card flex items-center gap-4 rounded-xl p-4">
				<div class="h-3 w-3 rounded-full {status.color}"></div>
				<div>
					<p class="text-2xl font-bold text-text-primary">{status.count}</p>
					<p class="text-sm text-text-muted">{status.label}</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- Flow table placeholder -->
	<div class="glass-card overflow-hidden rounded-xl">
		<div class="border-b border-border-subtle bg-bg-elevated/50 px-6 py-4">
			<h2 class="font-semibold text-text-primary">All Rivers</h2>
		</div>
		<div class="flex h-64 items-center justify-center">
			<div class="text-center">
				<Gauge class="mx-auto mb-3 h-12 w-12 text-text-muted" />
				<p class="text-text-muted">Flow data will appear here once rivers are added</p>
			</div>
		</div>
	</div>
</div>

