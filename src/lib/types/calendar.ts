/**
 * Shared types for calendar components
 */

import type { SeasonData } from '$lib/utils/parseRiverSeasons';

/**
 * River data structure used in calendar views
 * Subset of full RiverData with fields needed for calendar display
 */
export interface CalendarRiver {
	name: string;
	slug: string;
	state: string;
	class: string;
	classMax?: number;
	daysMin: number;
	daysMax: number;
	ratings?: {
		permitDifficulty?: number;
		amazingness?: number;
	};
	permit?: {
		required?: boolean;
		system?: string;
		controlSeason?: {
			start?: string; // "MM-DD" format
			end?: string;
		};
	};
	flows?: {
		season?: string;
	};
	seasons?: SeasonData;
}

/** Filter type for permit difficulty dropdown */
export type PermitFilterValue = 'all' | '1' | '2' | '3' | '4' | '5';

/** Filter type for class dropdown */
export type ClassFilterValue = 'all' | 'II' | 'III' | 'IV' | 'V';

/** Sort options for calendar */
export type SortByValue = 'name' | 'state';

