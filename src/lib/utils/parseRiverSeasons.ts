/**
 * Parse season data from river markdown content
 * Extracts optimal/good/avoid months and caveats from "When to Go" sections
 */

export interface Caveat {
	type: 'crowds' | 'heat' | 'bugs' | 'flow-window';
	description: string;
	severity: 'severe' | 'moderate' | 'minor';
}

export interface SeasonData {
	optimal: number[]; // Month numbers (1=Jan, 12=Dec)
	good: number[];
	avoid: number[];
	caveats: Record<number, Caveat>;
	notes: string;
}

// Month name to number mapping
const MONTH_MAP: Record<string, number> = {
	jan: 1,
	january: 1,
	feb: 2,
	february: 2,
	mar: 3,
	march: 3,
	apr: 4,
	april: 4,
	may: 5,
	jun: 6,
	june: 6,
	jul: 7,
	july: 7,
	aug: 8,
	august: 8,
	sep: 9,
	sept: 9,
	september: 9,
	oct: 10,
	october: 10,
	nov: 11,
	november: 11,
	dec: 12,
	december: 12
};

// Keywords that indicate "optimal" conditions
const OPTIMAL_KEYWORDS = [
	'best',
	'prime',
	'optimal',
	'perfect',
	'ideal',
	'peak',
	'sweet spot',
	'excellent'
];

// Keywords that indicate "good" conditions (but not optimal)
const GOOD_KEYWORDS = ['good', 'decent', 'runnable', 'moderate', 'nice', 'manageable'];

// Keywords for severe caveats
const SEVERE_KEYWORDS = [
	'extreme',
	'dangerous',
	'biblical',
	'>105',
	'>110',
	'exceeds 105',
	'exceeds 110',
	'apocalypse',
	'fatal',
	'deadly',
	'lethal'
];

// Keywords for moderate caveats
const MODERATE_KEYWORDS = [
	'crowds',
	'crowded',
	'crowding',
	'busy',
	'weekend',
	'memorial day',
	'july 4',
	'labor day',
	'100-105',
	'can be',
	'may be',
	'often',
	'sometimes',
	'heavy traffic',
	'multiple groups'
];

// Caveat type detection keywords
const CAVEAT_TYPE_KEYWORDS: Record<Caveat['type'], string[]> = {
	crowds: ['crowd', 'busy', 'traffic', 'groups', 'people', 'solitude', 'competition'],
	heat: ['heat', 'hot', 'temperature', '°f', 'degrees', 'warm'],
	bugs: ['bug', 'mosquito', 'gnat', 'insect', 'cricket', 'fly', 'flies'],
	'flow-window': ['flow', 'cfs', 'water', 'drops', 'low water', 'high water', 'technical']
};

// Season to month range mapping
const SEASON_MAP: Record<string, number[]> = {
	spring: [3, 4, 5], // Mar-May
	summer: [6, 7, 8], // Jun-Aug
	fall: [9, 10, 11], // Sep-Nov
	autumn: [9, 10, 11],
	winter: [12, 1, 2] // Dec-Feb
};

/**
 * Parse month names/ranges from text like "June" or "July-August" or "May-June"
 * Also handles season words like "Spring", "Summer", "Fall", "Winter"
 * Prioritizes specific month mentions over season words
 */
