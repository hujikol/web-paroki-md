import DashboardLink from "@/components/admin/DashboardLink";
import { getAllPosts } from "@/actions/posts";
import PostTable from "@/components/admin/PostTable";

export default async function AdminDashboard() {
  // Sort posts by date descending
  const posts = (await getAllPosts()).sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  
  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Selamat datang kembali! Berikut ringkasan konten Anda.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-blue-500 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-brand-cream rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
              </div>
          </div>
          <h3 className="text-gray-600 text-xs font-bold uppercase tracking-widest">
            Total Posts
          </h3>
          <p className="text-4xl font-bold text-brand-dark mt-1">
            {posts.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-green-500 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
              </div>
          </div>
          <h3 className="text-gray-600 text-xs font-bold uppercase tracking-widest">
            Published
          </h3>
          <p className="text-4xl font-bold text-green-600 mt-1">
            {publishedCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow group">
           <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
              </div>
          </div>
          <h3 className="text-gray-600 text-xs font-bold uppercase tracking-widest">
            Drafts
          </h3>
          <p className="text-4xl font-bold text-yellow-600 mt-1">
            {draftCount}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
            Recent Posts
          </h2>
          <DashboardLink href="/admin/posts" className="text-brand-blue text-sm font-bold hover:underline">
            View All
          </DashboardLink>
        </div>
        <PostTable posts={posts.slice(0, 5)} hidePagination={true} />
      </div>
    </div>
  );
}
