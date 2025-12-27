import Link from "next/link";
import { getAllPosts } from "@/actions/posts";
import PostTable from "@/components/admin/PostTable";

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Posts
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kelola semua artikel dan kiriman blog Anda.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
          </svg>
          Create New Post
        </Link>
      </div>

      <PostTable posts={posts} />
    </div>
  );
}
