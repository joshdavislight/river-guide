import type { PageServerLoad } from './$types';
import { getAllRivers } from '$lib/utils/rivers';
import { parseRiverSeasons, type SeasonData } from '$lib/utils/parseRiverSeasons';

export const prerender = true;

/**
 * Merge frontmatter season overrides with parsed season data.
 * Frontmatter values take precedence for optimal/good/avoid arrays.
 * Caveats and notes always come from the parser (not overridable).
 */
function mergeSeasons(
	parsed: SeasonData,
	frontmatter?: { optimal?: number[]; good?: number[]; avoid?: number[] }
): SeasonData {
	if (!frontmatter) {
		return parsed;
	}

	return {
		optimal: frontmatter.optimal ?? parsed.optimal,
		good: frontmatter.good ?? parsed.good,
		avoid: frontmatter.avoid ?? parsed.avoid,
		caveats: parsed.caveats, // Always from parser
		notes: parsed.notes // Always from parser
	};
}

export const load: PageServerLoad = async () => {
	const rivers = getAllRivers();

	return {
		rivers: rivers.map((river) => {
			const parsedSeasons = parseRiverSeasons(river.content);
			const seasons = mergeSeasons(parsedSeasons, river.data.seasons);

			return {
				name: river.data.name,
				slug: river.slug,
				state: river.data.state,
				region: river.data.region,
				miles: river.data.miles,
				class: river.data.class,
				classMax: river.data.classMax,
				daysMin: river.data.daysMin,
				daysMax: river.data.daysMax,
				ratings: river.data.ratings,
				images: river.data.images,
				featured: river.data.featured,
				permit: river.data.permit,
				flows: river.data.flows,
				tags: river.data.tags,
				seasons
			};
		})
	};
};
