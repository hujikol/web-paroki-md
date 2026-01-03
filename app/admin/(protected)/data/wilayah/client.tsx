"use client";

import { useState, useTransition } from "react";
import { Wilayah, Lingkungan, saveWilayahLingkungan } from "@/actions/data";
import { Plus, Pencil, Trash2, Search, Loader2, ChevronDown, ChevronRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function WilayahClient({ initialData }: { initialData: Wilayah[] }) {
    const [data, setData] = useState<Wilayah[]>(initialData);
    const [isWilayahModalOpen, setIsWilayahModalOpen] = useState(false);
    const [isLingkunganModalOpen, setIsLingkunganModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // State for Wilayah Modal
    const [editingWilayah, setEditingWilayah] = useState<Wilayah | null>(null);

    // State for Lingkungan Modal
    const [selectedWilayahId, setSelectedWilayahId] = useState<string | null>(null);
    const [editingLingkungan, setEditingLingkungan] = useState<Lingkungan | null>(null);

    // Expanded Wilayah State
    const [expandedWilayah, setExpandedWilayah] = useState<Set<string>>(new Set());

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.coordinator.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedWilayah);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedWilayah(newExpanded);
    };

    // Wilayah Handlers
    const handleAddWilayah = () => {
        setEditingWilayah(null);
        setIsWilayahModalOpen(true);
    };

    const handleEditWilayah = (item: Wilayah) => {
        setEditingWilayah(item);
        setIsWilayahModalOpen(true);
    };

    const handleDeleteWilayah = async (id: string) => {
        if (!confirm("Hapus Wilayah ini? Semua lingkungan di dalamnya juga akan terhapus.")) return;

        const newData = data.filter(item => item.id !== id);
        setData(newData);
        saveData(newData);
    };

    const handleSubmitWilayah = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newItem: Wilayah = {
            id: editingWilayah?.id || uuidv4(),
            name: formData.get("name") as string,
            coordinator: formData.get("coordinator") as string,
            address: formData.get("address") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            lingkungan: editingWilayah?.lingkungan || []
        };

        const newData = editingWilayah
            ? data.map(item => item.id === newItem.id ? newItem : item)
            : [...data, newItem];

        setData(newData);
        setIsWilayahModalOpen(false);
        saveData(newData);
    };

    // Lingkungan Handlers
    const handleAddLingkungan = (wilayahId: string) => {
        setSelectedWilayahId(wilayahId);
        setEditingLingkungan(null);
        setIsLingkunganModalOpen(true);
    };

    const handleEditLingkungan = (wilayahId: string, item: Lingkungan) => {
        setSelectedWilayahId(wilayahId);
        setEditingLingkungan(item);
        setIsLingkunganModalOpen(true);
    };

    const handleDeleteLingkungan = (wilayahId: string, lingkunganId: string) => {
        if (!confirm("Hapus Lingkungan ini?")) return;

        const newData = data.map(w => {
            if (w.id === wilayahId) {
                return {
                    ...w,
                    lingkungan: w.lingkungan.filter(l => l.id !== lingkunganId)
                };
            }
            return w;
        });

        setData(newData);
        saveData(newData);
    };

    const handleSubmitLingkungan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedWilayahId) return;

        const formData = new FormData(e.currentTarget);

        const newItem: Lingkungan = {
            id: editingLingkungan?.id || uuidv4(),
            name: formData.get("name") as string,
            chief: formData.get("chief") as string,
            address: formData.get("address") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
        };

        const newData = data.map(w => {
            if (w.id === selectedWilayahId) {
                const updatedLingkungan = editingLingkungan
                    ? w.lingkungan.map(l => l.id === newItem.id ? newItem : l)
                    : [...w.lingkungan, newItem];
                return { ...w, lingkungan: updatedLingkungan };
            }
            return w;
        });

        setData(newData);
        setIsLingkunganModalOpen(false);
        saveData(newData);
    };

    const saveData = (newData: Wilayah[]) => {
        startTransition(async () => {
            const result = await saveWilayahLingkungan(newData);
            if (!result.success) {
                alert("Gagal menyimpan: " + result.error);
                router.refresh(); // Reload to reset state
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
                        placeholder="Cari Wilayah / Koordinator..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none text-sm"
                    />
                </div>
                <button
                    onClick={handleAddWilayah}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue transition-colors text-sm font-medium"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Wilayah
                </button>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                    filteredData.map((wilayah) => (
                        <div key={wilayah.id} className="bg-white">
                            {/* Wilayah Row */}
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleExpand(wilayah.id)}>
                                    <button className="text-gray-400 hover:text-brand-blue">
                                        {expandedWilayah.has(wilayah.id) ? (
                                            <ChevronDown className="h-5 w-5" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5" />
                                        )}
                                    </button>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{wilayah.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <User className="h-3 w-3" />
                                            <span>Koord: {wilayah.coordinator}</span>
                                            <span className="mx-1">•</span>
                                            <span>{wilayah.lingkungan.length} Lingkungan</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleAddLingkungan(wilayah.id)}
                                        className="p-1.5 text-brand-blue hover:bg-blue-50 rounded text-sm font-medium flex items-center gap-1"
                                        title="Tambah Lingkungan"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="hidden sm:inline">Lingkungan</span>
                                    </button>
                                    <button
                                        onClick={() => handleEditWilayah(wilayah)}
                                        className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-gray-100 rounded transition-colors"
                                        title="Edit Wilayah"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteWilayah(wilayah.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Hapus Wilayah"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Lingkungan List (Collapsible) */}
                            {expandedWilayah.has(wilayah.id) && (
                                <div className="bg-gray-50 border-t border-gray-100 pl-12 pr-4 py-2">
                                    {wilayah.lingkungan.length > 0 ? (
                                        <div className="divide-y divide-gray-200/50">
                                            {wilayah.lingkungan.map((lingkungan) => (
                                                <div key={lingkungan.id} className="py-3 flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium text-gray-800">{lingkungan.name}</div>
                                                        <div className="text-sm text-gray-500">Ketua: {lingkungan.chief}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEditLingkungan(wilayah.id, lingkungan)}
                                                            className="p-1 text-gray-400 hover:text-brand-blue transition-colors"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteLingkungan(wilayah.id, lingkungan.id)}
                                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center text-sm text-gray-500 italic">
                                            Belum ada data lingkungan
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        {searchTerm ? "Tidak ada hasil pencarian" : "Belum ada data Wilayah"}
                    </div>
                )}
            </div>

            {/* Wilayah Modal */}
            {isWilayahModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-lg text-gray-900">
                                {editingWilayah ? "Edit Wilayah" : "Tambah Wilayah"}
                            </h3>
                            <button
                                onClick={() => setIsWilayahModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitWilayah} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Wilayah</label>
                                <input
                                    name="name"
                                    defaultValue={editingWilayah?.name}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                    placeholder="Contoh: Wilayah I"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ketua Wilayah</label>
                                <input
                                    name="coordinator"
                                    defaultValue={editingWilayah?.coordinator}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                    placeholder="Nama Ketua Wilayah"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat (Opsional)</label>
                                <textarea
                                    name="address"
                                    defaultValue={editingWilayah?.address}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                    placeholder="Alamat lengkap..."
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opsional)</label>
                                    <input
                                        name="email"
                                        type="email"
                                        defaultValue={editingWilayah?.email}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                        placeholder="email@contoh.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. HP (Opsional)</label>
                                    <input
                                        name="phone"
                                        defaultValue={editingWilayah?.phone}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                        placeholder="08..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsWilayahModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue text-sm font-medium"
                                >
                                    {isPending ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lingkungan Modal */}
            {isLingkunganModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-lg text-gray-900">
                                {editingLingkungan ? "Edit Lingkungan" : "Tambah Lingkungan"}
                            </h3>
                            <button
                                onClick={() => setIsLingkunganModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitLingkungan} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lingkungan</label>
                                <input
                                    name="name"
                                    defaultValue={editingLingkungan?.name}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                    placeholder="Contoh: Lingkungan St. Petrus"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ketua Lingkungan</label>
                                <input
                                    name="chief"
                                    defaultValue={editingLingkungan?.chief}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                    placeholder="Nama Ketua Lingkungan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat (Opsional)</label>
                                <textarea
                                    name="address"
                                    defaultValue={editingLingkungan?.address}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                    placeholder="Alamat lengkap..."
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opsional)</label>
                                    <input
                                        name="email"
                                        type="email"
                                        defaultValue={editingLingkungan?.email}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                        placeholder="email@contoh.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. HP (Opsional)</label>
                                    <input
                                        name="phone"
                                        defaultValue={editingLingkungan?.phone}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                                        placeholder="08..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsLingkunganModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue text-sm font-medium"
                                >
                                    {isPending ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
