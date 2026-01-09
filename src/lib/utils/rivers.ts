import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { SeasonData, Caveat } from './parseRiverSeasons';

export type { SeasonData, Caveat };

export interface RiverData {
	name: string;
	slug: string;
	state: string;
	region: string;
	miles: number;
	class: string;
	classMax: number;
	daysMin: number;
	daysMax: number;
	putIn?: {
		name: string;
		lat: number;
		lon: number;
	};
	takeOut?: {
		name: string;
		lat: number;
		lon: number;
	};
	permit?: {
		required: boolean;
		system?: string;
		agency?: string;
		url?: string;
		lotteryWindow?: {
			open: string;
			close: string;
		};
		resultsDate?: string;
		controlSeason?: {
			start: string;
			end: string;
		};
		permitsIssued?: number;
		applicationsAvg?: number;
		odds?: number;
		groupSizeMax?: number;
		fees?: {
			application?: number;
			permit?: number;
			perPersonPerDay?: boolean;
		};
	};
	gauges?: Array<{
		id: string;
		name: string;
		primary?: boolean;
	}>;
	flows?: {
		unit: string;
		minimum: number;
		optimal: {
			low: number;
			high: number;
		};
		maximum: number;
		season?: string;
	};
	ratings?: {
		permitDifficulty: number;
		amazingness: number;
		popularity: number;
		technicalDifficulty: number;
		familyFriendly: number;
	};
	tags?: string[];
	rapids?: Array<{
		mile: number;
		name: string;
		class: string;
		description: string;
	}>;
	camps?: Array<{
		name: string;
		mile: number;
		features?: string[];
		notes?: string;
	}>;
	shuttles?: Array<{
		name: string;
		location: string;
		phone?: string;
		url?: string;
	}>;
	dangers?: Array<{
		type: string;
		description: string;
	}>;
	images?: {
		hero?: string;
		gallery?: string[];
	};
	featured?: boolean;
	lastUpdated?: string;
	seasons?: SeasonData;
}

export interface River {
	data: RiverData;
	content: string;
	slug: string;
}

const RIVERS_DIR = path.join(process.cwd(), 'content', 'rivers');

/**
 * Get all rivers from markdown files
 */
export function getAllRivers(): River[] {
	if (!fs.existsSync(RIVERS_DIR)) {
		return [];
	}

	const files = fs.readdirSync(RIVERS_DIR).filter((file) => file.endsWith('.md'));

	return files
		.map((file) => {
			const filePath = path.join(RIVERS_DIR, file);
			const fileContent = fs.readFileSync(filePath, 'utf-8');
			const { data, content } = matter(fileContent);

			return {
				data: data as RiverData,
				content,
				slug: file.replace('.md', '')
			};
		})
		.sort((a, b) => a.data.name.localeCompare(b.data.name));
}

/**
 * Get a single river by slug
 */
export async function getRiverBySlug(slug: string): Promise<River | null> {
	const filePath = path.join(RIVERS_DIR, `${slug}.md`);

	if (!fs.existsSync(filePath)) {
		return null;
	}

	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const { data, content } = matter(fileContent);

	// Convert markdown to HTML using marked
	const htmlContent = await marked(content, {
		gfm: true, // GitHub Flavored Markdown
		breaks: true // Convert \n to <br>
	});

	return {
		data: data as RiverData,
		content: htmlContent,
		slug
	};
}

/**
 * Get featured rivers
 */
export function getFeaturedRivers(): River[] {
	return getAllRivers().filter((river) => river.data.featured);
}

/**
 * Get rivers by state
 */
export function getRiversByState(state: string): River[] {
	return getAllRivers().filter(
		(river) => river.data.state.toLowerCase() === state.toLowerCase()
	);
}

/**
 * Get primary gauge ID for a river
 */
export function getPrimaryGaugeId(river: RiverData): string | null {
	const primaryGauge = river.gauges?.find((g) => g.primary);
	return primaryGauge?.id || river.gauges?.[0]?.id || null;
}

