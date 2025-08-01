import { Analytics } from '../../types/tables';
import type { SimpleQueryConfig } from '../types';

export const TrafficBuilders: Record<string, SimpleQueryConfig> = {
	top_referrers: {
		table: Analytics.events,
		fields: [
			'CASE ' +
				"WHEN domain(referrer) LIKE '%.google.com%' OR domain(referrer) LIKE 'google.com%' THEN 'https://google.com' " +
				"WHEN domain(referrer) LIKE '%.facebook.com%' OR domain(referrer) LIKE 'facebook.com%' THEN 'https://facebook.com' " +
				"WHEN domain(referrer) LIKE '%.twitter.com%' OR domain(referrer) LIKE 'twitter.com%' OR domain(referrer) LIKE 't.co%' THEN 'https://twitter.com' " +
				"WHEN domain(referrer) LIKE '%.instagram.com%' OR domain(referrer) LIKE 'instagram.com%' OR domain(referrer) LIKE 'l.instagram.com%' THEN 'https://instagram.com' " +
				"ELSE concat('https://', domain(referrer)) " +
				'END as name',
			'COUNT(*) as pageviews',
			'COUNT(DISTINCT anonymous_id) as visitors',
			'ROUND((COUNT(*) / SUM(COUNT(*)) OVER()) * 100, 2) as percentage',
		],
		where: [
			"referrer != ''",
			'referrer IS NOT NULL',
			"event_name = 'screen_view'",
			"domain(referrer) != '{websiteDomain}'",
			"NOT domain(referrer) ILIKE '%.{websiteDomain}'",
			"domain(referrer) NOT IN ('localhost', '127.0.0.1')",
		],
		groupBy: ['name'],
		orderBy: 'pageviews DESC',
		limit: 100,
		timeField: 'time',
		allowedFilters: ['path', 'device_type', 'browser_name'],
		customizable: true,
		plugins: { parseReferrers: true },
	},

	utm_sources: {
		table: Analytics.events,
		fields: [
			'utm_source as name',
			'COUNT(*) as pageviews',
			'COUNT(DISTINCT anonymous_id) as visitors',
			'ROUND((COUNT(*) / SUM(COUNT(*)) OVER()) * 100, 2) as percentage',
		],
		where: ["utm_source != ''", "event_name = 'screen_view'"],
		groupBy: ['utm_source'],
		orderBy: 'pageviews DESC',
		limit: 100,
		timeField: 'time',
		allowedFilters: ['path', 'device_type'],
		customizable: true,
	},

	utm_mediums: {
		table: Analytics.events,
		fields: [
			'utm_medium as name',
			'COUNT(*) as pageviews',
			'COUNT(DISTINCT anonymous_id) as visitors',
			'ROUND((COUNT(*) / SUM(COUNT(*)) OVER()) * 100, 2) as percentage',
		],
		where: ["utm_medium != ''", "event_name = 'screen_view'"],
		groupBy: ['utm_medium'],
		orderBy: 'pageviews DESC',
		limit: 100,
		timeField: 'time',
		allowedFilters: ['path', 'device_type'],
		customizable: true,
	},

	utm_campaigns: {
		table: Analytics.events,
		fields: [
			'utm_campaign as name',
			'COUNT(*) as pageviews',
			'COUNT(DISTINCT anonymous_id) as visitors',
			'ROUND((COUNT(*) / SUM(COUNT(*)) OVER()) * 100, 2) as percentage',
		],
		where: ["utm_campaign != ''", "event_name = 'screen_view'"],
		groupBy: ['utm_campaign'],
		orderBy: 'pageviews DESC',
		limit: 100,
		timeField: 'time',
		allowedFilters: ['path', 'device_type'],
		customizable: true,
	},

	traffic_sources: {
		table: Analytics.events,
		fields: [
			'CASE ' +
				"WHEN referrer = '' OR referrer IS NULL THEN 'direct' " +
				"WHEN domain(referrer) LIKE '%.google.com%' OR domain(referrer) LIKE 'google.com%' THEN 'https://google.com' " +
				"WHEN domain(referrer) LIKE '%.facebook.com%' OR domain(referrer) LIKE 'facebook.com%' THEN 'https://facebook.com' " +
				"WHEN domain(referrer) LIKE '%.twitter.com%' OR domain(referrer) LIKE 'twitter.com%' OR domain(referrer) LIKE 't.co%' THEN 'https://twitter.com' " +
				"WHEN domain(referrer) LIKE '%.instagram.com%' OR domain(referrer) LIKE 'instagram.com%' OR domain(referrer) LIKE 'l.instagram.com%' THEN 'https://instagram.com' " +
				"ELSE concat('https://', domain(referrer)) " +
				'END as source',
			'COUNT(*) as pageviews',
			'COUNT(DISTINCT anonymous_id) as visitors',
		],
		where: ["event_name = 'screen_view'"],
		groupBy: ['source'],
		orderBy: 'pageviews DESC',
		limit: 100,
		timeField: 'time',
		allowedFilters: ['path', 'device_type'],
		customizable: true,
		plugins: { parseReferrers: true },
	},
};
