import { Metadata } from "next";
import { FileText, Download, File } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Formulir Gereja | Paroki Brayut",
    description: "Download formulir administrasi gereja Paroki Brayut Santo Yohanes Paulus II",
};

interface FormCategory {
    category: string;
    forms: {
        title: string;
        description: string;
        downloadUrl: string;
    }[];
}

const formCategories: FormCategory[] = [
    {
        category: "Baptis",
        forms: [
            {
                title: "Formulir Baptis Anak",
                description: "Formulir permohonan baptis untuk anak",
                downloadUrl: "#",
            },
            {
                title: "Formulir Baptis Dewasa",
                description: "Formulir permohonan baptis untuk dewasa",
                downloadUrl: "#",
            },
        ],
    },
    {
        category: "Sakramen",
        forms: [
            {
                title: "Formulir Komuni Pertama",
                description: "Formulir pendaftaran komuni pertama",
                downloadUrl: "#",
            },
            {
                title: "Formulir Krisma/Penguatan",
                description: "Formulir pendaftaran krisma",
                downloadUrl: "#",
            },
            {
                title: "Formulir Pernikahan",
                description: "Formulir permohonan pemberkatan pernikahan",
                downloadUrl: "#",
            },
        ],
    },
    {
        category: "Administrasi",
        forms: [
            {
                title: "Keterangan Kematian",
                description: "Formulir keterangan kematian umat",
                downloadUrl: "#",
            },
            {
                title: "Keterangan Lingkungan Calon Pengantin Setempat",
                description: "Keterangan untuk calon pengantin dari lingkungan",
                downloadUrl: "#",
            },
            {
                title: "Keterangan Pindah Domisili",
                description: "Surat keterangan pindah domisili umat",
                downloadUrl: "#",
            },
        ],
    },
];

export default function FormulirPage() {
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
                {formCategories.map((category, index) => (
                    <section key={index}>
                        <h2 className="text-2xl font-bold text-brand-dark mb-6">{category.category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.forms.map((form, formIndex) => (
                                <div
                                    key={formIndex}
                                    className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:border-brand-blue hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="rounded-lg bg-brand-blue/10 p-3 flex-shrink-0">
                                            <File className="h-6 w-6 text-brand-blue" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-brand-dark mb-1">{form.title}</h3>
                                            <p className="text-sm text-gray-600">{form.description}</p>
                                        </div>
                                    </div>

                                    <Link
                                        href={form.downloadUrl}
                                        className="inline-flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-darkBlue transition-colors w-full justify-center"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download PDF
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

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
