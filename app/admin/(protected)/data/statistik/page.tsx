import { Metadata } from "next";
import { getStatistik } from "@/actions/data";
import StatistikClient from "./client";

export const metadata: Metadata = {
    title: "Kelola Data Statistik | Admin Paroki",
};

export default async function AdminStatistikPage() {
    const data = await getStatistik();
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Kelola Data Statistik</h1>
            <StatistikClient initialData={data} />
        </div>
    );
}
