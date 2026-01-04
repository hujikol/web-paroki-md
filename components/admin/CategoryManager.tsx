"use client";

import { useState, useTransition } from "react";
import { CategoryType, MasterCategoriesData, addCategory, deleteCategory, updateCategory } from "@/actions/master-categories";
import { Plus, Trash2, Pencil, Loader2, Save, X } from "lucide-react";

interface CategoryManagerProps {
    initialData: MasterCategoriesData;
}

const SECTION_TITLES: Record<CategoryType, string> = {
    post: "Artikel & Berita",
    umkm: "UMKM",
    jadwal: "Jadwal Kegiatan",
    formulir: "Formulir Gereja"
};

export default function CategoryManager({ initialData }: CategoryManagerProps) {
    const [data, setData] = useState<MasterCategoriesData>(initialData);
    const [isPending, startTransition] = useTransition();
    const [editingState, setEditingState] = useState<{ type: CategoryType; oldVal: string; newVal: string } | null>(null);
    const [newCategoryState, setNewCategoryState] = useState<{ type: CategoryType; val: string } | null>(null);

    const handleAdd = (type: CategoryType) => {
        if (!newCategoryState || !newCategoryState.val.trim()) return;

        const newVal = newCategoryState.val.trim();

        startTransition(async () => {
            const result = await addCategory(type, newVal);
            if (result.success) {
                setData(prev => ({
                    ...prev,
                    [type]: [...prev[type], newVal].sort()
                }));
                setNewCategoryState(null);
            } else {
                alert(result.error);
            }
        });
    };

    const handleDelete = (type: CategoryType, val: string) => {
        if (!confirm(`Are you sure you want to delete "${val}"?`)) return;

        startTransition(async () => {
            const result = await deleteCategory(type, val);
            if (result.success) {
                setData(prev => ({
                    ...prev,
                    [type]: prev[type].filter(item => item !== val)
                }));
            } else {
                alert(result.error);
            }
        });
    };

    const handleUpdate = () => {
        if (!editingState || !editingState.newVal.trim()) return;

        const { type, oldVal, newVal } = editingState;

        startTransition(async () => {
            const result = await updateCategory(type, oldVal, newVal);
            if (result.success) {
                setData(prev => ({
                    ...prev,
                    [type]: prev[type].map(item => item === oldVal ? newVal : item).sort()
                }));
                setEditingState(null);
            } else {
                alert(result.error);
            }
        });
    };

    const renderSection = (type: CategoryType) => (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" key={type}>
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">{SECTION_TITLES[type]}</h3>
                <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500 font-medium">
                    {data[type].length}
                </span>
            </div>

            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                {data[type].map(item => (
                    <div key={item} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 group transition-colors border border-transparent hover:border-gray-100">
                        {editingState?.type === type && editingState.oldVal === item ? (
                            <div className="flex items-center gap-2 w-full">
                                <input
                                    value={editingState.newVal}
                                    onChange={(e) => setEditingState({ ...editingState, newVal: e.target.value })}
                                    className="flex-1 px-2 py-1 text-sm border border-brand-blue rounded outline-none"
                                    autoFocus
                                />
                                <button onClick={handleUpdate} disabled={isPending} className="text-brand-blue hover:bg-blue-50 p-1 rounded">
                                    <Save className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEditingState(null)} disabled={isPending} className="text-gray-400 hover:text-gray-600 p-1 rounded">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="text-sm font-medium text-gray-700">{item}</span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setEditingState({ type, oldVal: item, newVal: item })}
                                        className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded transition-colors"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(type, item)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                {newCategoryState?.type === type ? (
                    <div className="flex gap-2">
                        <input
                            value={newCategoryState.val}
                            onChange={(e) => setNewCategoryState({ ...newCategoryState, val: e.target.value })}
                            placeholder="New category..."
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd(type)}
                        />
                        <button
                            onClick={() => handleAdd(type)}
                            disabled={isPending || !newCategoryState.val.trim()}
                            className="px-3 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue shadow-sm shadow-brand-blue/20 disabled:opacity-50 disabled:shadow-none"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => setNewCategoryState(null)}
                            className="px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setNewCategoryState({ type, val: "" })}
                        className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 border border-dashed border-gray-300 rounded-lg hover:border-brand-blue hover:text-brand-blue hover:bg-brand-blue/5 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {renderSection("post")}
            {renderSection("umkm")}
            {renderSection("jadwal")}
            {renderSection("formulir")}
        </div>
    );
}
