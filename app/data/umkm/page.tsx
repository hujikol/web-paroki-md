import { Metadata } from "next";
import { Store } from "lucide-react";
import { getUMKM } from "@/lib/data";
import { getMasterCategories } from "@/actions/master-categories";
import UMKMList from "@/components/data/UMKMList";
// ... imports

export default async function UMKMPage() {
    const umkmList = await getUMKM();
    const categories = await getMasterCategories();

    return (
        <div className="py-12">
            {/* ... Hero ... */}
            <section className="bg-gradient-to-r from-brand-blue to-brand-darkBlue text-white py-16">
                {/* ... */}
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
                {/* Client Component */}
                <UMKMList initialUMKM={umkmList} categories={categories.umkm} />

                {/* Empty State handled in Client Component if initial list empty */}
                {umkmList.length === 0 && (
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
                </div>
            </div>
        </div>
    );
}
