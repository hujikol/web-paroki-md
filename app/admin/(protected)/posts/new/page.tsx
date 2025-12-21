import PostForm from "@/components/admin/PostForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth.config";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Create New Post
      </h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <PostForm mode="create" user={session?.user} />
      </div>
    </div>
  );
}
