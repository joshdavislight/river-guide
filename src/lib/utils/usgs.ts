const USGS_BASE = 'https://waterservices.usgs.gov/nwis/iv/';

export interface FlowData {
	cfs: number | null;
	timestamp: string | null;
	siteName: string | null;
}

export interface FlowRanges {
	minimum: number;
	optimal: {
		low: number;
		high: number;
	};
	maximum: number;
}

export type FlowStatus = 'low' | 'optimal' | 'high' | 'flood' | 'unknown';

/**
 * Fetch current flow for a gauge
 */
export async function getCurrentFlow(gaugeId: string): Promise<FlowData> {
	const params = new URLSearchParams({
		sites: gaugeId,
		format: 'json',
		parameterCd: '00060', // Discharge in cfs
		siteStatus: 'active'
	});

	try {
		const response = await fetch(`${USGS_BASE}?${params}`);
		const data = await response.json();

		const timeSeries = data.value?.timeSeries?.[0];
		const latestValue = timeSeries?.values?.[0]?.value?.[0];

		return {
			cfs: latestValue?.value ? parseFloat(latestValue.value) : null,
			timestamp: latestValue?.dateTime || null,
			siteName: timeSeries?.sourceInfo?.siteName || null
		};
	} catch (error) {
		console.error(`Failed to fetch flow for gauge ${gaugeId}:`, error);
		return {
			cfs: null,
			timestamp: null,
			siteName: null
		};
	}
}

/**
 * Fetch flows for multiple gauges
 */
export async function getMultipleFlows(gaugeIds: string[]): Promise<Map<string, FlowData>> {
	const params = new URLSearchParams({
		sites: gaugeIds.join(','),
		format: 'json',
		parameterCd: '00060',
		siteStatus: 'active'
	});

	const flows = new Map<string, FlowData>();

	try {
		const response = await fetch(`${USGS_BASE}?${params}`);
		const data = await response.json();

		for (const series of data.value?.timeSeries || []) {
			const siteCode = series.sourceInfo?.siteCode?.[0]?.value;
			const latestValue = series.values?.[0]?.value?.[0];

			if (siteCode) {
				flows.set(siteCode, {
					cfs: latestValue?.value ? parseFloat(latestValue.value) : null,
					timestamp: latestValue?.dateTime || null,
					siteName: series.sourceInfo?.siteName || null
				});
			}
		}
	} catch (error) {
		console.error('Failed to fetch multiple flows:', error);
	}

	return flows;
}

/**
 * Determine flow status based on river's optimal range
 */
export function getFlowStatus(cfs: number | null, flowRanges: FlowRanges | undefined): FlowStatus {
	if (cfs === null || !flowRanges) return 'unknown';

	if (cfs < flowRanges.minimum) return 'low';
	if (cfs < flowRanges.optimal.low) return 'low';
	if (cfs <= flowRanges.optimal.high) return 'optimal';
	if (cfs <= flowRanges.maximum) return 'high';
	return 'flood';
}

