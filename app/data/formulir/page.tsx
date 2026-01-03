import { Metadata } from "next";
import { FileText, Download, File } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Formulir Gereja | Paroki Brayut",
    description: "Download formulir administrasi gereja Paroki Brayut Santo Yohanes Paulus II",
};

import { getFormulir } from "@/actions/data";

export default async function FormulirPage() {
    const rawForms = await getFormulir();

    const groupedForms = {
        liturgi: rawForms.filter(f => f.category === "liturgi"),
        pelayanan: rawForms.filter(f => f.category === "pelayanan"),
        lainnya: rawForms.filter(f => f.category === "lainnya"),
    };

    const categories = [
        { key: "liturgi", label: "Liturgi & Sakramen", forms: groupedForms.liturgi },
        { key: "pelayanan", label: "Pelayanan Umat", forms: groupedForms.pelayanan },
        { key: "lainnya", label: "Administrasi & Lainnya", forms: groupedForms.lainnya },
    ].filter(c => c.forms.length > 0);

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

                {/* Form Categories */}
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <section key={category.key}>
                            <h2 className="text-2xl font-bold text-brand-dark mb-6">{category.label}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.forms.map((form) => (
                                    <div
                                        key={form.id}
                                        className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:border-brand-blue hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="rounded-lg bg-brand-blue/10 p-3 flex-shrink-0">
                                                <File className="h-6 w-6 text-brand-blue" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-brand-dark mb-1">{form.title}</h3>
                                                <p className="text-sm text-gray-600">{form.description || "Tidak ada keterangan"}</p>
                                            </div>
                                        </div>

                                        <Link
                                            href={form.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-darkBlue transition-colors w-full justify-center"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download Data
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        Belum ada formulir yang tersedia.
                    </div>
                )}

                {/* Contact Info */}
                <div className="bg-brand-cream rounded-xl p-8">
                    <h3 className="text-xl font-bold text-brand-dark mb-4">Butuh Bantuan?</h3>
                    <p className="text-gray-700 mb-4">
                        Jika Anda memerlukan bantuan dalam mengisi formulir atau memiliki pertanyaan,
                        silakan hubungi sekretariat paroki.
                    </p>
                </div>

                {/* Note */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
                    <p className="text-gray-700">
                        <strong className="text-gray-900">Catatan:</strong> Link download formulir akan segera diaktifkan.
                        Sementara ini, silakan datang langsung ke sekretariat paroki untuk mendapatkan formulir.
                    </p>
                </div>
            </div>
        </div>
    );
}
