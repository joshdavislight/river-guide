/**
 * Calendar display helpers
 * Extracted from RiverCalendar.svelte for reusability
 */

// Type aliases for calendar status values
export type SeasonStatus = 'optimal' | 'good' | 'avoid' | 'poor';
export type CaveatSeverity = 'severe' | 'moderate' | 'minor';
export type CaveatType = 'crowds' | 'heat' | 'bugs' | 'flow-window';

/**
 * Get Tailwind background classes for a season status cell
 */
export function getCellBackground(status: SeasonStatus): string {
	switch (status) {
		case 'optimal':
			return 'bg-emerald-500/90';
		case 'good':
			return 'bg-blue-500/70';
		case 'avoid':
			return 'bg-red-500/70';
		case 'poor':
			return 'bg-slate-700/30';
	}
}

/**
 * Get user-facing label for a season status
 */
export function getStatusLabel(status: SeasonStatus): string {
	switch (status) {
		case 'optimal':
			return 'Optimal';
		case 'good':
			return 'Good';
		case 'avoid':
			return 'Avoid';
		case 'poor':
			return 'Off-season';
	}
}

/**
 * Get Tailwind color class for caveat indicator dot
 */
export function getCaveatDotColor(severity: CaveatSeverity): string {
	switch (severity) {
		case 'severe':
			return 'bg-yellow-400';
		case 'moderate':
			return 'bg-orange-400';
		case 'minor':
			return 'bg-slate-300';
	}
}

/**
 * Get user-facing label for caveat type
 */
export function getCaveatTypeLabel(type: CaveatType): string {
	switch (type) {
		case 'crowds':
			return 'Crowds';
		case 'heat':
			return 'Heat';
		case 'bugs':
			return 'Bugs';
		case 'flow-window':
			return 'Flow';
	}
}

