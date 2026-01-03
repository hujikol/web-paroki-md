import { Metadata } from "next";
import { getWilayahLingkungan } from "@/actions/data";
import { getChurchStatistics as getStats } from "@/lib/data";
import WilayahClient from "./client";

export const metadata: Metadata = {
    title: "Kelola Wilayah & Lingkungan | Admin Paroki",
};

export default async function AdminWilayahPage() {
    const data = await getWilayahLingkungan();
    const stats = await getStats();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Kelola Wilayah & Lingkungan</h1>

            {/* Stats Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="text-sm text-blue-600 font-medium">Target Wilayah (Statistik)</div>
                    <div className="text-2xl font-bold text-blue-900">{stats?.churches || 0}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="text-sm text-green-600 font-medium">Target Lingkungan (Statistik)</div>
                    <div className="text-2xl font-bold text-green-900">{stats?.wards || 0}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 font-medium">Realita Data</div>
                    <div className="text-sm mt-1">
                        <strong>{data.length}</strong> Wilayah, <strong>{data.reduce((acc, w) => acc + w.lingkungan.length, 0)}</strong> Lingkungan
                    </div>
                </div>
            </div>

            <WilayahClient initialData={data} />
        </div>
    );
}
