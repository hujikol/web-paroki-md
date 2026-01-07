"use client";

import { useState, useTransition } from "react";
import { Wilayah, Lingkungan, saveWilayahLingkungan } from "@/actions/data";
import { Plus, Pencil, Trash2, Search, ChevronDown, ChevronRight, User } from "lucide-react";
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

    // Confirmation Modal States
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'wilayah' | 'lingkungan', id: string, name: string, parentId?: string } | null>(null);

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

    const handleDeleteWilayah = async () => {
        if (!deleteConfirm || deleteConfirm.type !== 'wilayah') return;

        const newData = data.filter(item => item.id !== deleteConfirm.id);
        setData(newData);
        setDeleteConfirm(null);
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

    const handleDeleteLingkungan = () => {
        if (!deleteConfirm || deleteConfirm.type !== 'lingkungan' || !deleteConfirm.parentId) return;

        const newData = data.map(w => {
            if (w.id === deleteConfirm.parentId) {
                return {
                    ...w,
                    lingkungan: w.lingkungan.filter(l => l.id !== deleteConfirm.id)
                };
            }
            return w;
        });

        setData(newData);
        setDeleteConfirm(null);
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
                router.refresh();
            } else {
                router.refresh();
            }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            {/* Header Actions */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Cari Wilayah / Koordinator..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={handleAddWilayah} className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Wilayah
                </Button>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-200">
                {filteredData.length > 0 ? (
                    filteredData.map((wilayah) => (
                        <div key={wilayah.id} className="bg-white">
                            {/* Wilayah Row */}
                            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleExpand(wilayah.id)}>
                                    <button className="text-slate-400 hover:text-blue-600">
                                        {expandedWilayah.has(wilayah.id) ? (
                                            <ChevronDown className="h-5 w-5" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5" />
                                        )}
                                    </button>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{wilayah.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-slate-500">
                                            <User className="h-3 w-3" />
                                            <span>Koord: {wilayah.coordinator}</span>
                                            <span className="mx-1">•</span>
                                            <span>{wilayah.lingkungan.length} Lingkungan</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleAddLingkungan(wilayah.id)}
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="hidden sm:inline">Lingkungan</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEditWilayah(wilayah)}
                                        className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setDeleteConfirm({ type: 'wilayah', id: wilayah.id, name: wilayah.name })}
                                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Lingkungan List (Collapsible) */}
                            {expandedWilayah.has(wilayah.id) && (
                                <div className="bg-slate-50 border-t border-slate-100 pl-12 pr-4 py-2">
                                    {wilayah.lingkungan.length > 0 ? (
                                        <div className="divide-y divide-slate-200/50">
                                            {wilayah.lingkungan.map((lingkungan) => (
                                                <div key={lingkungan.id} className="py-3 flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium text-slate-800">{lingkungan.name}</div>
                                                        <div className="text-sm text-slate-500">Ketua: {lingkungan.chief}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEditLingkungan(wilayah.id, lingkungan)}
                                                            className="h-8 w-8 text-slate-400 hover:text-blue-600"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteConfirm({ type: 'lingkungan', id: lingkungan.id, name: lingkungan.name, parentId: wilayah.id })}
                                                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center text-sm text-slate-500 italic">
                                            Belum ada data lingkungan
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        {searchTerm ? "Tidak ada hasil pencarian" : "Belum ada data Wilayah"}
                    </div>
                )}
            </div>

            {/* Wilayah Modal */}
            <Dialog open={isWilayahModalOpen} onOpenChange={setIsWilayahModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingWilayah ? "Edit Wilayah" : "Tambah Wilayah"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitWilayah} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Wilayah</label>
                            <Input name="name" defaultValue={editingWilayah?.name} required placeholder="Contoh: Wilayah I" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Ketua Wilayah</label>
                            <Input name="coordinator" defaultValue={editingWilayah?.coordinator} placeholder="Nama Ketua Wilayah" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat (Opsional)</label>
                            <textarea
                                name="address"
                                defaultValue={editingWilayah?.address}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                                placeholder="Alamat lengkap..."
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email (Opsional)</label>
                                <Input name="email" type="email" defaultValue={editingWilayah?.email} placeholder="email@contoh.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">No. HP (Opsional)</label>
                                <Input name="phone" defaultValue={editingWilayah?.phone} placeholder="08..." />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsWilayahModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                                {isPending ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Lingkungan Modal */}
            <Dialog open={isLingkunganModalOpen} onOpenChange={setIsLingkunganModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingLingkungan ? "Edit Lingkungan" : "Tambah Lingkungan"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitLingkungan} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lingkungan</label>
                            <Input name="name" defaultValue={editingLingkungan?.name} required placeholder="Contoh: Lingkungan St. Petrus" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Ketua Lingkungan</label>
                            <Input name="chief" defaultValue={editingLingkungan?.chief} placeholder="Nama Ketua Lingkungan" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat (Opsional)</label>
                            <textarea
                                name="address"
                                defaultValue={editingLingkungan?.address}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                                placeholder="Alamat lengkap..."
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email (Opsional)</label>
                                <Input name="email" type="email" defaultValue={editingLingkungan?.email} placeholder="email@contoh.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">No. HP (Opsional)</label>
                                <Input name="phone" defaultValue={editingLingkungan?.phone} placeholder="08..." />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsLingkunganModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                                {isPending ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={deleteConfirm?.type === 'wilayah' ? handleDeleteWilayah : handleDeleteLingkungan}
                title={`Hapus ${deleteConfirm?.type === 'wilayah' ? 'Wilayah' : 'Lingkungan'}`}
                message={deleteConfirm?.type === 'wilayah'
                    ? `Hapus "${deleteConfirm?.name}"? Semua lingkungan di dalamnya juga akan terhapus.`
                    : `Hapus "${deleteConfirm?.name}"? Data ini tidak dapat dikembalikan.`
                }
                loading={isPending}
                confirmText="Hapus"
                confirmVariant="destructive"
            />
        </div>
    );
}
