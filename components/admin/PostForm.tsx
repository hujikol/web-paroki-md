"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost, deletePost } from "@/actions/posts";
import { getAllCategories, addCategory } from "@/actions/categories";
import QuillEditor from "./QuillEditor";
import MediaPickerModal from "./MediaPickerModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import StatusPill from "./StatusPill";
import { Post, PostCategory } from "@/types/post";
import { useLoading } from "./LoadingProvider";
import { POST_CATEGORIES } from "@/lib/constants";
import { Eye } from "lucide-react";

interface PostFormProps {
    post?: Post;
    mode: "create" | "edit";
    user?: { name?: string | null } | null;
    categories: string[];
}

export default function PostForm({ post, mode, user, categories: masterCategories }: PostFormProps) {
    const router = useRouter();
    const { startTransition } = useLoading();
    const [formData, setFormData] = useState({
        title: post?.frontmatter.title || "",
        description: post?.frontmatter.description || "",
        author: post?.frontmatter.author || "Admin Paroki",
        tags: post?.frontmatter.tags || [],
        category: post?.frontmatter.category || (masterCategories[0] || "umum") as PostCategory,
        content: post?.content || { ops: [] },
        banner: post?.frontmatter.banner || "",
        published: post?.frontmatter.published || false,
        // SEO Fields
        metaTitle: post?.frontmatter.metaTitle || "",
        metaDescription: post?.frontmatter.metaDescription || "",
        metaKeywords: post?.frontmatter.metaKeywords || "",
        ogImage: post?.frontmatter.ogImage || "",
    });

    const [tagInput, setTagInput] = useState("");

    // removed local categories state fetching since passed via props
    const [categories, setCategories] = useState<string[]>([]); // Keep for tags autocomplete if needed, but maybe better to avoid confusion? 
    // Wait, getAllCategories() fetches tags essentially in the old system. 
    // Let's rename the prop to masterCategories to avoid conflict.

    const [loadingCategories, setLoadingCategories] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    // ...

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showBannerPicker, setShowBannerPicker] = useState(false);
    const [showOgImagePicker, setShowOgImagePicker] = useState(false);
    const [showPublishDropdown, setShowPublishDropdown] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowPublishDropdown(false);
            }
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false);
            }
        };
        if (showPublishDropdown || showCategoryDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPublishDropdown, showCategoryDropdown]);

    // Fetch categories for suggestions
    useEffect(() => {
        setLoadingCategories(true);
        getAllCategories()
            .then(setCategories)
            .finally(() => setLoadingCategories(false));
    }, []);

    const handleSubmit = async (publishStatus: boolean) => {
        const hasContent = formData.content &&
            (typeof formData.content === 'string' ? formData.content.trim() !== "" :
                formData.content.ops && formData.content.ops.length > 0);

        if (!formData.title || !hasContent) {
            setError("Title and Content are required.");
            return;
        }

        startTransition(async () => {
            setSaving(true);
            setError(null);

            // Logic to auto-save new categories if entered
            for (const tag of formData.tags) {
                if (!categories.includes(tag)) {
                    // Silently add new category
                    await addCategory(tag);
                }
            }

            const data = {
                ...formData,
                // Use the first tag as the category, defaulting to "umum" if no tags
                category: formData.category,
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
        });
    };

    const handleDelete = () => {
        if (!post) return;
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!post) return;
        startTransition(async () => {
            setSaving(true);
            const result = await deletePost(post.frontmatter.slug);
            if (result.success) {
                router.push("/admin/posts");
                router.refresh();
            } else {
                setError(result.error || "Failed to delete post");
                setSaving(false);
                setShowDeleteModal(false);
            }
        });
    };

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (trimmed && !formData.tags.includes(trimmed)) {
            setFormData({ ...formData, tags: [...formData.tags, trimmed] });
        }
        setTagInput("");
    };

    const removeTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((t) => t !== tag),
        });
    };

    return (
        <form className="min-h-screen relative pb-20">
            {/* Sticky Header with Actions */}
            <div className="sticky top-0 z-40 bg-white py-4 pt-8 mb-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <StatusPill published={formData.published} />
                    <h2 className="text-xl font-bold text-gray-800">
                        {mode === "create" ? "Create New Post" : `Editing: ${formData.title}`}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-brand-blue focus:z-10 focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-sm"
                    >
                        Back
                    </button>

                    {mode === "edit" && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={saving}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-gray-200 rounded-lg hover:bg-red-700 focus:z-10 focus:ring-2 focus:ring-red-700/20 transition-all"
                        >
                            Delete
                        </button>
                    )}

                    <div className="inline-flex rounded-lg shadow-sm" role="group">

                        <button
                            type="button"
                            onClick={() => handleSubmit(true)}
                            disabled={saving}
                            className={`px-4 py-2 text-sm font-medium text-white bg-brand-blue border border-brand-blue rounded-s-lg hover:bg-brand-darkBlue focus:z-10 focus:ring-2 focus:ring-brand-blue/20 transition-all`}
                        >
                            {saving ? "Saving..." : (formData.published ? "Update" : "Publish")}
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setShowPublishDropdown(!showPublishDropdown)}
                                disabled={saving}
                                className="inline-flex items-center px-2 py-2 h-full text-sm font-medium text-white bg-brand-blue border-l border-white/20 rounded-e-lg hover:bg-brand-darkBlue focus:z-10 focus:ring-1 focus:ring-brand-blue/20 transition-all"
                            >
                                <svg className="w-4 h-4 transition-transform duration-200" style={{ transform: showPublishDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m1 2 3 3 3-3" />
                                </svg>
                            </button>

                            {showPublishDropdown && (
                                <div className="absolute right-0 z-50 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 animate-fade-in overflow-hidden">
                                    <div className="py-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleSubmit(false);
                                                setShowPublishDropdown(false);
                                            }}
                                            className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-cream hover:bg-grey-100 transition-colors gap-2"
                                        >
                                            Save as Draft
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // Use first tag as category for preview, or 'umum' fallback
                                                const category = (formData.tags.length > 0 ? formData.tags[0].toLowerCase().replace(/\s+/g, '-') : 'umum');
                                                const slug = post?.frontmatter.slug || (formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : null);

                                                if (slug) {
                                                    window.open(`/artikel/${category}/${slug}`, '_blank');
                                                } else {
                                                    alert("Please enter a title to preview.");
                                                }
                                            }}
                                            className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-cream hover:bg-grey-100 transition-colors gap-2"
                                        >
                                            <Eye className="w-4 h-4" /> Preview
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    {/* Main Content Area */}
                    <div>
                        {error && (
                            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
                                {error}
                            </div>
                        )}
                    </div>

                    <div>
                        <div>
                            <QuillEditor
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {/* Sticky Sidebar */}
                    <div className="sticky top-[87px] space-y-6">

                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider border-b pb-2 mb-4">
                                Post Settings
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Post Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-brand-blue"
                                        placeholder="Enter title here..."
                                    />
                                </div>
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


                                {/* Category Selection */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Category</label>
                                    <select
                                        value={formData.category as string}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as PostCategory })}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-brand-blue outline-none"
                                    >
                                        {masterCategories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Tags (Keywords)</label>
                                    <p className="text-[10px] text-gray-400 mb-2">
                                        The first tag will be used as the primary category for the URL.
                                    </p>

                                    {/* Badges container */}
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20"
                                                >
                                                    <span className="sr-only">Remove</span>
                                                    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75">
                                                        <path d="M4 4l6 6m0-6l-6 6" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                        {formData.tags.length === 0 && (
                                            <span className="text-[10px] text-gray-400 italic">No tags selected</span>
                                        )}
                                    </div>

                                    <div className="relative" ref={categoryDropdownRef}>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onFocus={() => setShowCategoryDropdown(true)}
                                                onChange={(e) => {
                                                    setTagInput(e.target.value);
                                                    setShowCategoryDropdown(true);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addTag(tagInput);
                                                        setShowCategoryDropdown(false);
                                                    }
                                                }}
                                                className="w-full pl-3 pr-10 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                                                placeholder="Add tag..."
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                                {loadingCategories && (
                                                    <svg className="animate-spin h-3.5 w-3.5 text-brand-blue" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        addTag(tagInput);
                                                        setShowCategoryDropdown(false);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-brand-blue transition-colors"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {showCategoryDropdown && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto animate-fade-in divide-y divide-gray-50 ring-1 ring-black ring-opacity-5">
                                                {loadingCategories ? (
                                                    <div className="p-4 text-center">
                                                        <div className="animate-pulse flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                                                            Searching...
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {categories
                                                            .filter(cat =>
                                                                !formData.tags.includes(cat) &&
                                                                cat.toLowerCase().includes(tagInput.toLowerCase())
                                                            ).length > 0 ? (
                                                            categories
                                                                .filter(cat =>
                                                                    !formData.tags.includes(cat) &&
                                                                    cat.toLowerCase().includes(tagInput.toLowerCase())
                                                                )
                                                                .map(cat => (
                                                                    <button
                                                                        key={cat}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            addTag(cat);
                                                                            setShowCategoryDropdown(false);
                                                                        }}
                                                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-cream hover:text-brand-blue transition-colors flex items-center justify-between group"
                                                                    >
                                                                        <span className="font-medium">{cat}</span>
                                                                        <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </button>
                                                                ))
                                                        ) : (
                                                            <div className="p-4 text-center text-gray-400 text-xs italic">
                                                                {tagInput ? `Press Enter to add "${tagInput}"` : "Search for tags"}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
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
                                            onClick={() => setFormData({ ...formData, banner: "" })}
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

                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider border-b pb-2 mb-4">SEO Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Meta Title</label>
                                    <input
                                        type="text"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-brand-blue"
                                        placeholder="Leave empty to use post title"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Recommended: 50-60 characters</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Meta Description</label>
                                    <textarea
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-brand-blue"
                                        placeholder="Leave empty to use post description"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Recommended: 150-160 characters</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Meta Keywords</label>
                                    <input
                                        type="text"
                                        value={formData.metaKeywords}
                                        onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-brand-blue"
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Comma-separated keywords</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Open Graph Image</label>
                                    {formData.ogImage ? (
                                        <div className="relative group rounded-md overflow-hidden border border-gray-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={formData.ogImage} alt="OG Image" className="w-full h-32 object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, ogImage: "" })}
                                                className="absolute top-1 right-1 bg-white text-red-600 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove OG Image"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => setShowOgImagePicker(true)}
                                            className="h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 text-sm hover:border-brand-blue hover:text-brand-blue cursor-pointer transition-colors"
                                        >
                                            <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Select OG Image
                                        </div>
                                    )}
                                    {formData.ogImage && (
                                        <button
                                            type="button"
                                            onClick={() => setShowOgImagePicker(true)}
                                            className="w-full mt-2 py-2 text-xs font-medium text-brand-blue hover:underline"
                                        >
                                            Replace Image
                                        </button>
                                    )}
                                    <p className="text-[10px] text-gray-400 mt-1">Leave empty to use banner image</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MediaPickerModal
                isOpen={showBannerPicker}
                onClose={() => setShowBannerPicker(false)}
                onSelect={(path) => {
                    setFormData({ ...formData, banner: path });
                    setShowBannerPicker(false);
                }}
                initialTab="banner"
            />
            <MediaPickerModal
                isOpen={showOgImagePicker}
                onClose={() => setShowOgImagePicker(false)}
                onSelect={(path) => {
                    setFormData({ ...formData, ogImage: path });
                    setShowOgImagePicker(false);
                }}
                initialTab="banner"
            />
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Post"
                message={`Are you sure you want to delete "${formData.title}"? This action cannot be undone and the post will be permanently removed from the website.`}
                loading={saving}
            />
        </form>
    );
}

