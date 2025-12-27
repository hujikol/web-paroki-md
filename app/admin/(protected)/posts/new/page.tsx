import PostForm from "@/components/admin/PostForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth.config";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-white px-8 rounded-lg shadow">
      <PostForm mode="create" user={session?.user} />
    </div>
  );
}
