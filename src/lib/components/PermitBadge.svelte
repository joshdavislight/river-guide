<script lang="ts">
	import { Ticket } from 'lucide-svelte';

	interface Props {
		difficulty: number; // 1-5 scale
		compact?: boolean;
		permitRequired?: boolean; // Override to show green if false
		isSelfIssue?: boolean; // Override to show green if true
	}

	let { difficulty = 1, compact = false, permitRequired = true, isSelfIssue = false }: Props = $props();

	type DifficultyLevel = 'easy' | 'moderate' | 'hard' | 'extreme' | 'none';

	function getDifficultyLevel(d: number): DifficultyLevel {
		// Override to green for no permit required or self-issue
		if (!permitRequired || isSelfIssue) return 'easy';
		
		if (d <= 1) return 'none';
		if (d <= 2) return 'easy';
		if (d <= 3) return 'moderate';
		if (d <= 4) return 'hard';
		return 'extreme';
	}

	const levelConfig: Record<
		DifficultyLevel,
		{ label: string; tooltip: string; class: string; bgClass: string }
	> = {
		none: {
			label: 'No Permit',
			tooltip: 'No permit required for this river',
			class: 'text-permit-easy',
			bgClass: 'bg-permit-easy/20'
		},
		easy: {
			label: 'Easy Permit',
			tooltip: 'Easy to obtain — usually available on demand or self-issued',
			class: 'text-permit-easy',
			bgClass: 'bg-permit-easy/20'
		},
		moderate: {
			label: 'Moderate',
			tooltip: 'Moderate difficulty — may require advance reservation',
			class: 'text-permit-moderate',
			bgClass: 'bg-permit-moderate/20'
		},
		hard: {
			label: 'Hard Permit',
			tooltip: 'Difficult to obtain — competitive lottery or limited availability',
			class: 'text-permit-hard',
			bgClass: 'bg-permit-hard/20'
		},
		extreme: {
			label: 'Lottery',
			tooltip: 'Extremely competitive lottery — very low odds of success',
			class: 'text-permit-extreme',
			bgClass: 'bg-permit-extreme/20'
		}
	};

	// Determine label based on permit status
	function getLabel(level: DifficultyLevel): string {
		if (!permitRequired) return 'No Permit';
		if (isSelfIssue) return 'Self Issue';
		return levelConfig[level].label;
	}

	function getTooltip(level: DifficultyLevel): string {
		if (!permitRequired) return 'No permit required for this river';
		if (isSelfIssue) return 'Self-issue permit — available on demand';
		return levelConfig[level].tooltip;
	}

	const level = $derived(getDifficultyLevel(difficulty));
	const config = $derived(levelConfig[level]);
	const label = $derived(getLabel(level));
	const tooltip = $derived(getTooltip(level));
</script>

<div
	class="inline-flex cursor-help items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium {config.bgClass} {config.class}"
	title={tooltip}
	role="tooltip"
>
	<Ticket class="h-3.5 w-3.5" />
	{#if !compact}
		<span>{label}</span>
	{/if}
</div>
