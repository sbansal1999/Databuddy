'use client';

import { GlobeIcon, MapPinIcon, QuestionIcon } from '@phosphor-icons/react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { CountryFlag } from '@/components/analytics/icons/CountryFlag';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMapLocationData } from '@/hooks/use-dynamic-query';
import { cn } from '@/lib/utils';
import type { LocationData } from '@databuddy/shared';
import { WebsitePageHeader } from '../_components/website-page-header';

const MapComponent = dynamic(
	() =>
		import('@/components/analytics/map-component').then((mod) => ({
			default: mod.MapComponent,
		})),
	{
		loading: () => (
			<div className="flex h-full items-center justify-center rounded bg-muted/20">
				<div className="flex flex-col items-center gap-3">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					<span className="font-medium text-muted-foreground text-sm">
						Loading map...
					</span>
				</div>
			</div>
		),
		ssr: false,
	}
);

function WebsiteMapPage() {
	const { id } = useParams<{ id: string }>();
	const [mode, setMode] = useState<'total' | 'perCapita'>('total');

	const { isLoading, getDataForQuery } = useMapLocationData(id, {
		start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split('T')[0],
		end_date: new Date().toISOString().split('T')[0],
		granularity: 'daily',
	});

	if (!id) {
		return <div>No website ID</div>;
	}

	const locationData: LocationData = {
		countries: (getDataForQuery('map-countries', 'country') || []).map(
			(item: {
				name: string;
				visitors: number;
				pageviews: number;
				country_code?: string;
				country_name?: string;
			}) => ({
				country: item.country_name || item.name,
				country_code: item.country_code || item.name,
				visitors: item.visitors,
				pageviews: item.pageviews,
			})
		),
		regions: (getDataForQuery('map-regions', 'region') || []).map(
			(item: { name: string; visitors: number; pageviews: number }) => ({
				country: item.name,
				visitors: item.visitors,
				pageviews: item.pageviews,
			})
		),
	};

	const topCountries = locationData.countries
		.filter((c) => c.country && c.country.trim() !== '')
		.slice(0, 8);

	const totalVisitors = locationData.countries.reduce(
		(sum, country) => sum + country.visitors,
		0
	);
	const unknownVisitors =
		locationData.countries.find((c) => !c.country || c.country.trim() === '')
			?.visitors || 0;

	return (
		<div className="flex h-[calc(100vh-7rem)] flex-col space-y-4 p-3 sm:p-4 lg:p-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<WebsitePageHeader
					additionalActions={
						<Tabs
							onValueChange={(value) => setMode(value as 'total' | 'perCapita')}
							value={mode}
						>
							<div className="relative border-b">
								<TabsList className="h-10 w-full justify-start overflow-x-auto bg-transparent p-0">
									<TabsTrigger
										className="relative h-10 cursor-pointer touch-manipulation whitespace-nowrap rounded-none px-2 text-xs transition-colors hover:bg-muted/50 sm:px-4 sm:text-sm"
										value="total"
									>
										Total Visitors
										{mode === 'total' && (
											<div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
										)}
									</TabsTrigger>
									<TabsTrigger
										className="relative h-10 cursor-pointer touch-manipulation whitespace-nowrap rounded-none px-2 text-xs transition-colors hover:bg-muted/50 sm:px-4 sm:text-sm"
										value="perCapita"
									>
										Per Capita
										{mode === 'perCapita' && (
											<div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
										)}
									</TabsTrigger>
								</TabsList>
							</div>
						</Tabs>
					}
					icon={
						<GlobeIcon
							aria-label="Globe"
							className="h-5 w-5 text-primary"
							weight="duotone"
						/>
					}
					subtitle={
						!isLoading && totalVisitors > 0
							? `${totalVisitors.toLocaleString()} visitors across ${topCountries.length} countries`
							: undefined
					}
					title="Geographic Data"
					variant="minimal"
					websiteId={id}
				/>
			</div>

			<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden md:flex-row">
				<Card className="flex min-h-0 flex-1 flex-col overflow-hidden rounded pt-4 pb-0">
					<CardHeader className="flex-shrink-0 pb-3">
						<CardTitle className="flex items-center justify-between">
							<span className="flex items-center gap-2">
								<MapPinIcon
									aria-label="World Map"
									className="h-4 w-4"
									weight="duotone"
								/>
								World Map
							</span>
							<Badge className="text-xs" variant="secondary">
								Hover to explore
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent className="min-h-0 flex-1 p-0">
						<MapComponent
							height="100%"
							isLoading={isLoading}
							locationData={locationData}
							mode={mode}
						/>
					</CardContent>
				</Card>

				<Card className="flex min-h-0 flex-1 flex-col overflow-hidden rounded md:w-72 md:flex-none">
					<CardHeader className="flex-shrink-0 pb-3">
						<CardTitle className="flex items-center gap-2">
							<GlobeIcon
								aria-label="Top Countries"
								className="h-4 w-4"
								weight="duotone"
							/>
							Top Countries
						</CardTitle>
					</CardHeader>
					<CardContent className="min-h-0 flex-1 overflow-hidden p-0">
						{isLoading ? (
							<div className="space-y-2 p-4">
								{Array(6)
									.fill(0)
									.map((_, i) => (
										<div
											className="flex items-center justify-between p-3"
											key={`country-skeleton-${i + 1}`}
										>
											<div className="flex items-center gap-3">
												<Skeleton className="h-4 w-6 rounded" />
												<Skeleton className="h-4 w-20" />
											</div>
											<Skeleton className="h-4 w-12" />
										</div>
									))}
							</div>
						) : (
							<div className="max-h-full overflow-y-auto">
								{topCountries.length > 0 && (
									<div>
										{topCountries.map((country, index) => {
											const percentage =
												totalVisitors > 0
													? (country.visitors / totalVisitors) * 100
													: 0;
											return (
												<div
													className={cn(
														'flex cursor-pointer items-center justify-between border-border/20 border-b p-3 transition-colors last:border-b-0 hover:bg-muted/50',
														index === 0 && 'bg-primary/5'
													)}
													key={country.country}
												>
													<div className="flex min-w-0 flex-1 items-center gap-3">
														<div className="relative h-4 w-6 flex-shrink-0 overflow-hidden rounded shadow-sm">
															<img
																alt={country.country}
																className="absolute inset-0 h-full w-full object-cover"
																onError={(e) => {
																	(e.target as HTMLImageElement).style.display =
																		'none';
																}}
																src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.country_code?.toUpperCase() || country.country.toUpperCase()}.svg`}
															/>
														</div>
														<div className="min-w-0 flex-1">
															<div className="truncate font-medium text-sm">
																{country.country}
															</div>
															<div className="text-muted-foreground text-xs">
																{percentage.toFixed(1)}%
															</div>
														</div>
													</div>
													<div className="flex-shrink-0 text-right">
														<div
															className={cn(
																'font-semibold text-sm',
																index === 0 && 'text-primary'
															)}
														>
															{country.visitors.toLocaleString()}
														</div>
														<div className="text-muted-foreground text-xs">
															{country.pageviews.toLocaleString()} views
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}

								{unknownVisitors > 0 && (
									<div className="border-t bg-muted/10">
										<div className="flex items-center justify-between p-3">
											<div className="flex min-w-0 flex-1 items-center gap-3">
												<div className="flex h-4 w-6 flex-shrink-0 items-center justify-center rounded bg-muted">
													<QuestionIcon
														aria-label="Unknown"
														className="h-3 w-3 text-muted-foreground"
														weight="duotone"
													/>
												</div>
												<div className="min-w-0 flex-1">
													<div className="font-medium text-sm">Unknown</div>
													<div className="text-muted-foreground text-xs">
														{totalVisitors > 0
															? (
																	(unknownVisitors / totalVisitors) *
																	100
																).toFixed(1)
															: 0}
														% of total
													</div>
												</div>
											</div>
											<div className="flex-shrink-0 text-right">
												<div className="font-semibold text-sm">
													{unknownVisitors.toLocaleString()}
												</div>
												<div className="text-muted-foreground text-xs">
													visitors
												</div>
											</div>
										</div>
									</div>
								)}

								{topCountries.length === 0 && unknownVisitors === 0 && (
									<div className="flex flex-col items-center justify-center py-16 text-center">
										<div className="mb-4">
											<div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/20">
												<GlobeIcon
													aria-label="No Data"
													className="h-7 w-7 text-muted-foreground/50"
													weight="duotone"
												/>
											</div>
										</div>
										<h4 className="mb-2 font-medium text-base text-foreground">
											No geographic data available
										</h4>
										<p className="max-w-[280px] text-muted-foreground text-sm">
											Location data will appear here when visitors start using
											your website.
										</p>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="flex h-[calc(100vh-7rem)] items-center justify-center">
					<div className="flex flex-col items-center gap-3">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
						<span className="font-medium text-muted-foreground text-sm">
							Loading...
						</span>
					</div>
				</div>
			}
		>
			<WebsiteMapPage />
		</Suspense>
	);
}
