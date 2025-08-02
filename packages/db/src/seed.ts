import { randomUUID } from 'node:crypto';
import { auth } from '@databuddy/auth';
import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import { clickHouse, TABLE_NAMES } from './clickhouse/client';
import { initClickHouseSchema } from './clickhouse/schema';
import { db } from './client';
import {
	BLOG_CATEGORIES,
	COMPANY_SECTIONS,
	PRODUCT_CATEGORIES,
	DEVICE_TYPES,
	BROWSERS,
	OS_NAMES,
	CUSTOM_EVENTS,
	REFERRERS,
} from './constants';
import {
	account,
	member,
	organization,
	user,
	userPreferences,
	websites,
} from './drizzle/schema';

const generateSampleData = () => {
	const userId1 = randomUUID();
	const userId2 = randomUUID();
	const orgId1 = randomUUID();
	const orgId2 = randomUUID();
	const websiteId1 = randomUUID();
	const websiteId2 = randomUUID();
	const websiteId3 = randomUUID();

	const now = new Date().toISOString();
	const daysAgo = (days: number) =>
		new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

	return {
		users: [
			{
				id: userId1,
				name: 'John Doe',
				email: 'admin@databuddy.dev',
				emailVerified: true,
				firstName: 'John',
				lastName: 'Doe',
				status: 'ACTIVE' as const,
				role: 'ADMIN' as const,
				createdAt: daysAgo(30),
				updatedAt: now,
				twoFactorEnabled: false,
			},
			{
				id: userId2,
				name: 'Jane Smith',
				email: 'user@databuddy.dev',
				emailVerified: true,
				firstName: 'Jane',
				lastName: 'Smith',
				status: 'ACTIVE' as const,
				role: 'USER' as const,
				createdAt: daysAgo(15),
				updatedAt: now,
				twoFactorEnabled: false,
			},
		],

		organizations: [
			{
				id: orgId1,
				name: 'Acme Corporation',
				slug: 'acme-corp',
				logo: null,
				createdAt: daysAgo(25),
				metadata: JSON.stringify({
					industry: 'Technology',
					size: 'Medium',
				}),
			},
			{
				id: orgId2,
				name: 'StartupCo',
				slug: 'startupco',
				logo: null,
				createdAt: daysAgo(10),
				metadata: JSON.stringify({
					industry: 'SaaS',
					size: 'Small',
				}),
			},
		],

		members: [
			{
				id: randomUUID(),
				organizationId: orgId1,
				userId: userId1,
				role: 'owner',
				createdAt: daysAgo(25),
			},
			{
				id: randomUUID(),
				organizationId: orgId1,
				userId: userId2,
				role: 'member',
				createdAt: daysAgo(20),
			},
			{
				id: randomUUID(),
				organizationId: orgId2,
				userId: userId2,
				role: 'owner',
				createdAt: daysAgo(10),
			},
		],

		websites: [
			{
				id: websiteId1,
				domain: 'acme.com',
				name: 'Acme Website',
				status: 'ACTIVE' as const,
				userId: userId1,
				organizationId: orgId1,
				isPublic: true,
				createdAt: daysAgo(20),
				updatedAt: now,
			},
			{
				id: websiteId2,
				domain: 'blog.acme.com',
				name: 'Acme Blog',
				status: 'ACTIVE' as const,
				userId: null,
				organizationId: orgId1,
				isPublic: false,
				createdAt: daysAgo(15),
				updatedAt: now,
			},
			{
				id: websiteId3,
				domain: 'startupco.io',
				name: 'StartupCo Landing',
				status: 'ACTIVE' as const,
				userId: userId2,
				organizationId: orgId2,
				isPublic: true,
				createdAt: daysAgo(8),
				updatedAt: now,
			},
		],

		userPreferences: [
			{
				id: randomUUID(),
				userId: userId1,
				timezone: 'America/New_York',
				dateFormat: 'MMM D, YYYY',
				timeFormat: 'h:mm a',
				createdAt: daysAgo(30),
				updatedAt: now,
			},
			{
				id: randomUUID(),
				userId: userId2,
				timezone: 'Europe/London',
				dateFormat: 'DD/MM/YYYY',
				timeFormat: 'HH:mm',
				createdAt: daysAgo(15),
				updatedAt: now,
			},
		],

		websiteIds: [websiteId1, websiteId2, websiteId3],
	};
};

