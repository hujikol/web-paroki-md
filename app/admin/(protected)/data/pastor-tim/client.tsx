"use client";

import { useState, useTransition } from "react";
import { PastorTimKerjaData, Pastor, TimKerja, savePastorTimKerja } from "@/actions/data";
import { Plus, Pencil, Trash2, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function PastorTimClient({ initialData }: { initialData: PastorTimKerjaData }) {
    const [data, setData] = useState<PastorTimKerjaData>(initialData);
    const [activeTab, setActiveTab] = useState<"pastor" | "tim">("pastor");

    // Modal & Editing States
    const [isPastorModalOpen, setIsPastorModalOpen] = useState(false);
    const [editingPastor, setEditingPastor] = useState<Pastor | null>(null);

    const [isTimModalOpen, setIsTimModalOpen] = useState(false);
    const [editingTim, setEditingTim] = useState<TimKerja | null>(null);

    // Delete Confirmation
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'pastor' | 'tim', id: string, name: string } | null>(null);

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

    const handleDeletePastor = () => {
        if (!deleteConfirm || deleteConfirm.type !== 'pastor') return;
        const newPastors = data.pastor.filter(p => p.id !== deleteConfirm.id);
        const newData = { ...data, pastor: newPastors };
        setData(newData);
        setDeleteConfirm(null);
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

    const handleDeleteTim = () => {
        if (!deleteConfirm || deleteConfirm.type !== 'tim') return;
        const newTim = data.timKerja.filter(t => t.id !== deleteConfirm.id);
        const newData = { ...data, timKerja: newTim };
        setData(newData);
        setDeleteConfirm(null);
        saveAll(newData);
    };

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab("pastor")}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "pastor"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                >
                    <User className="h-4 w-4" />
                    Pastor Paroki
                </button>
                <button
                    onClick={() => setActiveTab("tim")}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "tim"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                >
                    <Users className="h-4 w-4" />
                    Tim Kerja
                </button>
            </div>

            {/* Pastor Tab Content */}
            {activeTab === "pastor" && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-800">Daftar Pastor</h2>
                        <Button
                            onClick={() => { setEditingPastor(null); setIsPastorModalOpen(true); }}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Pastor
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">Jabatan</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {data.pastor.length > 0 ? (
                                    data.pastor.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                                            <td className="px-4 py-3 text-slate-600">{p.role}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => { setEditingPastor(p); setIsPastorModalOpen(true); }}
                                                        className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeleteConfirm({ type: 'pastor', id: p.id, name: p.name })}
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={3} className="text-center py-8 text-slate-500">Belum ada data Pastor</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tim Tab Content */}
            {activeTab === "tim" && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-800">Daftar Tim Kerja</h2>
                        <Button
                            onClick={() => { setEditingTim(null); setIsTimModalOpen(true); }}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Anggota
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">Bidang/Divisi</th>
                                    <th className="px-4 py-3">Peran</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {data.timKerja.length > 0 ? (
                                    data.timKerja.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-900">{t.name}</td>
                                            <td className="px-4 py-3 text-slate-600">{t.division}</td>
                                            <td className="px-4 py-3 text-slate-600">{t.role}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => { setEditingTim(t); setIsTimModalOpen(true); }}
                                                        className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeleteConfirm({ type: 'tim', id: t.id, name: t.name })}
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="text-center py-8 text-slate-500">Belum ada data Tim Kerja</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pastor Modal */}
            <Dialog open={isPastorModalOpen} onOpenChange={setIsPastorModalOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingPastor ? "Edit Pastor" : "Tambah Pastor"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitPastor} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                            <Input name="name" defaultValue={editingPastor?.name} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jabatan</label>
                            <Input name="role" defaultValue={editingPastor?.role} required placeholder="Contoh: Pastor Paroki" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kutipan / Quote (Opsional)</label>
                            <textarea name="quote" defaultValue={editingPastor?.quote} placeholder="Kutipan inspiratif..." className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" rows={2} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email (Opsional)</label>
                                <Input name="email" type="email" defaultValue={editingPastor?.email} placeholder="email@contoh.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">No. HP (Opsional)</label>
                                <Input name="phone" defaultValue={editingPastor?.phone} placeholder="08..." />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">URL Foto (Opsional)</label>
                            <Input name="imageUrl" defaultValue={editingPastor?.imageUrl} placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Biografi Singkat (Opsional)</label>
                            <textarea name="description" defaultValue={editingPastor?.description} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsPastorModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">{isPending ? "Menyimpan..." : "Simpan"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Tim Modal */}
            <Dialog open={isTimModalOpen} onOpenChange={setIsTimModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingTim ? "Edit Anggota Tim" : "Tambah Anggota Tim"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitTim} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                            <Input name="name" defaultValue={editingTim?.name} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bidang / Divisi</label>
                            <Input name="division" defaultValue={editingTim?.division} required placeholder="Contoh: Sekretariat" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Peran / Tugas</label>
                            <Input name="role" defaultValue={editingTim?.role} required placeholder="Contoh: Staf Admin" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kutipan / Quote (Opsional)</label>
                            <textarea name="quote" defaultValue={editingTim?.quote} placeholder="Kutipan inspiratif..." className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" rows={2} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email (Opsional)</label>
                                <Input name="email" type="email" defaultValue={editingTim?.email} placeholder="email@contoh.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">No. HP (Opsional)</label>
                                <Input name="phone" defaultValue={editingTim?.phone} placeholder="08..." />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsTimModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">{isPending ? "Menyimpan..." : "Simpan"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={deleteConfirm?.type === 'pastor' ? handleDeletePastor : handleDeleteTim}
                title={`Hapus ${deleteConfirm?.type === 'pastor' ? 'Pastor' : 'Anggota Tim'}`}
                message={`Hapus "${deleteConfirm?.name}"? Data ini tidak dapat dikembalikan.`}
                loading={isPending}
                confirmText="Hapus"
                confirmVariant="destructive"
            />
        </div>
    );
}
