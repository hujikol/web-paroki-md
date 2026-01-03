"use client";

import { useState, useTransition } from "react";
import { UMKMData, saveUMKM } from "@/actions/data";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function UMKMClient({ initialData }: { initialData: UMKMData[] }) {
    const [data, setData] = useState<UMKMData[]>(initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingItem, setEditingItem] = useState<UMKMData | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const filteredData = data.filter(item =>
        item.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (item: UMKMData) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

        const newData = data.filter(item => item.id !== id);
        setData(newData);

        startTransition(async () => {
            const result = await saveUMKM(newData);
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

        const newItem: UMKMData = {
            id: editingItem?.id || uuidv4(),
            businessName: formData.get("businessName") as string,
            owner: formData.get("owner") as string,
            address: formData.get("address") as string,
            phone: formData.get("phone") as string,
            type: formData.get("type") as string,
            description: formData.get("description") as string,
        };

        const newData = editingItem
            ? data.map(item => item.id === newItem.id ? newItem : item)
            : [...data, newItem];

        setData(newData);
        setIsModalOpen(false);
        setEditingItem(null);

        startTransition(async () => {
            const result = await saveUMKM(newData);
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
                        placeholder="Cari UMKM..."
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
                    Tambah UMKM
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Nama Usaha / Pemilik</th>
                            <th className="px-6 py-3">Jenis Usaha</th>
                            <th className="px-6 py-3">Kontak</th>
                            <th className="px-6 py-3">Alamat</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-brand-dark">{item.businessName}</div>
                                        <div className="text-gray-500 text-xs">{item.owner}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-50 text-brand-blue rounded text-xs font-medium border border-blue-100">
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{item.phone}</td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={item.address}>
                                        {item.address}
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
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    {searchTerm ? "Tidak ada hasil pencarian" : "Belum ada data UMKM"}
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
                                {editingItem ? "Edit Data UMKM" : "Tambah UMKM Baru"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Usaha</label>
                                    <input
                                        name="businessName"
                                        defaultValue={editingItem?.businessName}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                                        placeholder="Contoh: Warung Berkah"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik</label>
                                    <input
                                        name="owner"
                                        defaultValue={editingItem?.owner}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                                        placeholder="Nama Lengkap"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Usaha</label>
                                    <select
                                        name="type"
                                        defaultValue={editingItem?.type || "Kuliner"}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                                    >
                                        <option value="Kuliner">Kuliner</option>
                                        <option value="Jasa">Jasa</option>
                                        <option value="Perdagangan">Perdagangan</option>
                                        <option value="Kerajinan">Kerajinan</option>
                                        <option value="Agribisnis">Agribisnis</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Telp / HP</label>
                                    <input
                                        name="phone"
                                        defaultValue={editingItem?.phone}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                                        placeholder="08..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                                <textarea
                                    name="address"
                                    defaultValue={editingItem?.address}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                                    placeholder="Alamat lengkap usaha"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Tambahan</label>
                                <textarea
                                    name="description"
                                    defaultValue={editingItem?.description}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                                    placeholder="Deskripsi singkat produk/jasa..."
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
