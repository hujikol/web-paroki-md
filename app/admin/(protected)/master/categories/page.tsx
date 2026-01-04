import { getMasterCategories } from "@/actions/master-categories";
import CategoryManager from "@/components/admin/CategoryManager";
import { FolderTree } from "lucide-react";

export default async function MasterCategoriesPage() {
    const initialData = await getMasterCategories();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <FolderTree className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Master Kategori</h1>
                    <p className="text-gray-500 text-sm">Kelola semua kategori untuk konten website.</p>
                </div>
            </div>

            <CategoryManager initialData={initialData} />
        </div>
    );
}
