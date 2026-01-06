/**
 * USGS Gauge mappings for rivers
 * Maps river slugs to their USGS gauge IDs
 */

export interface GaugeInfo {
	id: string;
	name: string;
	primary?: boolean;
}

export const RIVER_GAUGES: Record<string, GaugeInfo[]> = {
	'middle-fork-salmon': [
		{ id: '13309220', name: 'MF Salmon at Boundary Creek', primary: true },
		{ id: '13310199', name: 'MF Salmon at Middle Fork Lodge' }
	],
	'main-salmon': [
		{ id: '13317000', name: 'Salmon River at White Bird', primary: true }
	],
	'selway': [
		{ id: '13336500', name: 'Selway River near Lowell', primary: true }
	],
	'grand-canyon': [
		{ id: '09380000', name: 'Colorado River at Lees Ferry', primary: true }
	],
	'rogue-river': [
		{ id: '14359000', name: 'Rogue River at Agness', primary: true }
	],
	'yampa-river': [
		{ id: '09260050', name: 'Yampa River at Deerlodge Park', primary: true }
	],
	'desolation-canyon': [
		{ id: '09315000', name: 'Green River at Green River', primary: true }
	],
	'san-juan-river': [
		{ id: '09379500', name: 'San Juan River near Bluff', primary: true }
	],
	'hells-canyon': [
		{ id: '13290450', name: 'Snake River at Hells Canyon Dam', primary: true }
	],
	'gates-of-lodore': [
		{ id: '09234500', name: 'Green River near Greendale', primary: true }
	]
};

/**
 * Get all gauge IDs for a list of river slugs
 */
export function getAllGaugeIds(riverSlugs: string[]): string[] {
	const gaugeIds: string[] = [];

	for (const slug of riverSlugs) {
		const gauges = RIVER_GAUGES[slug];
		if (gauges) {
			for (const gauge of gauges) {
				if (!gaugeIds.includes(gauge.id)) {
					gaugeIds.push(gauge.id);
				}
			}
		}
	}

	return gaugeIds;
}

/**
 * Get primary gauge ID for a river
 */
export function getPrimaryGaugeId(riverSlug: string): string | null {
	const gauges = RIVER_GAUGES[riverSlug];
	if (!gauges || gauges.length === 0) return null;

	const primary = gauges.find((g) => g.primary);
	return primary?.id || gauges[0].id;
}

