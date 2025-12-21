import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Create New Post
      </h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <PostForm mode="create" />
      </div>
    </div>
  );
}
