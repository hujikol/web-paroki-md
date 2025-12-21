import ImageUploader from "@/components/admin/ImageUploader";
import { listImages } from "@/actions/media";

export default async function MediaPage() {
  const images = await listImages();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Media Library
      </h1>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Upload New Image
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                Banner Image
              </h3>
              <ImageUploader type="banner" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                Inline Image
              </h3>
              <ImageUploader type="inline" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Banner Images
          </h2>
          {images.banners.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No banner images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.banners.map((path) => (
                <div key={path} className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                  <img src={path} alt={path} className="w-full h-32 object-cover rounded mb-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{path}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Inline Images
          </h2>
          {images.inline.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No inline images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.inline.map((path) => (
                <div key={path} className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                  <img src={path} alt={path} className="w-full h-32 object-cover rounded mb-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{path}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
