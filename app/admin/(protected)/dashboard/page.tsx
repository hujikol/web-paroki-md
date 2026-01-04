import DashboardLink from "@/components/admin/DashboardLink";
import { getAllPosts } from "@/actions/posts";
import { getUMKM, getJadwalKegiatan, getStatistik } from "@/actions/data";
import PostTable from "@/components/admin/PostTable";
import {
  FileText,
  Store,
  Calendar,
  Users,
  ArrowUpRight
} from "lucide-react";

export default async function AdminDashboard() {
  // Fetch all data in parallel
  const [posts, umkms, events, statistik] = await Promise.all([
    getAllPosts(),
    getUMKM(),
    getJadwalKegiatan(),
    getStatistik()
  ]);

  // Process data
  const publishedPosts = posts.filter((p) => p.published);
  const totalPosts = posts.length;
  const totalUMKM = umkms.length;

  // Filter upcoming events
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalUpcomingEvents = upcomingEvents.length;
  const totalUmat = statistik?.parishioners || 0;

  // Process data for charts/breakdowns
  const umkmByType = umkms.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eventsByCategory = events.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 font-rubik">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Overview of website content and statistics.</p>
        </div>
        <DashboardLink
          href="/admin/posts/new"
          className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
          </svg>
          Create New Post
        </DashboardLink>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Posts Stat */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-blue-50 rounded-xl text-brand-blue group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2 py-1.5 bg-green-50 text-green-700 rounded-lg">
              {publishedPosts.length} Published
            </span>
          </div>
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Posts</h3>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalPosts}</p>
        </div>

        {/* UMKM Stat */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Terdaftar UMKM</h3>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalUMKM}</p>
          <div className="mt-4 flex flex-wrap gap-1">
            {Object.entries(umkmByType).slice(0, 3).map(([type, count]) => (
              <span key={type} className="text-[10px] px-2 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-100">
                {type}: {count}
              </span>
            ))}
            {Object.keys(umkmByType).length > 3 && (
              <span className="text-[10px] px-2 py-1 bg-gray-50 text-gray-400 rounded-full border border-gray-100">+{Object.keys(umkmByType).length - 3}</span>
            )}
          </div>
        </div>

        {/* Events Stat */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2 py-1.5 bg-orange-50 text-orange-700 rounded-lg">
              Next 7 Days
            </span>
          </div>
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Upcoming Events</h3>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalUpcomingEvents}</p>
        </div>

        {/* Umat Stat */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-pink-50 rounded-xl text-pink-600 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Umat</h3>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalUmat.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Breakdowns Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* UMKM Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Store className="w-4 h-4 text-gray-400" />
            Statistik UMKM
          </h3>
          <div className="space-y-3">
            {Object.entries(umkmByType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-blue rounded-full"
                      style={{ width: `${(count / totalUMKM) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
            {totalUMKM === 0 && <p className="text-sm text-gray-400 italic">Belum ada data UMKM</p>}
          </div>
        </div>

        {/* Events Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            Kategori Kegiatan
          </h3>
          <div className="space-y-3">
            {Object.entries(eventsByCategory).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${category === 'liturgi' ? 'bg-purple-500' :
                        category === 'kegiatan' ? 'bg-blue-500' :
                          category === 'rapat' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}
                      style={{ width: `${(count / events.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
            {events.length === 0 && <p className="text-sm text-gray-400 italic">Belum ada data kegiatan</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Posts Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" /> Recent Posts
              </h2>
              <DashboardLink href="/admin/posts" className="text-brand-blue text-xs font-bold hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="w-3 h-3" />
              </DashboardLink>
            </div>
            <PostTable posts={posts.slice(0, 5)} hidePagination={true} />
          </div>
        </div>

        {/* Upcoming Events Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" /> Upcoming Events
              </h2>
              <DashboardLink href="/admin/data/jadwal" className="text-brand-blue text-xs font-bold hover:underline flex items-center gap-1">
                Manage <ArrowUpRight className="w-3 h-3" />
              </DashboardLink>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.slice(0, 5).map(event => (
                  <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-brand-cream/50 rounded-lg flex flex-col items-center justify-center border border-brand-blue/10">
                        <span className="text-xs font-bold text-brand-blue uppercase">
                          {new Date(event.date).toLocaleDateString("id-ID", { month: 'short' })}
                        </span>
                        <span className="text-lg font-extrabold text-brand-dark leading-none">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                          <span>{event.time}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="truncate">{event.location}</span>
                        </p>
                        <span className="inline-block mt-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-100 rounded">
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No upcoming events found.
                </div>
              )}
            </div>
            {upcomingEvents.length > 5 && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <span className="text-xs text-gray-500 font-medium">
                  +{upcomingEvents.length - 5} more events
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
