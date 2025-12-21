"use client";

import Link from "next/link";
import { useState } from "react";
import { deletePost } from "@/actions/posts";
import { PostMetadata } from "@/types/post";
import { useRouter } from "next/navigation";

interface PostTableProps {
  posts: PostMetadata[];
}

export default function PostTable({ posts }: PostTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (slug: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      setIsDeleting(slug);
      const result = await deletePost(slug);
      
      if (result.success) {
        router.refresh(); // Refresh server component to reflect changes
      } else {
        alert("Failed to delete post: " + result.error);
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadowoverflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.slug} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 group relative">
                     <Link href={`/admin/posts/${post.slug}/edit`} className="hover:text-brand-blue hover:underline">
                        {post.title}
                     </Link>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {post.published ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.author}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.tags?.[0] || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/posts/${post.slug}/edit`}
                    className="text-brand-blue hover:text-brand-darkBlue mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug, post.title)}
                    disabled={isDeleting === post.slug}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {isDeleting === post.slug ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                No posts found. Create one to get started!
            </div>
        )}
      </div>
    </div>
  );
}
