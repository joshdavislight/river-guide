import type { PageServerLoad } from './$types';
import { getAllRivers } from '$lib/utils/rivers';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const rivers = getAllRivers();

	return {
		rivers: rivers.map((river) => ({
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
			tags: river.data.tags
		}))
	};
};

