<script lang="ts">
	import { FileText, PenLine } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Trip Reports — River Guide</title>
	<meta property="og:title" content="Trip Reports — River Guide" />
	<meta property="og:description" content="Community trip reports and beta from fellow boaters." />
	<meta property="og:url" content="https://rivers.saltyfox.xyz/trip-reports" />
	<meta name="twitter:title" content="Trip Reports — River Guide" />
	<meta name="twitter:description" content="Community trip reports and beta from fellow boaters." />
	<link rel="canonical" href="https://rivers.saltyfox.xyz/trip-reports" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold text-text-primary">Trip Reports</h1>
		<p class="text-text-secondary">Community trip reports and beta from fellow boaters</p>
	</div>

	<!-- Coming soon placeholder -->
	<div class="glass-card flex h-96 flex-col items-center justify-center rounded-xl">
		<div class="flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/10">
			<FileText class="h-8 w-8 text-accent-primary" />
		</div>
		<h2 class="mt-6 text-xl font-semibold text-text-primary">Coming Soon</h2>
		<p class="mt-2 max-w-md text-center text-text-secondary">
			Share your river experiences with the community. Trip reports and beta submissions will be
			available in a future update.
		</p>
		<button
			type="button"
			disabled
			class="mt-6 flex items-center gap-2 rounded-lg bg-bg-elevated px-6 py-3 font-medium text-text-muted"
		>
			<PenLine class="h-5 w-5" />
			Submit a Report
		</button>
	</div>
</div>

