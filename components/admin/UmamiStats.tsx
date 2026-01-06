import { TrendingUp, Users, Eye, MousePointerClick, Clock } from "lucide-react";

interface UmamiStatsData {
    pageviews: number;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: number;
    comparison?: {
        pageviews: number;
        visitors: number;
        visits: number;
        bounces: number;
        totaltime: number;
    };
}

async function getUmamiStats(): Promise<UmamiStatsData | null> {
    const apiKey = process.env.UMAMI_API_KEY;
    const websiteId = "c438390e-addf-46b3-8f5e-47f26dcaf8c3";

    if (!apiKey) {
        console.warn("UMAMI_API_KEY is not set. Umami statistics will not be available.");
        return null;
    }

    try {
        // Get stats for the last 30 days
        const endAt = Date.now();
        const startAt = endAt - 30 * 24 * 60 * 60 * 1000; // 30 days ago

        const response = await fetch(
            `https://api.umami.is/v1/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
            {
                headers: {
                    "Accept": "application/json",
                    "x-umami-api-key": apiKey,
                },
                next: { revalidate: 300 }, // Revalidate every 5 minutes
            }
        );

        if (!response.ok) {
            console.error(`Umami API error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch Umami statistics:", error);
        return null;
    }
}

function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString("id-ID");
}

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
}

function calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

export default async function UmamiStats() {
    const stats = await getUmamiStats();

    if (!stats) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    Website Analytics
                </h2>
                <div className="text-center py-8">
                    <p className="text-sm text-gray-500">
                        Umami analytics are not available. Please configure the UMAMI_API_KEY environment variable.
                    </p>
                </div>
            </div>
        );
    }

    const bounceRate = stats.visits > 0 ? (stats.bounces / stats.visits) * 100 : 0;
    const avgVisitTime = stats.visits > 0 ? stats.totaltime / stats.visits : 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    Website Analytics
                    <span className="text-xs font-normal text-gray-500 ml-auto">Last 30 Days</span>
                </h2>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Page Views */}
                    <div className="group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                                <Eye className="w-4 h-4" />
                            </div>
                            {stats.comparison && (
                                <span className={`text-xs font-bold ${calculatePercentageChange(stats.pageviews, stats.comparison.pageviews) >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}>
                                    {calculatePercentageChange(stats.pageviews, stats.comparison.pageviews) >= 0 ? "↑" : "↓"}
                                    {Math.abs(calculatePercentageChange(stats.pageviews, stats.comparison.pageviews)).toFixed(1)}%
                                </span>
                            )}
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                            Page Views
                        </h3>
                        <p className="text-2xl font-extrabold text-gray-900">
                            {formatNumber(stats.pageviews)}
                        </p>
                    </div>

                    {/* Unique Visitors */}
                    <div className="group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:scale-110 transition-transform">
                                <Users className="w-4 h-4" />
                            </div>
                            {stats.comparison && (
                                <span className={`text-xs font-bold ${calculatePercentageChange(stats.visitors, stats.comparison.visitors) >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}>
                                    {calculatePercentageChange(stats.visitors, stats.comparison.visitors) >= 0 ? "↑" : "↓"}
                                    {Math.abs(calculatePercentageChange(stats.visitors, stats.comparison.visitors)).toFixed(1)}%
                                </span>
                            )}
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                            Visitors
                        </h3>
                        <p className="text-2xl font-extrabold text-gray-900">
                            {formatNumber(stats.visitors)}
                        </p>
                    </div>

                    {/* Total Visits */}
                    <div className="group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
                                <MousePointerClick className="w-4 h-4" />
                            </div>
                            {stats.comparison && (
                                <span className={`text-xs font-bold ${calculatePercentageChange(stats.visits, stats.comparison.visits) >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}>
                                    {calculatePercentageChange(stats.visits, stats.comparison.visits) >= 0 ? "↑" : "↓"}
                                    {Math.abs(calculatePercentageChange(stats.visits, stats.comparison.visits)).toFixed(1)}%
                                </span>
                            )}
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                            Total Visits
                        </h3>
                        <p className="text-2xl font-extrabold text-gray-900">
                            {formatNumber(stats.visits)}
                        </p>
                    </div>

                    {/* Bounce Rate */}
                    <div className="group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600 group-hover:scale-110 transition-transform">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                            Bounce Rate
                        </h3>
                        <p className="text-2xl font-extrabold text-gray-900">
                            {bounceRate.toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Average Visit Time</span>
                        <span className="font-bold text-gray-900">{formatDuration(avgVisitTime)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
