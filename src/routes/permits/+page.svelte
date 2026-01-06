<script lang="ts">
	import { CalendarDays, Clock, AlertTriangle } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Permit Calendar — River Guide</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold text-text-primary">Permit Calendar</h1>
		<p class="text-text-secondary">Lottery windows, deadlines, and permit availability</p>
	</div>

	<!-- Upcoming deadlines -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-text-primary">Upcoming Deadlines</h2>
		<div class="glass-card flex h-48 items-center justify-center rounded-xl">
			<div class="text-center">
				<Clock class="mx-auto mb-3 h-12 w-12 text-text-muted" />
				<p class="text-text-muted">Permit deadlines will appear here</p>
			</div>
		</div>
	</div>

	<!-- Calendar view placeholder -->
	<div class="glass-card overflow-hidden rounded-xl">
		<div class="border-b border-border-subtle bg-bg-elevated/50 px-6 py-4">
			<h2 class="font-semibold text-text-primary">Lottery Calendar</h2>
		</div>
		<div class="flex h-64 items-center justify-center">
			<div class="text-center">
				<CalendarDays class="mx-auto mb-3 h-12 w-12 text-text-muted" />
				<p class="text-text-muted">Calendar view coming soon</p>
			</div>
		</div>
	</div>
</div>