function parseMonths(text: string): number[] {
	const months: number[] = [];
	const lowerText = text.toLowerCase();

	// First, try to find month range pattern (e.g., "July-August", "Jun-Sep")
	// This takes priority over season words
	const rangeMatch = lowerText.match(
		/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s*[-–—to]+\s*(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/i
	);

	if (rangeMatch) {
		const startMonth = MONTH_MAP[rangeMatch[1].toLowerCase()];
		const endMonth = MONTH_MAP[rangeMatch[2].toLowerCase()];

		if (startMonth && endMonth) {
			// Handle wrapping (e.g., Nov-Feb)
			if (startMonth <= endMonth) {
				for (let m = startMonth; m <= endMonth; m++) {
					months.push(m);
				}
			} else {
				// Wraps around year
				for (let m = startMonth; m <= 12; m++) {
					months.push(m);
				}
				for (let m = 1; m <= endMonth; m++) {
					months.push(m);
				}
			}
			return months;
		}
	}

	// Try to find individual months (prioritize over season words)
	for (const [name, num] of Object.entries(MONTH_MAP)) {
		const regex = new RegExp(`\\b${name}\\b`, 'i');
		if (regex.test(lowerText) && !months.includes(num)) {
			months.push(num);
		}
	}

	// If we found specific months, return those
	if (months.length > 0) {
		return months.sort((a, b) => a - b);
	}

	// Fall back to season words only if no specific months found
	for (const [season, seasonMonths] of Object.entries(SEASON_MAP)) {
		if (lowerText.includes(season)) {
			months.push(...seasonMonths.filter((m) => !months.includes(m)));
		}
	}

	return months.sort((a, b) => a - b);
}

/**
 * Determine if text indicates optimal conditions
 */
function isOptimal(text: string): boolean {
	const lowerText = text.toLowerCase();
	return OPTIMAL_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

/**
 * Determine if text indicates good (but not optimal) conditions
 */
function isGood(text: string): boolean {
	const lowerText = text.toLowerCase();
	// Must have good keywords but not optimal keywords
	return (
		GOOD_KEYWORDS.some((keyword) => lowerText.includes(keyword)) &&
		!OPTIMAL_KEYWORDS.some((keyword) => lowerText.includes(keyword))
	);
}

/**
 * Determine caveat severity from text
 */
function detectSeverity(text: string): Caveat['severity'] {
	const lowerText = text.toLowerCase();

	if (SEVERE_KEYWORDS.some((keyword) => lowerText.includes(keyword))) {
		return 'severe';
	}

	if (MODERATE_KEYWORDS.some((keyword) => lowerText.includes(keyword))) {
		return 'moderate';
	}

	return 'minor';
}

/**
 * Determine caveat type from text
 */
function detectCaveatType(text: string): Caveat['type'] {
	const lowerText = text.toLowerCase();

	for (const [type, keywords] of Object.entries(CAVEAT_TYPE_KEYWORDS)) {
		if (keywords.some((keyword) => lowerText.includes(keyword))) {
			return type as Caveat['type'];
		}
	}

	// Default to crowds if we can't determine
	return 'crowds';
}

/**
 * Extract the "When to Go" section from markdown
 */
function extractWhenToGoSection(markdown: string): string {
	// Match "## When to Go" (with optional suffix like "(No Permit Required)")
	// and capture until "### When NOT to Go" or next "## " section
	const match = markdown.match(
		/##\s*When\s+to\s+Go[^\n]*\n([\s\S]*?)(?=###?\s*When\s+NOT\s+to\s+Go|\n##\s+[^W]|$)/i
	);
	return match ? match[1].trim() : '';
}

/**
 * Extract the "When NOT to Go" section from markdown
 */
function extractWhenNotToGoSection(markdown: string): string {
	// Match "### When NOT to Go" and capture until the next ## section
	const match = markdown.match(/###?\s*When\s+NOT\s+to\s+Go\s*\n([\s\S]*?)(?=\n##[^#]|$)/i);
	return match ? match[1].trim() : '';
}

/**
 * Parse bold headers from markdown sections
 * Returns array of { header: string, content: string }
 */
function parseBoldHeaders(section: string): Array<{ header: string; content: string }> {
	const results: Array<{ header: string; content: string }> = [];
	// Match **Header:** followed by content until next bold header or end
	const regex = /\*\*([^*]+)\*\*:?\s*([^*]*?)(?=\*\*|$)/gs;
	let match;

	while ((match = regex.exec(section)) !== null) {
		results.push({
			header: match[1].trim(),
			content: match[2].trim()
		});
	}

	return results;
}

/**
 * Parse H3 headers from markdown sections (### Month format)
 * Returns array of { header: string, content: string }
 */
function parseH3Headers(section: string): Array<{ header: string; content: string }> {
	const results: Array<{ header: string; content: string }> = [];
	// Match ### Header followed by content until next ### or end
	const regex = /###\s+([^\n]+)\n([\s\S]*?)(?=\n###\s|$)/g;
	let match;

	while ((match = regex.exec(section)) !== null) {
		const header = match[1].trim();
		const content = match[2].trim();
		// Skip "When NOT to Go" header
		if (!header.toLowerCase().includes('when not')) {
			results.push({ header, content });
		}
	}

	return results;
}

/**
 * Parse all season headers from a section (both bold and H3 formats)
 */
function parseSeasonHeaders(section: string): Array<{ header: string; content: string }> {
	// Try bold headers first
	const boldHeaders = parseBoldHeaders(section);
	if (boldHeaders.length > 0) {
		return boldHeaders;
	}

	// Fall back to H3 headers
	return parseH3Headers(section);
}

/**
 * Main function to parse season data from markdown content
 */
export function parseRiverSeasons(markdown: string): SeasonData {
	const result: SeasonData = {
		optimal: [],
		good: [],
		avoid: [],
		caveats: {},
		notes: ''
	};

	// Extract sections
	const whenToGoSection = extractWhenToGoSection(markdown);
	const whenNotToGoSection = extractWhenNotToGoSection(markdown);

	// Build notes from the when to go section
	if (whenToGoSection) {
		// Take first paragraph or first 200 chars as notes
		// Remove markdown formatting (bold, headers)
		const firstPara = whenToGoSection.split('\n\n')[0];
		result.notes = firstPara
			.replace(/\*\*/g, '')
			.replace(/^###?\s+/gm, '')
			.substring(0, 200);
	}

	// Parse "When to Go" section for optimal/good months
	const whenToGoHeaders = parseSeasonHeaders(whenToGoSection);

	for (const { header, content } of whenToGoHeaders) {
		const months = parseMonths(header);
		const fullText = `${header} ${content}`;

		if (months.length > 0) {
			if (isOptimal(fullText)) {
				result.optimal.push(...months.filter((m) => !result.optimal.includes(m)));
			} else if (isGood(fullText)) {
				result.good.push(...months.filter((m) => !result.good.includes(m)));
			} else {
				// Default to good if we found months but couldn't classify
				result.good.push(...months.filter((m) => !result.good.includes(m)));
			}
		}
	}

	// Parse "When NOT to Go" section for avoid periods and caveats
	const whenNotToGoHeaders = parseSeasonHeaders(whenNotToGoSection);

	for (const { header, content } of whenNotToGoHeaders) {
		const months = parseMonths(header);
		const fullText = `${header} ${content}`;

		if (months.length > 0) {
			const severity = detectSeverity(fullText);
			const type = detectCaveatType(fullText);

			// If severe, mark as avoid; otherwise add as caveat
			if (severity === 'severe') {
				result.avoid.push(...months.filter((m) => !result.avoid.includes(m)));
				// Remove from optimal/good if it was there
				result.optimal = result.optimal.filter((m) => !months.includes(m));
				result.good = result.good.filter((m) => !months.includes(m));
			}

			// Add caveat for each month
			for (const month of months) {
				// Don't overwrite a more severe caveat
				if (!result.caveats[month] || severity === 'severe') {
					result.caveats[month] = {
						type,
						description: content.replace(/\n/g, ' ').trim(),
						severity
					};
				}
			}
		}
	}

	// Sort arrays
	result.optimal.sort((a, b) => a - b);
	result.good.sort((a, b) => a - b);
	result.avoid.sort((a, b) => a - b);

	return result;
}

/**
 * Get the status of a specific month for a river
 */
export function getMonthStatus(
	seasons: SeasonData,
	month: number
): 'optimal' | 'good' | 'avoid' | 'poor' {
	if (seasons.avoid.includes(month)) return 'avoid';
	if (seasons.optimal.includes(month)) return 'optimal';
	if (seasons.good.includes(month)) return 'good';
	return 'poor';
}

/**
 * Get softer label for caveat severity (for UI display)
 */
export function getSeverityLabel(severity: Caveat['severity']): string {
	switch (severity) {
		case 'severe':
			return '⚠️ Be aware';
		case 'moderate':
			return 'ℹ️ Note';
		case 'minor':
			return '💡 Tip';
	}
}

/**
 * Get heading text for severity (for popup warnings)
 */
export function getSeverityHeading(severity: Caveat['severity']): string {
	switch (severity) {
		case 'severe':
			return 'Heads up:';
		case 'moderate':
			return 'Good to know:';
		case 'minor':
			return 'Pro tip:';
	}
}

