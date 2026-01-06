<script lang="ts">
	import { Waves, Github } from 'lucide-svelte';
</script>

<footer class="border-t border-border-subtle bg-bg-surface/60">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
			<!-- Logo & tagline -->
			<div class="flex items-center gap-2 text-text-muted">
				<Waves class="h-5 w-5" />
				<span class="text-sm">River Guide — Multi-day rafting rivers of the Western US</span>
			</div>

			<!-- Links -->
			<div class="flex items-center gap-6">
				<a
					href="https://github.com/joshdavislight/river-guide/"
					target="_blank"
					rel="noopener noreferrer"
					class="text-text-muted transition-colors hover:text-text-primary"
					aria-label="GitHub"
				>
					<Github class="h-5 w-5" />
				</a>
				<span class="text-xs text-text-muted">
					Flow data from <a
						href="https://waterservices.usgs.gov/"
						target="_blank"
						rel="noopener noreferrer"
						class="underline decoration-border-default underline-offset-2 hover:text-text-secondary"
						>USGS</a
					>
				</span>
			</div>
		</div>
	</div>
</footer>

