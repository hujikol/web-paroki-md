"use client";

import { useState, useTransition } from "react";
import { StatistikData, saveStatistik } from "@/actions/data";
import { Save, Loader2, Users, Home, MapPin, Church } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StatistikClient({ initialData }: { initialData: StatistikData | null }) {
    const [data, setData] = useState<StatistikData>(initialData || {
        churches: 0,
        wards: 0,
        families: 0,
        parishioners: 0
    });

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await saveStatistik(data);
            if (result.success) {
                router.refresh();
                // Optional: Show toast notification
            } else {
                alert("Gagal menyimpan: " + result.error);
            }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Church className="h-4 w-4 text-brand-blue" />
                            Jumlah Gereja
                        </label>
                        <input
                            type="number"
                            value={data.churches}
                            onChange={(e) => setData({ ...data, churches: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-2xl font-bold text-gray-900"
                        />
                        <p className="text-xs text-gray-500">Total gereja dan kapel</p>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <MapPin className="h-4 w-4 text-brand-blue" />
                            Jumlah Lingkungan
                        </label>
                        <input
                            type="number"
                            value={data.wards}
                            onChange={(e) => setData({ ...data, wards: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-2xl font-bold text-gray-900"
                        />
                        <p className="text-xs text-gray-500">Total lingkungan di paroki</p>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Home className="h-4 w-4 text-brand-blue" />
                            Jumlah Kepala Keluarga
                        </label>
                        <input
                            type="number"
                            value={data.families}
                            onChange={(e) => setData({ ...data, families: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-2xl font-bold text-gray-900"
                        />
                        <p className="text-xs text-gray-500">Total KK terdaftar</p>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Users className="h-4 w-4 text-brand-blue" />
                            Jumlah Umat
                        </label>
                        <input
                            type="number"
                            value={data.parishioners}
                            onChange={(e) => setData({ ...data, parishioners: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-2xl font-bold text-gray-900"
                        />
                        <p className="text-xs text-gray-500">Total jiwa</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Terakhir diperbarui: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString("id-ID", {
                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        }) : '-'}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue transition-colors font-medium shadow-sm disabled:opacity-70"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Simpan Perubahan
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
