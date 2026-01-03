import { Metadata } from "next";
import { Store, Phone, MapPin, Info } from "lucide-react";

export const metadata: Metadata = {
    title: "Data UMKM | Paroki Brayut",
    description: "Direktori UMKM umat Paroki Brayut Santo Yohanes Paulus II",
};

interface UMKMData {
    pemilik: string;
    namaUsaha: string;
    alamat: string;
    telp: string;
    jenisUsaha: string;
    keterangan?: string;
}

// Placeholder data - akan diganti dengan data dari JSON
const umkmData: UMKMData[] = [
    {
        pemilik: "[Nama Pemilik]",
        namaUsaha: "[Nama Usaha]",
        alamat: "[Alamat Lengkap]",
        telp: "[No. Telp/HP]",
        jenisUsaha: "Kuliner",
        keterangan: "[Keterangan tambahan]",
    },
    // More entries will be loaded from JSON
];

const jenisUsahaCategories = [
    "Kuliner",
    "Fashion",
    "Jasa",
    "Kerajinan",
    "Pertanian",
    "Lainnya",
];

export default function UMKMPage() {
    return (
        <div className="py-12">
            {/* Hero */}
            <section className="bg-gradient-to-r from-brand-blue to-brand-darkBlue text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Store className="h-10 w-10" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Data UMKM</h1>
                            <p className="text-blue-100 mt-2">Direktori Usaha Mikro, Kecil, dan Menengah Umat Paroki</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                {/* Filter Categories */}
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-brand-blue text-white rounded-full font-medium hover:bg-brand-darkBlue transition-colors">
                        Semua
                    </button>
                    {jenisUsahaCategories.map((category, index) => (
                        <button
                            key={index}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-brand-cream hover:text-brand-blue transition-colors"
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* UMKM List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {umkmData.map((umkm, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:border-brand-blue hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div className="rounded-lg bg-brand-blue/10 p-3 flex-shrink-0">
                                    <Store className="h-6 w-6 text-brand-blue" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-brand-dark text-lg mb-1">{umkm.namaUsaha}</h3>
                                    <span className="inline-block px-2 py-1 bg-brand-cream text-brand-blue text-xs rounded-full font-medium">
                                        {umkm.jenisUsaha}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2 text-gray-700">
                                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                                    <div>
                                        <div className="font-medium">Pemilik:</div>
                                        <div>{umkm.pemilik}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 text-gray-700">
                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                                    <div>{umkm.alamat}</div>
                                </div>

                                <div className="flex items-start gap-2 text-gray-700">
                                    <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                                    <a href={`tel:${umkm.telp}`} className="hover:text-brand-blue">
                                        {umkm.telp}
                                    </a>
                                </div>

                                {umkm.keterangan && (
                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="text-gray-600 italic">{umkm.keterangan}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {umkmData.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Data UMKM sedang dalam proses pengumpulan.</p>
                    </div>
                )}

                {/* Registration Info */}
                <div className="bg-brand-cream rounded-xl p-8">
                    <h3 className="text-xl font-bold text-brand-dark mb-4">Daftarkan Usaha Anda</h3>
                    <p className="text-gray-700 mb-4">
                        Apakah Anda memiliki usaha dan ingin didaftarkan di direktori UMKM Paroki?
                        Silakan hubungi sekretariat paroki untuk mendaftarkan usaha Anda.
                    </p>
                    <div className="text-sm text-gray-700">
                        <div>Telp: (0274) 860-9221</div>
                        <div>Email: sekpar.brayut@kas.id</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
