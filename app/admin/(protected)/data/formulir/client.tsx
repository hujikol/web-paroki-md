"use client";

import { useState, useTransition } from "react";
import { Formulir, saveFormulir } from "@/actions/data";
import { Plus, Pencil, Trash2, Search, Loader2, FileText, Link as LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function FormulirClient({ initialData, categories }: { initialData: Formulir[], categories: string[] }) {
    const [data, setData] = useState<Formulir[]>(initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingItem, setEditingItem] = useState<Formulir | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const filteredData = data.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (item: Formulir) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus formulir ini?")) return;

        const newData = data.filter(item => item.id !== id);
        setData(newData);

        startTransition(async () => {
            const result = await saveFormulir(newData);
            if (!result.success) {
                alert("Gagal menyimpan perubahan: " + result.error);
                setData(data); // Revert
            } else {
                router.refresh();
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newItem: Formulir = {
            id: editingItem?.id || uuidv4(),
            title: formData.get("title") as string,
            url: formData.get("url") as string,
            description: formData.get("description") as string,
            category: formData.get("category") as any,
        };

        const newData = editingItem
            ? data.map(item => item.id === newItem.id ? newItem : item)
            : [...data, newItem];

        setData(newData);
        setIsModalOpen(false);
        setEditingItem(null);

        startTransition(async () => {
            const result = await saveFormulir(newData);
            if (!result.success) {
                alert("Gagal menyimpan perubahan: " + result.error);
                setData(data); // Revert
            } else {
                router.refresh();
            }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header Actions */}
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari Formulir..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none text-sm"
                    />
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue transition-colors text-sm font-medium"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Formulir
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Nama Formulir</th>
                            <th className="px-6 py-3">Kategori</th>
                            <th className="px-6 py-3">Keterangan</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 text-brand-blue rounded-lg mt-0.5">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{item.title}</div>
                                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-blue hover:underline flex items-center gap-1 mt-0.5">
                                                    <LinkIcon className="h-3 w-3" />
                                                    {item.url}
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200`}>
                                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={item.description}>
                                        {item.description || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-1 text-gray-400 hover:text-brand-blue transition-colors"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    {searchTerm ? "Tidak ada hasil pencarian" : "Belum ada formulir"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-900">
                                {editingItem ? "Edit Formulir" : "Tambah Formulir"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Formulir</label>
                                <input
                                    name="title"
                                    defaultValue={editingItem?.title}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                    placeholder="Contoh: Formulir Pendaftaran Baptis"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link / URL</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        name="url"
                                        defaultValue={editingItem?.url}
                                        required
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select
                                    name="category"
                                    defaultValue={editingItem?.category || categories[0] || ""}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                                <textarea
                                    name="description"
                                    defaultValue={editingItem?.description}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                    placeholder="Deskripsi singkat formulir..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue transition-colors text-sm font-medium disabled:opacity-70"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
