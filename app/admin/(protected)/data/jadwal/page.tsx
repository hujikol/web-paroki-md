import { Metadata } from "next";
import { getJadwalKegiatan } from "@/actions/data";
import JadwalClient from "./client";

export const metadata: Metadata = {
    title: "Kelola Jadwal Kegiatan | Admin Paroki",
};

export default async function AdminJadwalPage() {
    const data = await getJadwalKegiatan();
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Kelola Jadwal Kegiatan</h1>
            <JadwalClient initialData={data} />
        </div>
    );
}
