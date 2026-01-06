/**
 * Parse a MM-DD date string and get the date for the current or next occurrence
 */
export function getNextOccurrence(monthDay: string): Date {
	const [month, day] = monthDay.split('-').map(Number);
	const now = new Date();
	const currentYear = now.getFullYear();

	let date = new Date(currentYear, month - 1, day);

	// If the date has passed this year, get next year's occurrence
	if (date < now) {
		date = new Date(currentYear + 1, month - 1, day);
	}

	return date;
}

/**
 * Calculate days until a date
 */
export function daysUntil(date: Date): number {
	const now = new Date();
	const diff = date.getTime() - now.getTime();
	return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if a lottery window is currently open
 */
export function isLotteryOpen(open: string, close: string): boolean {
	const now = new Date();
	const currentYear = now.getFullYear();

	const [openMonth, openDay] = open.split('-').map(Number);
	const [closeMonth, closeDay] = close.split('-').map(Number);

	let openDate = new Date(currentYear, openMonth - 1, openDay);
	let closeDate = new Date(currentYear, closeMonth - 1, closeDay);

	// Handle windows that span year boundaries (e.g., Dec 1 - Jan 31)
	if (closeMonth < openMonth) {
		if (now.getMonth() + 1 <= closeMonth) {
			// We're in the new year, adjust open date to previous year
			openDate = new Date(currentYear - 1, openMonth - 1, openDay);
		} else {
			// We're in the old year, adjust close date to next year
			closeDate = new Date(currentYear + 1, closeMonth - 1, closeDay);
		}
	}

	return now >= openDate && now <= closeDate;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

/**
 * Format a MM-DD string for display
 */
export function formatMonthDay(monthDay: string): string {
	const [month, day] = monthDay.split('-').map(Number);
	const date = new Date(2000, month - 1, day);
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric'
	});
}

/**
 * Get permit deadline status
 */
export type DeadlineStatus = 'open' | 'upcoming' | 'closed';

export interface DeadlineInfo {
	status: DeadlineStatus;
	daysUntilOpen?: number;
	daysUntilClose?: number;
	opensOn?: string;
	closesOn?: string;
}

export function getDeadlineInfo(
	lotteryWindow: { open: string; close: string } | undefined
): DeadlineInfo | null {
	if (!lotteryWindow) return null;

	const { open, close } = lotteryWindow;

	if (isLotteryOpen(open, close)) {
		const closeDate = getNextOccurrence(close);
		return {
			status: 'open',
			daysUntilClose: daysUntil(closeDate),
			closesOn: formatMonthDay(close)
		};
	}

	const openDate = getNextOccurrence(open);
	const days = daysUntil(openDate);

	if (days <= 60) {
		return {
			status: 'upcoming',
			daysUntilOpen: days,
			opensOn: formatMonthDay(open)
		};
	}

	return {
		status: 'closed',
		daysUntilOpen: days,
		opensOn: formatMonthDay(open)
	};
}

