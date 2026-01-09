<!--
  TableCell.svelte
  Renders different cell types for the river table
-->
<script lang="ts">
	import { MapPin } from 'lucide-svelte';
	import PermitBadge from './PermitBadge.svelte';

	interface TextCell {
		type: 'text';
		text: string;
		className?: string;
	}

	interface LocationCell {
		type: 'location';
		text: string;
	}

	interface PermitCell {
		type: 'permit';
		difficulty: number;
		permitRequired: boolean;
		isSelfIssue: boolean;
		hasData: boolean;
	}

	interface DeadlineCell {
		type: 'deadline';
		text: string | null;
		closingSoon: boolean;
	}

	type CellData = TextCell | LocationCell | PermitCell | DeadlineCell;

	interface Props {
		data: CellData;
	}

	let { data }: Props = $props();
</script>

{#if data.type === 'location'}
	<span class="flex items-center gap-1 text-sm text-text-secondary">
		<MapPin class="h-3.5 w-3.5" />
		{data.text}
	</span>
{:else if data.type === 'permit'}
	{#if data.hasData}
		<PermitBadge
			difficulty={data.difficulty}
			permitRequired={data.permitRequired}
			isSelfIssue={data.isSelfIssue}
			compact
		/>
	{:else}
		<span class="text-sm text-text-muted">—</span>
	{/if}
{:else if data.type === 'deadline'}
	{#if data.text}
		<span class="text-sm {data.closingSoon ? 'font-medium text-amber-400' : 'text-text-secondary'}">
			{data.text}
		</span>
	{:else}
		<span class="text-sm text-text-muted">—</span>
	{/if}
{:else if data.type === 'text'}
	<span class={data.className ?? 'text-text-primary'}>{data.text}</span>
{/if}

