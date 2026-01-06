<script lang="ts">
	import { Droplets } from 'lucide-svelte';

	type FlowStatus = 'low' | 'optimal' | 'high' | 'flood' | 'unknown';

	interface Props {
		status: FlowStatus;
		cfs?: number | null;
		compact?: boolean;
	}

	let { status = 'unknown', cfs = null, compact = false }: Props = $props();

	const statusConfig: Record<FlowStatus, { label: string; class: string; bgClass: string }> = {
		low: {
			label: 'Low',
			class: 'text-flow-low',
			bgClass: 'bg-flow-low/20'
		},
		optimal: {
			label: 'Optimal',
			class: 'text-flow-optimal',
			bgClass: 'bg-flow-optimal/20'
		},
		high: {
			label: 'High',
			class: 'text-flow-high',
			bgClass: 'bg-flow-high/20'
		},
		flood: {
			label: 'Flood',
			class: 'text-flow-flood',
			bgClass: 'bg-flow-flood/20'
		},
		unknown: {
			label: 'Unknown',
			class: 'text-text-muted',
			bgClass: 'bg-bg-elevated'
		}
	};

	const config = $derived(statusConfig[status]);
</script>

<div
	class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium {config.bgClass} {config.class}"
	class:flow-optimal={status === 'optimal'}
>
	<Droplets class="h-3.5 w-3.5" />
	{#if !compact}
		<span>{config.label}</span>
	{/if}
	{#if cfs !== null}
		<span class="font-mono text-xs opacity-80">{cfs.toLocaleString()} cfs</span>
	{/if}
</div>

