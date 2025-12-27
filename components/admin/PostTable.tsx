"use client";

import Link from "next/link";
import { useState } from "react";
import { deletePost } from "@/actions/posts";
import { PostMetadata } from "@/types/post";
import StatusPill from "./StatusPill";
import Tooltip from "./Tooltip";
import { useRouter } from "next/navigation";
import { useLoading } from "./LoadingProvider";

interface PostTableProps {
  posts: PostMetadata[];
  hidePagination?: boolean;
}

export default function PostTable({ posts, hidePagination = false }: PostTableProps) {
  const { startTransition } = useLoading();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(5);

  const effectiveItemsPerPage = itemsPerPage === "all" ? posts.length : itemsPerPage;
  const totalPages = Math.ceil(posts.length / effectiveItemsPerPage);
  
  const paginatedPosts = itemsPerPage === "all" 
    ? posts 
    : posts.slice((currentPage - 1) * effectiveItemsPerPage, currentPage * effectiveItemsPerPage);

  const handleItemsPerPageChange = (val: string) => {
    setItemsPerPage(val === "all" ? "all" : parseInt(val));
    setCurrentPage(1);
  };

  const handleDelete = async (slug: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      startTransition(async () => {
        setIsDeleting(slug);
        const result = await deletePost(slug);
        
        if (result.success) {
          router.refresh(); // Refresh server component to reflect changes
        } else {
          alert("Failed to delete post: " + result.error);
          setIsDeleting(null);
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
      <div className="overflow-visible">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest first:rounded-tl-2xl">
                Title
              </th>
              <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                Status
              </th>
              <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                Author
              </th>
               <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                Category
              </th>
              <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                Date
              </th>
              <th scope="col" className="relative px-8 py-4 last:rounded-tr-2xl">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedPosts.map((post, index) => (
              <tr key={post.slug} className="hover:bg-brand-cream/20 transition-colors group/row tracking-tight h-16">
                <td className="px-8 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900 group-hover/row:text-brand-blue transition-colors max-w-md truncate" title={post.title}>
                     <Link href={`/admin/posts/${post.slug}/edit`}>
                        {post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title}
                     </Link>
                  </div>
                </td>
                <td className="px-8 py-4 whitespace-nowrap">
                  <StatusPill published={post.published} />
                </td>
                <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {post.author}
                </td>
                <td className="px-8 py-4 whitespace-nowrap">
                  {post.tags && post.tags.length > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200">
                        {post.tags[0]}
                      </span>
                      {post.tags.length > 1 && (
                        <Tooltip 
                            position={index === 0 ? "bottom" : "top"}
                            content={
                                <div className="flex flex-col gap-1.5 py-1">
                                    <p className="border-b border-white/10 pb-1 mb-1 uppercase tracking-widest text-[8px] text-gray-400">All Categories</p>
                                    {post.tags.map((tag, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-brand-blue shrink-0" />
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            }
                        >
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-brand-cream text-brand-blue ring-1 ring-inset ring-brand-blue/10 cursor-help">
                                +{post.tags.length - 1}
                            </span>
                        </Tooltip>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 font-medium text-xs">None</span>
                  )}
                </td>
                <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500 tabular-nums">
                  {new Date(post.publishedAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-bold">
                  <div className="flex justify-end gap-3">
                    <Tooltip content="Edit Post content">
                      <Link
                        href={`/admin/posts/${post.slug}/edit`}
                        className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-darkBlue p-1.5 hover:bg-brand-blue/10 rounded-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                    </Tooltip>
                    <Tooltip content="Permanently delete post" position="left">
                      <button
                        onClick={() => handleDelete(post.slug, post.title)}
                        disabled={isDeleting === post.slug}
                        className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {isDeleting === post.slug ? "Wait..." : "Delete"}
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500 font-medium">
                No posts found. Create one to get started!
            </div>
        )}
      </div>

      {/* Pagination Controls */}
      {posts.length > 0 && !hidePagination && (
        <div className="bg-gray-50/80 px-8 py-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Show</label>
              <div className="relative group">
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => handleItemsPerPageChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-9 py-1.5 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-sm font-bold text-gray-900 cursor-pointer shadow-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value="all">All</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-400 group-hover:text-brand-blue transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium tracking-tight">
              Showing <span>{((currentPage - 1) * effectiveItemsPerPage) + 1}</span> to <span>{Math.min(currentPage * effectiveItemsPerPage, posts.length)}</span> of total <span>{posts.length}</span> results
            </p>
          </div>

          {itemsPerPage !== "all" && totalPages > 1 && (
            <nav className="inline-flex -space-x-px rounded-xl shadow-sm bg-white border border-gray-200 overflow-hidden" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all border-r border-gray-200"
                title="Previous Page"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`inline-flex items-center px-4 py-2 text-sm font-bold transition-all border-r border-gray-200 last:border-r-0 ${
                      currentPage === i + 1 
                        ? "bg-brand-blue text-white" 
                        : "bg-white text-gray-600 hover:bg-brand-cream/30 hover:text-brand-blue"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all border-l border-gray-200"
                title="Next Page"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
