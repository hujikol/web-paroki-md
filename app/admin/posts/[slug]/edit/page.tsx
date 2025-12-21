import { notFound } from "next/navigation";
import { getPostBySlug } from "@/actions/posts";
import PostForm from "@/components/admin/PostForm";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Edit Post
      </h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <PostForm post={post} mode="edit" />
      </div>
    </div>
  );
}
