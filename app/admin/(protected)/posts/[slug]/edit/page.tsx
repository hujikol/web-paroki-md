import { notFound } from "next/navigation";
import { getPostBySlug } from "@/actions/posts";
import PostForm from "@/components/admin/PostForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth.config";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const session = await getServerSession(authOptions);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Edit Post
      </h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <PostForm post={post} mode="edit" user={session?.user} />
      </div>
    </div>
  );
}
