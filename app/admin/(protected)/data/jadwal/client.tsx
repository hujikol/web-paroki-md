"use client";

import { useState, useTransition } from "react";
import { JadwalEvent, saveJadwalKegiatan } from "@/actions/data";
import { Plus, Pencil, Trash2, Search, Loader2, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function JadwalClient({ initialData }: { initialData: JadwalEvent[] }) {
    const [data, setData] = useState<JadwalEvent[]>(initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingItem, setEditingItem] = useState<JadwalEvent | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Sort by date descending
    const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const filteredData = sortedData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (item: JadwalEvent) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) return;

        const newData = data.filter(item => item.id !== id);
        setData(newData);

        startTransition(async () => {
            const result = await saveJadwalKegiatan(newData);
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

        const newItem: JadwalEvent = {
            id: editingItem?.id || uuidv4(),
            title: formData.get("title") as string,
            date: formData.get("date") as string,
            time: formData.get("time") as string,
            location: formData.get("location") as string,
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
            const result = await saveJadwalKegiatan(newData);
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
                        placeholder="Cari Kegiatan..."
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
                    Tambah Kegiatan
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Tanggal & Waktu</th>
                            <th className="px-6 py-3">Kegiatan</th>
                            <th className="px-6 py-3">Lokasi</th>
                            <th className="px-6 py-3">Kategori</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-brand-dark flex items-center gap-2">
                                            <CalendarIcon className="h-3 w-3 text-gray-400" />
                                            {new Date(item.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="text-gray-500 text-xs mt-1 flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            {item.time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-brand-dark">{item.title}</div>
                                        <div className="text-gray-500 text-xs line-clamp-1">{item.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-gray-400" />
                                            {item.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${item.category === 'liturgi' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                item.category === 'kegiatan' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    item.category === 'rapat' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                        'bg-gray-50 text-gray-700 border-gray-100'
                                            }`}>
                                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                        </span>
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
                                    {searchTerm ? "Tidak ada hasil pencarian" : "Belum ada agenda kegiatan"}
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
                                {editingItem ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kegiatan</label>
                                <input
                                    name="title"
                                    defaultValue={editingItem?.title}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                                    placeholder="Contoh: Rapat Dewan Paroki"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                    <input
                                        type="date"
                                        name="date"
                                        defaultValue={editingItem?.date}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                                    <input
                                        type="time"
                                        name="time"
                                        defaultValue={editingItem?.time}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                                    <input
                                        name="location"
                                        defaultValue={editingItem?.location}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                                        placeholder="Tempat kegiatan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select
                                        name="category"
                                        defaultValue={editingItem?.category || "kegiatan"}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                                    >
                                        <option value="liturgi">Liturgi</option>
                                        <option value="kegiatan">Kegiatan</option>
                                        <option value="rapat">Rapat</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea
                                    name="description"
                                    defaultValue={editingItem?.description}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                                    placeholder="Keterangan tambahan..."
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
