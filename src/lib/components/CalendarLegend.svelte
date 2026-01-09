<!--
  CalendarLegend.svelte
  Static legend showing color meanings for calendar cells
-->
<div class="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
	<!-- Season status colors -->
	<div class="flex items-center gap-2">
		<span class="h-3 w-3 rounded bg-emerald-500/90"></span>
		<span>Optimal</span>
	</div>
	<div class="flex items-center gap-2">
		<span class="h-3 w-3 rounded bg-blue-500/70"></span>
		<span>Good</span>
	</div>
	<div class="flex items-center gap-2">
		<span class="h-3 w-3 rounded bg-red-500/70"></span>
		<span>Avoid</span>
	</div>
	<div class="flex items-center gap-2">
		<span class="h-3 w-3 rounded bg-slate-700/30"></span>
		<span>Off-season</span>
	</div>

	<span class="text-text-muted">|</span>

	<!-- Caveat severity indicators -->
	<div class="flex items-center gap-2">
		<span class="h-2 w-2 rounded-full bg-yellow-400"></span>
		<span>⚠️ Be aware</span>
	</div>
	<div class="flex items-center gap-2">
		<span class="h-2 w-2 rounded-full bg-orange-400"></span>
		<span>ℹ️ Note</span>
	</div>
	<div class="flex items-center gap-2">
		<span class="h-2 w-2 rounded-full bg-slate-300"></span>
		<span>💡 Tip</span>
	</div>

	<span class="text-text-muted">|</span>

	<!-- Permit bracket indicators -->
	<div class="flex items-center gap-2">
		<span class="h-3 w-6 rounded border-2 border-amber-500 bg-slate-700/30"></span>
		<span>Lottery Season</span>
	</div>
	<div class="flex items-center gap-2">
		<span class="h-3 w-6 rounded border-2 border-slate-400 bg-slate-700/30"></span>
		<span>Permit Season</span>
	</div>
</div>

