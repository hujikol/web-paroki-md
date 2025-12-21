import Link from "next/link";
import { getAllPosts } from "@/actions/posts";

export default async function AdminDashboard() {
  const posts = await getAllPosts();
  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
            Total Posts
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {posts.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
            Published
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {publishedCount}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
            Drafts
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {draftCount}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="flex gap-4">
          <Link
            href="/admin/posts/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Create New Post
          </Link>
          <Link
            href="/admin/posts"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            Manage Posts
          </Link>
          <Link
            href="/admin/media"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Upload Media
          </Link>
        </div>
      </div>
    </div>
  );
}
