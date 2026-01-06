<script lang="ts">
	import { Star } from 'lucide-svelte';

	interface Props {
		rating: number; // 1-5 scale
		max?: number;
	}

	let { rating = 0, max = 5 }: Props = $props();
</script>

<div class="flex items-center gap-0.5">
	{#each Array(max) as _, i}
		<Star
			class="h-4 w-4 {i < rating ? 'fill-amber-400 text-amber-400' : 'text-text-muted'}"
		/>
	{/each}
</div>

