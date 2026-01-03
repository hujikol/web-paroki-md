"use client";

import { useState, useTransition } from "react";
import { PastorTimKerjaData, Pastor, TimKerja, savePastorTimKerja } from "@/actions/data";
import { Plus, Pencil, Trash2, Search, Loader2, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function PastorTimClient({ initialData }: { initialData: PastorTimKerjaData }) {
    const [data, setData] = useState<PastorTimKerjaData>(initialData);
    const [activeTab, setActiveTab] = useState<"pastor" | "tim">("pastor");

    // Modal & Editing States
    const [isPastorModalOpen, setIsPastorModalOpen] = useState(false);
    const [editingPastor, setEditingPastor] = useState<Pastor | null>(null);

    const [isTimModalOpen, setIsTimModalOpen] = useState(false);
    const [editingTim, setEditingTim] = useState<TimKerja | null>(null);

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Data Handlers
    const saveAll = (newData: PastorTimKerjaData) => {
        startTransition(async () => {
            const result = await savePastorTimKerja(newData);
            if (!result.success) {
                alert("Gagal menyimpan: " + result.error);
                router.refresh();
            } else {
                router.refresh();
            }
        });
    };

    // Pastor Logic
    const handleSubmitPastor = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newItem: Pastor = {
            id: editingPastor?.id || uuidv4(),
            name: formData.get("name") as string,
            role: formData.get("role") as string,
            imageUrl: formData.get("imageUrl") as string,
            description: formData.get("description") as string,
            quote: formData.get("quote") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
        };

        const newPastors = editingPastor
            ? data.pastor.map(p => p.id === newItem.id ? newItem : p)
            : [...data.pastor, newItem];

        const newData = { ...data, pastor: newPastors };
        setData(newData);
        setIsPastorModalOpen(false);
        saveAll(newData);
    };

    const handleDeletePastor = (id: string) => {
        if (!confirm("Hapus data Pastor ini?")) return;
        const newPastors = data.pastor.filter(p => p.id !== id);
        const newData = { ...data, pastor: newPastors };
        setData(newData);
        saveAll(newData);
    };

    // Tim Logic
    const handleSubmitTim = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newItem: TimKerja = {
            id: editingTim?.id || uuidv4(),
            name: formData.get("name") as string,
            role: formData.get("role") as string,
            division: formData.get("division") as string,
            quote: formData.get("quote") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
        };

        const newTim = editingTim
            ? data.timKerja.map(t => t.id === newItem.id ? newItem : t)
            : [...data.timKerja, newItem];

        const newData = { ...data, timKerja: newTim };
        setData(newData);
        setIsTimModalOpen(false);
        saveAll(newData);
    };

    const handleDeleteTim = (id: string) => {
        if (!confirm("Hapus anggota tim ini?")) return;
        const newTim = data.timKerja.filter(t => t.id !== id);
        const newData = { ...data, timKerja: newTim };
        setData(newData);
        saveAll(newData);
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("pastor")}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "pastor"
                        ? "border-brand-blue text-brand-blue"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <User className="h-4 w-4" />
                    Pastor Paroki
                </button>
                <button
                    onClick={() => setActiveTab("tim")}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "tim"
                        ? "border-brand-blue text-brand-blue"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <Users className="h-4 w-4" />
                    Tim Kerja
                </button>
            </div>

            {/* Pastor Tab Content */}
            {activeTab === "pastor" && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-800">Daftar Pastor</h2>
                        <button
                            onClick={() => { setEditingPastor(null); setIsPastorModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue transition-colors text-sm font-medium"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Pastor
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Nama</th>
                                    <th className="px-6 py-3">Jabatan</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.pastor.length > 0 ? (
                                    data.pastor.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{p.role}</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <button onClick={() => { setEditingPastor(p); setIsPastorModalOpen(true); }} className="p-1 text-gray-400 hover:text-brand-blue">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDeletePastor(p.id)} className="p-1 text-gray-400 hover:text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={3} className="text-center py-8 text-gray-500">Belum ada data Pastor</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tim Tab Content */}
            {activeTab === "tim" && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-800">Daftar Tim Kerja</h2>
                        <button
                            onClick={() => { setEditingTim(null); setIsTimModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue transition-colors text-sm font-medium"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Anggota
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Nama</th>
                                    <th className="px-6 py-3">Bidang/Divisi</th>
                                    <th className="px-6 py-3">Peran</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.timKerja.length > 0 ? (
                                    data.timKerja.map((t) => (
                                        <tr key={t.id}>
                                            <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{t.division}</td>
                                            <td className="px-6 py-4 text-gray-600">{t.role}</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <button onClick={() => { setEditingTim(t); setIsTimModalOpen(true); }} className="p-1 text-gray-400 hover:text-brand-blue">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDeleteTim(t.id)} className="p-1 text-gray-400 hover:text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">Belum ada data Tim Kerja</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pastor Modal */}
            {isPastorModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-lg text-gray-900">{editingPastor ? "Edit Pastor" : "Tambah Pastor"}</h3>
                            <button onClick={() => setIsPastorModalOpen(false)} className="text-gray-400 hover:text-gray-600"><span className="text-2xl">&times;</span></button>
                        </div>
                        <form onSubmit={handleSubmitPastor} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap & Gelar</label>
                                <input name="name" defaultValue={editingPastor?.name} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                                <input name="role" defaultValue={editingPastor?.role} required placeholder="Contoh: Pastor Paroki" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kutipan / Quote (Opsional)</label>
                                <textarea name="quote" defaultValue={editingPastor?.quote} placeholder="Kutipan inspiratif..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" rows={2} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opsional)</label>
                                    <input name="email" type="email" defaultValue={editingPastor?.email} placeholder="email@contoh.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. HP (Opsional)</label>
                                    <input name="phone" defaultValue={editingPastor?.phone} placeholder="08..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL Foto (Opsional)</label>
                                <input name="imageUrl" defaultValue={editingPastor?.imageUrl} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Biografi Singkat (Opsional)</label>
                                <textarea name="description" defaultValue={editingPastor?.description} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsPastorModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" disabled={isPending} className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue text-sm font-medium">{isPending ? "Menyimpan..." : "Simpan"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tim Modal */}
            {isTimModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-lg text-gray-900">{editingTim ? "Edit Anggota Tim" : "Tambah Anggota Tim"}</h3>
                            <button onClick={() => setIsTimModalOpen(false)} className="text-gray-400 hover:text-gray-600"><span className="text-2xl">&times;</span></button>
                        </div>
                        <form onSubmit={handleSubmitTim} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <input name="name" defaultValue={editingTim?.name} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bidang / Divisi</label>
                                <input name="division" defaultValue={editingTim?.division} required placeholder="Contoh: Sekretariat" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Peran / Tugas</label>
                                <input name="role" defaultValue={editingTim?.role} required placeholder="Contoh: Staf Admin" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kutipan / Quote (Opsional)</label>
                                <textarea name="quote" defaultValue={editingTim?.quote} placeholder="Kutipan inspiratif..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" rows={2} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opsional)</label>
                                    <input name="email" type="email" defaultValue={editingTim?.email} placeholder="email@contoh.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. HP (Opsional)</label>
                                    <input name="phone" defaultValue={editingTim?.phone} placeholder="08..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsTimModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" disabled={isPending} className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue text-sm font-medium">{isPending ? "Menyimpan..." : "Simpan"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
