import { Metadata } from "next";
import { getFormulir } from "@/actions/data";
import FormulirClient from "./client";

export const metadata: Metadata = {
    title: "Kelola Formulir | Admin Paroki",
};

export default async function AdminFormulirPage() {
    const data = await getFormulir();
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Kelola Formulir Gereja</h1>
            <FormulirClient initialData={data} />
        </div>
    );
}