function generatePaths() {
	const paths = [
		'/',
		'/home',
		'/pricing',
		'/features',
		'/docs',
		'/api',
		'/login',
		'/signup',
		'/dashboard',
		'/settings',
		'/profile',
		'/search',
		'/checkout',
		'/cart',
		'/wishlist',
	];

	// Company pages
	for (const section of COMPANY_SECTIONS) {
		paths.push(`/${section}`);
	}

	// Blog paths
	for (const category of BLOG_CATEGORIES) {
		paths.push(`/blog/${category}`);
		for (let i = 0; i < 5; i++) {
			const slug = faker.lorem.slug({ min: 2, max: 6 });
			paths.push(`/blog/${category}/${slug}`);
		}
	}

	// Product/service paths
	for (const category of PRODUCT_CATEGORIES) {
		paths.push(`/products/${category}`);
		paths.push(`/services/${category}`);
		for (let i = 0; i < 3; i++) {
			const productName = faker.commerce
				.productName()
				.toLowerCase()
				.replace(/\s+/g, '-');
			paths.push(`/products/${category}/${productName}`);
		}
	}

	// Documentation paths
	const docSections = [
		'getting-started',
		'api-reference',
		'tutorials',
		'examples',
		'guides',
		'troubleshooting',
	];
	for (const section of docSections) {
		paths.push(`/docs/${section}`);
		for (let i = 0; i < 4; i++) {
			const docSlug = faker.lorem.slug({ min: 1, max: 3 });
			paths.push(`/docs/${section}/${docSlug}`);
		}
	}

	// User-generated content
	for (let i = 0; i < 20; i++) {
		const userId = faker.string.alphanumeric(8);
		paths.push(`/user/${userId}`);
		paths.push(`/profile/${userId}`);
	}

	return paths;
}

function generateCustomProperties(eventName: string) {
	const baseProps: Record<string, unknown> = {};

	// Core databuddy.js events have specific property patterns
	switch (eventName) {
		case 'page_exit':
			// page_exit events include engagement metrics (handled in main event generation)
			return {};
		case 'link_out':
			return {
				href: faker.internet.url(),
				text: faker.lorem.words({ min: 1, max: 4 }),
			};
		case 'screen_view':
			// screen_view events include page_count (handled in main event generation)
			return {};
		case 'purchase':
		case 'order_completed':
			return {
				order_id: faker.string.alphanumeric(12),
				total_amount: faker.number.float({
					min: 10,
					max: 500,
					fractionDigits: 2,
				}),
				currency: faker.helpers.arrayElement([
					'USD',
					'EUR',
					'GBP',
					'CAD',
					'AUD',
				]),
				item_count: faker.number.int({ min: 1, max: 5 }),
				payment_method: faker.helpers.arrayElement([
					'card',
					'paypal',
					'apple_pay',
					'google_pay',
				]),
				coupon_used: faker.helpers.maybe(() => faker.lorem.word(), {
					probability: 0.3,
				}),
				shipping_method: faker.helpers.arrayElement([
					'standard',
					'express',
					'overnight',
				]),
			};
		case 'add_to_cart':
		case 'remove_from_cart':
			return {
				product_id: faker.string.alphanumeric(8),
				product_name: faker.commerce.productName(),
				price: faker.number.float({ min: 5, max: 200, fractionDigits: 2 }),
				quantity: faker.number.int({ min: 1, max: 3 }),
				category: faker.helpers.arrayElement(PRODUCT_CATEGORIES),
			};
		case 'search':
			return {
				query: faker.lorem.words({ min: 1, max: 4 }),
				results_count: faker.number.int({ min: 0, max: 100 }),
				filters_applied: faker.helpers.maybe(
					() =>
						faker.helpers.arrayElements(PRODUCT_CATEGORIES, { min: 1, max: 3 }),
					{ probability: 0.4 }
				),
			};
		case 'video_play':
		case 'video_started':
			return {
				video_id: faker.string.alphanumeric(10),
				video_title: faker.lorem.sentence({ min: 3, max: 8 }),
				video_duration: faker.number.int({ min: 30, max: 3600 }),
				quality: faker.helpers.arrayElement(['720p', '1080p', '4k']),
			};
		case 'signup':
		case 'account_created':
			return {
				registration_method: faker.helpers.arrayElement([
					'email',
					'google',
					'github',
					'facebook',
				]),
				referral_code: faker.helpers.maybe(() => faker.string.alphanumeric(8), {
					probability: 0.2,
				}),
				plan_selected: faker.helpers.arrayElement([
					'free',
					'starter',
					'pro',
					'enterprise',
				]),
			};
		case 'form_submit':
		case 'contact_form_submit':
			return {
				form_name: faker.helpers.arrayElement([
					'contact',
					'newsletter',
					'demo_request',
					'support',
				]),
				fields_count: faker.number.int({ min: 2, max: 8 }),
				submission_time: faker.number.int({ min: 15, max: 300 }),
			};
		case 'feature_used':
			return {
				feature_name: faker.helpers.arrayElement([
					'export',
					'import',
					'share',
					'collaborate',
					'analytics',
					'automation',
				]),
				usage_duration: faker.number.int({ min: 5, max: 180 }),
				user_tier: faker.helpers.arrayElement(['free', 'paid', 'trial']),
			};
		default:
			// Random additional properties for any event
			if (faker.datatype.boolean({ probability: 0.3 })) {
				baseProps.experiment_variant = faker.helpers.arrayElement([
					'control',
					'variant_a',
					'variant_b',
				]);
			}
			if (faker.datatype.boolean({ probability: 0.2 })) {
				baseProps.user_segment = faker.helpers.arrayElement([
					'new',
					'returning',
					'premium',
					'trial',
				]);
			}
			return baseProps;
	}
}

