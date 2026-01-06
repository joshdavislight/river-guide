<script lang="ts">
	import { Waves, Search, X } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let searchOpen = $state(false);
	let searchQuery = $state('');
	let searchInput: HTMLInputElement;

	// Sync search query with URL on homepage
	$effect(() => {
		if ($page.url.pathname === '/') {
			searchQuery = $page.url.searchParams.get('q') ?? '';
			if (searchQuery) searchOpen = true;
		}
	});

	function openSearch() {
		searchOpen = true;
		// Focus input after it renders
		setTimeout(() => searchInput?.focus(), 50);
	}

	function closeSearch() {
		searchOpen = false;
		searchQuery = '';
		// Clear search from URL if on homepage
		if ($page.url.pathname === '/') {
			goto('/', { replaceState: true, noScroll: true });
		}
	}

	function handleSearch() {
		if (searchQuery.trim()) {
			goto(`/?q=${encodeURIComponent(searchQuery.trim())}`, { noScroll: true });
		} else {
			goto('/', { replaceState: true, noScroll: true });
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeSearch();
		} else if (event.key === 'Enter') {
			handleSearch();
		}
	}
</script>

<header class="border-b border-border-subtle bg-bg-surface/80 backdrop-blur-md">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between gap-4">
			<!-- Logo -->
			<a href="/" class="flex shrink-0 items-center gap-2 text-xl font-semibold text-text-primary">
				<Waves class="h-6 w-6 text-accent-primary" />
				<span>River Guide</span>
			</a>

			<!-- Search bar (expanded) -->
			{#if searchOpen}
				<div class="flex flex-1 items-center justify-end gap-2 sm:max-w-md">
					<div class="relative flex-1">
						<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
						<input
							bind:this={searchInput}
							bind:value={searchQuery}
							onkeydown={handleKeydown}
							oninput={handleSearch}
							type="text"
							placeholder="Search rivers..."
							class="w-full rounded-lg border border-border-subtle bg-bg-surface py-2 pl-9 pr-3 text-sm text-text-primary backdrop-blur-sm transition-colors placeholder:text-text-muted focus:border-accent-primary/50 focus:outline-none focus:ring-1 focus:ring-accent-primary/20"
						/>
					</div>
					<button
						type="button"
						onclick={closeSearch}
						class="rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
						aria-label="Close search"
					>
						<X class="h-5 w-5" />
					</button>
				</div>
			{/if}

			<!-- Right side actions -->
			<div class="flex items-center gap-2">
				<!-- Search icon button (when collapsed) -->
				{#if !searchOpen}
					<button
						type="button"
						onclick={openSearch}
						class="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
						aria-label="Search"
					>
						<Search class="h-5 w-5" />
					</button>
				{/if}
			</div>
		</div>
	</div>
</header>
