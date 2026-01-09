/**
 * Generic formatting utilities
 * Used across various components for text/number display
 */

/**
 * Format a flow value with commas for readability
 * Example: 12500 -> "12,500"
 */
export function formatFlow(value: number): string {
	return value.toLocaleString();
}

/**
 * Convert text to a URL-friendly slug
 * Example: "The Grand Canyon" -> "the-grand-canyon"
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

/**
 * Shorten section labels for navigation display
 * Removes common prefixes and suffixes for brevity
 */
export function shortenLabel(text: string): string {
	return text
		.replace(/^(The|Special|Major|Best)\s+/i, '')
		.replace(/\s*&\s*Warnings$/i, '')
		.replace(/\s+Services$/i, '');
}

