import { Metadata } from "next";
import { getUMKM } from "@/actions/data";
import UMKMClient from "./client";

export const metadata: Metadata = {
    title: "Kelola Data UMKM | Admin Paroki",
};

export default async function AdminUMKMPage() {
    const data = await getUMKM();
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Kelola Data UMKM</h1>
            <UMKMClient initialData={data} />
        </div>
    );
}
