"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost, deletePost } from "@/actions/posts";
import { getAllCategories, addCategory } from "@/actions/categories";
import MarkdownEditor from "./MarkdownEditor";
import MediaPickerModal from "./MediaPickerModal";
import { Post } from "@/types/post";

interface PostFormProps {
  post?: Post;
  mode: "create" | "edit";
  user?: { name?: string | null } | null;
}

export default function PostForm({ post, mode, user }: PostFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: post?.frontmatter.title || "",
    description: post?.frontmatter.description || "",
    author: post?.frontmatter.author || user?.name || "Admin",
    tags: post?.frontmatter.tags.join(", ") || "",
    content: post?.content || "",
    banner: post?.frontmatter.banner || "",
    published: post?.frontmatter.published || false,
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBannerPicker, setShowBannerPicker] = useState(false);
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);

  // Fetch categories for suggestions
  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  const handleSubmit = async (publishStatus: boolean) => {
    if (!formData.title || !formData.content) {
        setError("Title and Content are required.");
        return;
    }

    setSaving(true);
    setError(null);

    // Logic to auto-save new categories if entered (simple comma separated check)
    // For now, we assume user picks existing or we can implement smart add later.
    // But let's verify if the entered tags are in our list, if not, maybe add them?
    // The request said "categories can be chosen... save it also in the web-paroki-content"
    const currentTags = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
    for (const tag of currentTags) {
        if (!categories.includes(tag)) {
            // Silently add new category
            await addCategory(tag);
        }
    }

    const data = {
      ...formData,
      tags: currentTags,
      published: publishStatus,
    };

    const result = mode === "create"
      ? await createPost(data)
      : await updatePost(post!.frontmatter.slug, data);

    setSaving(false);

    if (result.success) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      setError(result.error || "Failed to save post");
    }
  };
  
  const handleDelete = async () => {
      if (!post) return;
      if (confirm("Are you sure you want to delete this post? This cannot be undone.")) {
          setSaving(true);
          const result = await deletePost(post.frontmatter.slug);
          if (result.success) {
              router.push("/admin/posts");
              router.refresh();
          } else {
              setError(result.error || "Failed to delete post");
              setSaving(false);
          }
      }
  };

  return (
    <form className="min-h-screen relative pb-20">
       {/* Sticky Header with Actions */}
       <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm py-4 px-8 mb-8 flex justify-between items-center transition-all">
            <h2 className="text-xl font-bold text-gray-800">
                {mode === "create" ? "Create Post" : `Editing: ${formData.title}`}
            </h2>
            <div className="flex items-center gap-3">
                 <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm"
                 >
                    Cancel
                </button>
                
                {mode === "edit" && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={saving}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium text-sm transition-colors"
                    >
                        Delete
                    </button>
                )}

                {/* Split Button */}
                <div className="relative inline-flex rounded-md shadow-sm">
                    <button
                        type="button"
                        onClick={() => handleSubmit(true)} // Default to Publish/Save as Published
                        disabled={saving}
                        className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-l-md hover:bg-brand-darkBlue focus:z-10 focus:ring-1 focus:ring-brand-blue border-r border-blue-600"
                    >
                        {saving ? "Saving..." : (formData.published ? "Update" : "Publish")}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowPublishDropdown(!showPublishDropdown)}
                        className="px-2 bg-brand-blue text-white rounded-r-md hover:bg-brand-darkBlue focus:z-10 focus:ring-1 focus:ring-brand-blue"
                    >
                        <span className="sr-only">Menu</span>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    
                    {showPublishDropdown && (
                        <div className="origin-top-right absolute right-0 top-full mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleSubmit(false);
                                        setShowPublishDropdown(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Save Draft
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
             {/* Main Content Area */}
            <div>
                 {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
                    {error}
                    </div>
                 )}
            </div>

            <div className="space-y-2">
                <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:border-brand-blue text-3xl font-bold bg-transparent placeholder-gray-300 focus:ring-0 transition-colors"
                placeholder="Enter title here..."
                />
            </div>

            <div>
                <MarkdownEditor
                    markdown={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                />
            </div>
        </div>

        <div className="relative">
             {/* Sticky Sidebar */}
             <div className="sticky top-40 space-y-6">
                 
                 <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                     <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider border-b pb-2 mb-4">
                         Post Settings
                     </h3>

                     <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-brand-blue"
                                placeholder="Short summary..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Category / Tags</label>
                            <input
                                type="text"
                                list="category-suggestions"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-brand-blue"
                                placeholder="Select or type..."
                            />
                            <datalist id="category-suggestions">
                                {categories.map(cat => <option key={cat} value={cat} />)}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Author</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-brand-blue"
                            />
                        </div>
                    </div>
                 </div>

                 <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                     <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider border-b pb-2 mb-4">
                         Featured Image
                     </h3>
                     <div className="space-y-3">
                         {formData.banner ? (
                             <div className="relative group rounded-md overflow-hidden border border-gray-200">
                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                 <img src={formData.banner} alt="Banner" className="w-full h-32 object-cover" />
                                 <button
                                    type="button"
                                    onClick={() => setFormData({...formData, banner: ""})}
                                    className="absolute top-1 right-1 bg-white text-red-600 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove Banner"
                                 >
                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                     </svg>
                                 </button>
                             </div>
                         ) : (
                             <div 
                                onClick={() => setShowBannerPicker(true)}
                                className="h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 text-sm hover:border-brand-blue hover:text-brand-blue cursor-pointer transition-colors"
                             >
                                 <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                 </svg>
                                 Select Image
                             </div>
                         )}
                         
                         {formData.banner && (
                             <button
                                type="button"
                                onClick={() => setShowBannerPicker(true)}
                                className="w-full py-2 text-xs font-medium text-brand-blue hover:underline"
                             >
                                Replace Image
                             </button>
                         )}
                     </div>
                 </div>
             </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={showBannerPicker}
        onClose={() => setShowBannerPicker(false)}
        onSelect={(path) => {
            setFormData({...formData, banner: path});
            setShowBannerPicker(false);
        }}
        initialTab="banner"
      />
    </form>
  );
}
