"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/actions/posts";
import MarkdownEditor from "./MarkdownEditor";
import ImageUploader from "./ImageUploader";
import { Post } from "@/types/post";

interface PostFormProps {
  post?: Post;
  mode: "create" | "edit";
}

export default function PostForm({ post, mode }: PostFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: post?.frontmatter.title || "",
    description: post?.frontmatter.description || "",
    author: post?.frontmatter.author || "",
    tags: post?.frontmatter.tags.join(", ") || "",
    content: post?.content || "",
    banner: post?.frontmatter.banner || "",
    published: post?.frontmatter.published || false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const data = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      published: publish,
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

  return (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          placeholder="Post title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Author</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            placeholder="Author name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            placeholder="nextjs, react, tutorial"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Banner Image</label>
        <ImageUploader
          type="banner"
          onUploadComplete={(path) => setFormData({ ...formData, banner: path })}
        />
        {formData.banner && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current: {formData.banner}</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <MarkdownEditor
          value={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, false)}
          disabled={saving}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Draft"}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Publishing..." : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
