/**
 * River permit business logic helpers
 * Extracted from components to avoid duplication
 */

import { getDeadlineInfo } from './dates';

/**
 * Minimal type for river objects with permit info
 * Works with both RiverData and component-level river types
 */
export interface RiverWithPermit {
	permit?: {
		required?: boolean;
		system?: string;
		lotteryWindow?: { open: string; close: string };
	};
}

/**
 * Check if a river has a self-issue/first-come-first-served permit
 * Self-issue permits don't require lottery entry
 */
export function isSelfIssuePermit(river: RiverWithPermit): boolean {
	const system = river.permit?.system?.toLowerCase() ?? '';
	return (
		system.includes('self-issue') ||
		system.includes('self issue') ||
		system.includes('boater pass') ||
		system.includes('first-come') ||
		system.includes('fcfs')
	);
}

/**
 * Extract rolling permit text from system string
 * Used internally by getPermitDeadline
 */
function extractRollingPermitText(system: string | undefined): string | null {
	if (!system) return null;

	const lowerSystem = system.toLowerCase();

	// Check for self-issue permits
	if (lowerSystem.includes('self-issue') || lowerSystem.includes('self issue')) {
		return 'Self issue';
	}

	// Extract number of days from patterns like "(60 days advance)" or "(60 days)"
	const match = system.match(/\((\d+)\s*days/i);
	return match ? `Rolling - ${match[1]} days` : null;
}

/**
 * Get permit deadline text for display
 * Returns human-readable deadline info based on permit type and lottery window
 */
export function getPermitDeadline(river: RiverWithPermit): string | null {
	// No permit required
	if (river.permit?.required === false) return 'No permit required';

	// No permit info at all
	if (!river.permit) return null;

	// Check if lottery window has valid dates
	const lotteryWindow = river.permit.lotteryWindow;
	if (!lotteryWindow?.open || !lotteryWindow?.close) {
		// No lottery - check for rolling availability or self-issue
		return extractRollingPermitText(river.permit.system);
	}

	const info = getDeadlineInfo(lotteryWindow);
	if (!info) return null;

	if (info.status === 'open') {
		return `Closes ${info.closesOn}`;
	} else if (info.status === 'upcoming' && info.daysUntilOpen && info.daysUntilOpen <= 60) {
		return `Opens ${info.opensOn}`;
	}
	return info.opensOn ? `Opens ${info.opensOn}` : null;
}

/**
 * Check if lottery is closing within 30 days
 * Used to highlight urgent deadlines in the UI
 */
export function isLotteryClosingSoon(river: RiverWithPermit): boolean {
	const lotteryWindow = river.permit?.lotteryWindow;
	if (!lotteryWindow?.open || !lotteryWindow?.close) return false;

	const info = getDeadlineInfo(lotteryWindow);
	if (!info) return false;

	// Check if lottery is open and closing within 30 days
	return info.status === 'open' && (info.daysUntilClose ?? 999) <= 30;
}

