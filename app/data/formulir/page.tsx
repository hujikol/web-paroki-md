import { Metadata } from "next";
import { FileText, Download, File } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Formulir Gereja | Paroki Brayut",
    description: "Download formulir administrasi gereja Paroki Brayut Santo Yohanes Paulus II",
};

import { getFormulir } from "@/actions/data";
import { getMasterCategories } from "@/actions/master-categories";
import FormulirList from "@/components/data/FormulirList";

export default async function FormulirPage() {
    const rawForms = await getFormulir();
    const categories = await getMasterCategories();


    return (
        <div className="py-12">
            {/* Hero */}
            <section className="bg-gradient-to-r from-brand-blue to-brand-darkBlue text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="h-10 w-10" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Formulir Gereja</h1>
                            <p className="text-blue-100 mt-2">Download formulir administrasi paroki</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Instructions */}
                <div className="bg-blue-50 border-l-4 border-brand-blue rounded-lg p-6">
                    <h2 className="font-bold text-brand-dark mb-2">Petunjuk Penggunaan:</h2>
                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        <li>Pilih dan unduh formulir yang Anda butuhkan</li>
                        <li>Isi formulir dengan lengkap dan jelas</li>
                        <li>Serahkan formulir yang telah diisi ke sekretariat paroki pada jam kerja</li>
                        <li>Untuk informasi lebih lanjut, hubungi sekretariat paroki</li>
                    </ol>
                </div>

                {/* Client Component */}
                <FormulirList initialData={rawForms} categories={categories.formulir} />

                {/* Contact Info */}
                <div className="bg-brand-cream rounded-xl p-8">
                    <h3 className="text-xl font-bold text-brand-dark mb-4">Butuh Bantuan?</h3>
                    <p className="text-gray-700 mb-4">
                        Jika Anda memerlukan bantuan dalam mengisi formulir atau memiliki pertanyaan,
                        silakan hubungi sekretariat paroki.
                    </p>
                </div>
            </div>
        </div>
    );
}
