import { Metadata } from "next";
import { getPastorTimKerja } from "@/actions/data";
import PastorTimClient from "./client";

export const metadata: Metadata = {
    title: "Kelola Pastor & Tim Kerja | Admin Paroki",
};

export default async function AdminPastorTimPage() {
    const data = await getPastorTimKerja();
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Kelola Pastor & Tim Kerja</h1>
            <PastorTimClient initialData={data} />
        </div>
    );
}
