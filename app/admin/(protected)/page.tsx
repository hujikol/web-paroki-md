import Link from "next/link";
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue font-medium shadow-sm transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wider">
            Total Posts
          </h3>
          <p className="text-3xl font-bold text-brand-dark">
            {posts.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-500">
          <h3 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wider">
            Published
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {publishedCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-yellow-500">
          <h3 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wider">
            Drafts
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {draftCount}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Recent Posts
          </h2>
        </div>
        <PostTable posts={posts} />
      </div>
    </div>
  );
}
