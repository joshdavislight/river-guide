<script lang="ts">
	import './layout.css';
	import TopoPattern from '$lib/components/TopoPattern.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<div class="relative min-h-screen">
	<TopoPattern />

	<div class="relative z-10 flex min-h-screen flex-col">
		<Header />

		<main class="flex-1">
			{@render children()}
		</main>

		<Footer />
	</div>
</div>