const DOT_REGEX = /\.$/;

function generatePageTitle(path: string): string {
	if (path === '/') {
		return 'Home';
	}
	if (path.startsWith('/blog/')) {
		const parts = path.split('/');
		if (parts.length === 3) {
			return `${parts[2].charAt(0).toUpperCase() + parts[2].slice(1)} Blog`;
		}
		return faker.lorem.sentence({ min: 4, max: 8 }).replace(DOT_REGEX, '');
	}
	if (path.startsWith('/products/')) {
		return `${faker.commerce.productName()} - Products`;
	}
	if (path.startsWith('/docs/')) {
		return `Documentation - ${path.split('/').pop()?.replace(/-/g, ' ')}`;
	}
	if (path.startsWith('/user/') || path.startsWith('/profile/')) {
		return `${faker.person.fullName()} - Profile`;
	}

	// Default title generation
	const pathName = path.substring(1).replace(/-/g, ' ').replace(/\//g, ' - ');
	return pathName.charAt(0).toUpperCase() + pathName.slice(1) || 'Page';
}

const PATHS = generatePaths();

function generateUserPool(uniqueUsers: number) {
	return Array.from({ length: uniqueUsers }, () => ({
		anonymousId: `anon_${faker.string.uuid()}`,
		country: faker.location.countryCode(),
		region: faker.location.state(),
		city: faker.location.city(),
		timezone: faker.helpers.arrayElement([
			'America/New_York',
			'Europe/London',
			'Asia/Tokyo',
			'Australia/Sydney',
			'Pacific/Honolulu',
		]),
		language: faker.helpers.arrayElement([
			'en-US',
			'en-GB',
			'fr-FR',
			'de-DE',
			'es-ES',
			'pt-BR',
			'ja-JP',
		]),
		deviceType: faker.helpers.arrayElement(DEVICE_TYPES),
		browser: faker.helpers.arrayElement(BROWSERS),
		os: faker.helpers.arrayElement(OS_NAMES),
		screenResolution: `${faker.helpers.arrayElement([1920, 1366, 1440, 1280, 1024])}x${faker.helpers.arrayElement([1080, 768, 900, 720, 640])}`,
	}));
}

function generateSessionPool(userPool: UserPool, totalSessions: number) {
	return Array.from({ length: totalSessions }, () => {
		const currentUser = faker.helpers.arrayElement(userPool);
		const sessionStartTime = faker.date.recent({ days: 30 }).getTime();
		return {
			sessionId: `sess_${faker.string.uuid()}`,
			anonymousId: currentUser.anonymousId,
			sessionStartTime,
			user: currentUser,
			eventsInSession: faker.number.int({ min: 1, max: 15 }), // 1-15 events per session
			referrer: faker.helpers.arrayElement(REFERRERS),
		};
	});
}

type UserPool = ReturnType<typeof generateUserPool>;
type SessionPool = ReturnType<typeof generateSessionPool>;
type Event = ReturnType<typeof createSingleEvent>;

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Seed script needs comprehensive data generation
function createSingleEvent(
	client: string,
	websiteDomain: string,
	eventIndex: number,
	eventCount: number,
	totalSessions: number,
	sessionPool: SessionPool
) {
	// Pick a session based on event distribution
	const sessionIndex = Math.floor(eventIndex / (eventCount / totalSessions));
	const session = sessionPool[Math.min(sessionIndex, sessionPool.length - 1)];
	const currentUser = session.user;

	// Generate event time within session (sessions can span up to 2 hours)
	const maxSessionDuration = 2 * 60 * 60 * 1000; // 2 hours
	const sessionProgress =
		(eventIndex % Math.ceil(eventCount / totalSessions)) /
		Math.ceil(eventCount / totalSessions);
	const baseTime =
		session.sessionStartTime + sessionProgress * maxSessionDuration;

	const path = faker.helpers.arrayElement(PATHS);

	// Determine if this is the last event in the session for page_exit
	const isLastEventInSession =
		sessionProgress > 0.8 || faker.datatype.boolean({ probability: 0.2 });

	// Generate event based on realistic distribution from databuddy.js
	let eventName: string;
	if (isLastEventInSession && faker.datatype.boolean({ probability: 0.8 })) {
		// 80% chance of page_exit for last events in session
		eventName = 'page_exit';
	} else {
		eventName = faker.helpers.weightedArrayElement([
			{ weight: 70, value: 'screen_view' }, // Main page views
			{ weight: 5, value: 'link_out' }, // Outgoing links
			{ weight: 25, value: faker.helpers.arrayElement(CUSTOM_EVENTS) }, // Custom events
		]);
	}

	const customProps = generateCustomProperties(eventName);
	const isPageExit = eventName === 'page_exit';

	return {
		id: faker.string.uuid(),
		client_id: client,
		event_name: eventName,
		anonymous_id: session.anonymousId,
		time: baseTime,
		session_id: session.sessionId,
		timestamp: baseTime,
		session_start_time: session.sessionStartTime,
		referrer: session.referrer === 'direct' ? undefined : session.referrer,
		url: `https://${websiteDomain}${path}`,
		path,
		title: generatePageTitle(path),
		ip: faker.internet.ip(),
		user_agent: faker.internet.userAgent(),
		browser_name: currentUser.browser,
		browser_version: faker.system.semver(),
		os_name: currentUser.os,
		os_version: faker.system.semver(),
		device_type: currentUser.deviceType,
		device_brand:
			currentUser.deviceType === 'mobile'
				? faker.helpers.arrayElement(['Apple', 'Samsung', 'Google'])
				: null,
		device_model:
			currentUser.deviceType === 'mobile' ? faker.commerce.productName() : null,
		country: currentUser.country,
		region: currentUser.region,
		city: currentUser.city,
		screen_resolution: currentUser.screenResolution,
		viewport_size: `${faker.number.int({ min: 800, max: 1920 })}x${faker.number.int({ min: 600, max: 1080 })}`,
		language: currentUser.language,
		timezone: currentUser.timezone,
		connection_type: faker.helpers.arrayElement([
			'wifi',
			'4g',
			'ethernet',
			'3g',
		]),
		rtt: faker.number.int({ min: 10, max: 500 }),
		downlink: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
		// Engagement metrics - only populated for page_exit events or screen_view
		time_on_page:
			isPageExit || eventName === 'screen_view'
				? faker.number.float({ min: 5, max: 600, fractionDigits: 1 })
				: undefined,
		scroll_depth: isPageExit
			? faker.number.float({ min: 10, max: 100, fractionDigits: 1 })
			: undefined,
		interaction_count: isPageExit
			? faker.number.int({ min: 0, max: 50 })
			: undefined,
		exit_intent: isPageExit ? (faker.datatype.boolean() ? 1 : 0) : 0,
		page_count:
			eventName === 'screen_view' || isPageExit
				? faker.number.int({ min: 1, max: 10 })
				: 1,
		is_bounce: isPageExit
			? faker.number.int({ min: 1, max: 10 }) === 1
				? 1
				: 0 // 10% bounce rate
			: 0,
		has_exit_intent: isPageExit
			? faker.datatype.boolean({ probability: 0.15 })
				? 1
				: 0 // 15% exit intent
			: undefined,
		page_size: faker.number.int({ min: 50_000, max: 5_000_000 }),
		// UTM parameters - from URL or referrer
		utm_source: faker.helpers.maybe(
			() =>
				faker.helpers.arrayElement(['google', 'facebook', 'twitter', 'email']),
			{ probability: 0.3 }
		),
		utm_medium: faker.helpers.maybe(
			() => faker.helpers.arrayElement(['cpc', 'organic', 'social', 'email']),
			{ probability: 0.3 }
		),
		utm_campaign: faker.helpers.maybe(() => faker.lorem.slug(), {
			probability: 0.2,
		}),

		// Performance metrics - only for screen_view events when trackPerformance is enabled
		load_time:
			eventName === 'screen_view'
				? faker.number.int({ min: 200, max: 5000 })
				: undefined,
		dom_ready_time:
			eventName === 'screen_view'
				? faker.number.int({ min: 100, max: 3000 })
				: undefined,
		dom_interactive:
			eventName === 'screen_view'
				? faker.number.int({ min: 50, max: 2000 })
				: undefined,
		ttfb:
			eventName === 'screen_view'
				? faker.number.int({ min: 50, max: 1000 })
				: undefined,
		connection_time:
			eventName === 'screen_view'
				? faker.number.int({ min: 10, max: 200 })
				: undefined,
		request_time:
			eventName === 'screen_view'
				? faker.number.int({ min: 20, max: 500 })
				: undefined,
		render_time:
			eventName === 'screen_view'
				? faker.number.int({ min: 50, max: 1000 })
				: undefined,
		redirect_time:
			eventName === 'screen_view'
				? faker.number.int({ min: 0, max: 100 })
				: undefined,
		domain_lookup_time:
			eventName === 'screen_view'
				? faker.number.int({ min: 5, max: 100 })
				: undefined,
		// Web Vitals - only for screen_view events with trackWebVitals enabled
		fcp:
			eventName === 'screen_view' &&
			faker.datatype.boolean({ probability: 0.3 })
				? faker.number.int({ min: 500, max: 4000 })
				: undefined,
		lcp:
			eventName === 'screen_view' &&
			faker.datatype.boolean({ probability: 0.3 })
				? faker.number.int({ min: 1000, max: 6000 })
				: undefined,
		cls:
			eventName === 'screen_view' &&
			faker.datatype.boolean({ probability: 0.3 })
				? faker.number.float({ min: 0, max: 0.5, fractionDigits: 3 })
				: undefined,
		fid:
			eventName === 'screen_view' &&
			faker.datatype.boolean({ probability: 0.2 })
				? faker.number.int({ min: 10, max: 300 })
				: undefined,
		inp:
			eventName === 'screen_view' &&
			faker.datatype.boolean({ probability: 0.2 })
				? faker.number.int({ min: 50, max: 500 })
				: undefined,
		href: faker.helpers.maybe(() => faker.internet.url(), {
			probability: 0.2,
		}),
		text: faker.helpers.maybe(() => faker.lorem.words({ min: 1, max: 5 }), {
			probability: 0.2,
		}),
		value: faker.helpers.maybe(() => faker.commerce.price(), {
			probability: 0.1,
		}),
		// Add event-specific properties
		...(eventName === 'page_exit' && {
			// page_exit events get unique eventId for deduplication
			event_id: `exit_${session.sessionId}_${btoa(path)}_${baseTime}`,
		}),
		...(eventName === 'screen_view' && {
			// screen_view events include performance data
			load_time: faker.number.int({ min: 200, max: 5000 }),
			dom_ready_time: faker.number.int({ min: 100, max: 3000 }),
			dom_interactive: faker.number.int({ min: 50, max: 2000 }),
			ttfb: faker.number.int({ min: 50, max: 1000 }),
			request_time: faker.number.int({ min: 20, max: 500 }),
			render_time: faker.number.int({ min: 50, max: 1000 }),
		}),

		properties: JSON.stringify(customProps),
		created_at: Date.now(),
	};
}

const generateClickHouseEvents = (websiteIds: string[]) => {
	const eventCount = 30 * 150;
	const uniqueUsers = Math.max(10, Math.floor(eventCount / 8)); // ~8 events per user on average
	const sessionsPerUser = 2.5; // Average sessions per user
	const totalSessions = Math.floor(uniqueUsers * sessionsPerUser);
	const userPool = generateUserPool(uniqueUsers);
	const sessionPool = generateSessionPool(userPool, totalSessions);

	const events: Event[] = [];

	Array.from({ length: eventCount }).forEach((_, index) => {
		const websiteId = websiteIds[Math.floor(Math.random() * websiteIds.length)];
		const event = createSingleEvent(
			websiteId,
			'example.com',
			index,
			eventCount,
			totalSessions,
			sessionPool
		);
		events.push(event);
	});

	events.sort((a, b) => a.time - b.time);

	return events;
};

async function seedPostgreSQL() {
	console.log('Seeding PostgreSQL...');

	const data = generateSampleData();

	try {
		console.log('Creating users with Better Auth...');

		const adminResult = await auth.api.signUpEmail({
			body: {
				name: 'John Doe',
				email: 'admin@databuddy.dev',
				password: 'password123',
			},
		});

		const userResult = await auth.api.signUpEmail({
			body: {
				name: 'Jane Smith',
				email: 'user@databuddy.dev',
				password: 'password123',
			},
		});

		if (!adminResult) {
			throw new Error('Failed to create admin user via Better Auth');
		}
		if (!userResult) {
			throw new Error('Failed to create regular user via Better Auth');
		}

		console.log('Updating user roles...');
		await db
			.update(user)
			.set({
				role: 'ADMIN',
				firstName: 'John',
				lastName: 'Doe',
				emailVerified: true,
			})
			.where(eq(user.email, 'admin@databuddy.dev'));

		await db
			.update(user)
			.set({
				role: 'USER',
				firstName: 'Jane',
				lastName: 'Smith',
				emailVerified: true,
			})
			.where(eq(user.email, 'user@databuddy.dev'));

		const adminUser = await db.query.user.findFirst({
			where: eq(user.email, 'admin@databuddy.dev'),
		});
		const regularUser = await db.query.user.findFirst({
			where: eq(user.email, 'user@databuddy.dev'),
		});

		if (!adminUser) {
			throw new Error('Admin user not found after creation');
		}
		if (!regularUser) {
			throw new Error('Regular user not found after creation');
		}

		const userId1 = adminUser.id;
		const userId2 = regularUser.id;

		console.log('Creating organizations...');
		await db.insert(organization).values(data.organizations);

		console.log('Creating organization members...');
		const updatedMembers = data.members.map((memberData) => ({
			...memberData,
			userId: memberData.userId === data.users[0].id ? userId1 : userId2,
		}));
		await db.insert(member).values(updatedMembers);

		console.log('Creating websites...');
		const updatedWebsites = data.websites.map((website) => {
			if (website.userId === data.users[0].id) {
				return { ...website, userId: userId1 };
			}
			if (website.userId === data.users[1].id) {
				return { ...website, userId: userId2 };
			}
			return { ...website, userId: null };
		});
		await db.insert(websites).values(updatedWebsites);

		console.log('Creating user preferences...');
		const updatedPreferences = data.userPreferences.map((pref) => ({
			...pref,
			userId: pref.userId === data.users[0].id ? userId1 : userId2,
		}));
		await db.insert(userPreferences).values(updatedPreferences);

		console.log('PostgreSQL seeding completed successfully!');
		return data.websiteIds;
	} catch (error) {
		console.error('Error seeding PostgreSQL:', error);
		throw error;
	}
}

async function seedClickHouse(websiteIds: string[]) {
	console.log('Seeding ClickHouse...');

	try {
		console.log('Initializing ClickHouse schema...');
		const schemaResult = await initClickHouseSchema();
		if (!schemaResult.success) {
			throw new Error(`Schema initialization failed: ${schemaResult.message}`);
		}

		console.log('Generating sample events...');
		const events = generateClickHouseEvents(websiteIds);

		console.log(`Inserting ${events.length} events...`);

		await clickHouse.insert({
			table: TABLE_NAMES.events,
			format: 'JSONEachRow',
			values: events,
		});

		console.log('ClickHouse seeding completed successfully!');
	} catch (error) {
		console.error('Error seeding ClickHouse:', error);
		throw error;
	}
}

async function seedDatabase() {
	console.log('Starting database seeding...\n');

	try {
		await db.delete(websites);
		await db.delete(account);
		await db.delete(member);
		await db.delete(userPreferences);
		await db.delete(user);
		await db.delete(organization);

		const websiteIds = await seedPostgreSQL();

		try {
			await seedClickHouse(websiteIds);
		} catch {
			console.log('ClickHouse seeding skipped (service not available)');
		}

		console.log('\nDatabase seeding completed successfully!');
		console.log('\nCreated test accounts:');
		console.log('  Admin: admin@databuddy.dev / password123');
		console.log('  User:  user@databuddy.dev / password123');
		console.log('\nCreated websites:');
		console.log('  - acme.com (Acme Corporation)');
		console.log('  - blog.acme.com (Acme Corporation)');
		console.log('  - startupco.io (StartupCo)');
		console.log(
			'\nAnalytics data will be available once ClickHouse is running'
		);
	} catch (error) {
		console.error('\nSeeding failed:', error);
		process.exit(1);
	}
}

seedDatabase()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error('Seeding error:', error);
		process.exit(1);
	});
