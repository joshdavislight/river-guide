<script lang="ts">
	// Topographic background pattern with layered contour lines
</script>

<svg class="pointer-events-none fixed inset-0 h-full w-full opacity-12" aria-hidden="true">
	<defs>
		<pattern id="topo" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
			<!-- Primary contours (0.8px, #60a5fa) -->
			<path d="M0 40 Q 50 20, 100 40 T 200 40" stroke="#60a5fa" fill="none" stroke-width="0.8" />
			<path
				d="M0 80 Q 40 55, 80 75 Q 120 95, 160 70 Q 200 45, 200 80"
				stroke="#60a5fa"
				fill="none"
				stroke-width="0.8"
			/>
			<path
				d="M0 120 Q 60 100, 100 120 T 200 120"
				stroke="#60a5fa"
				fill="none"
				stroke-width="0.8"
			/>
			<path
				d="M0 160 Q 30 140, 70 155 Q 110 170, 150 150 Q 190 130, 200 160"
				stroke="#60a5fa"
				fill="none"
				stroke-width="0.8"
			/>

			<!-- Secondary contours (0.5px, #3b82f6) -->
			<path
				d="M0 20 Q 45 5, 90 20 Q 135 35, 180 15 L 200 20"
				stroke="#3b82f6"
				fill="none"
				stroke-width="0.5"
			/>
			<path
				d="M0 60 Q 50 45, 100 60 Q 150 75, 200 55"
				stroke="#3b82f6"
				fill="none"
				stroke-width="0.5"
			/>
			<path
				d="M0 100 Q 40 85, 80 100 Q 120 115, 160 95 Q 200 75, 200 100"
				stroke="#3b82f6"
				fill="none"
				stroke-width="0.5"
			/>
			<path
				d="M0 140 Q 55 125, 110 140 Q 165 155, 200 135"
				stroke="#3b82f6"
				fill="none"
				stroke-width="0.5"
			/>
			<path
				d="M0 180 Q 45 165, 90 180 Q 135 195, 200 175"
				stroke="#3b82f6"
				fill="none"
				stroke-width="0.5"
			/>

			<!-- Tertiary detail lines (0.3px, #2563eb) -->
			<path
				d="M0 10 Q 25 0, 50 10 Q 75 20, 100 8 Q 125 -4, 150 10 Q 175 24, 200 10"
				stroke="#2563eb"
				fill="none"
				stroke-width="0.3"
			/>
			<path
				d="M0 50 Q 35 38, 70 50 Q 105 62, 140 48 Q 175 34, 200 50"
				stroke="#2563eb"
				fill="none"
				stroke-width="0.3"
			/>
			<path
				d="M0 90 Q 30 78, 60 90 Q 90 102, 120 88 Q 150 74, 180 90 L 200 88"
				stroke="#2563eb"
				fill="none"
				stroke-width="0.3"
			/>
			<path
				d="M0 130 Q 40 118, 80 130 Q 120 142, 160 128 Q 200 114, 200 130"
				stroke="#2563eb"
				fill="none"
				stroke-width="0.3"
			/>
			<path
				d="M0 170 Q 35 158, 70 170 Q 105 182, 140 168 Q 175 154, 200 170"
				stroke="#2563eb"
				fill="none"
				stroke-width="0.3"
			/>

			<!-- Index contours (1.2px, #93c5fd) -->
			<path d="M0 0 Q 50 -15, 100 0 T 200 0" stroke="#93c5fd" fill="none" stroke-width="1.2" />
			<path
				d="M0 200 Q 50 185, 100 200 T 200 200"
				stroke="#93c5fd"
				fill="none"
				stroke-width="1.2"
			/>
		</pattern>
	</defs>
	<rect width="100%" height="100%" fill="url(#topo)" />
</svg>

