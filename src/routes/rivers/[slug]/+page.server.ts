import type { PageServerLoad } from './$types';
import { getAllRivers, getRiverBySlug } from '$lib/utils/rivers';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
	const river = await getRiverBySlug(params.slug);

	if (!river) {
		throw error(404, 'River not found');
	}

	return {
		river: river.data,
		content: river.content
	};
};

export function entries() {
	const rivers = getAllRivers();
	return rivers.map((river) => ({ slug: river.slug }));
}

