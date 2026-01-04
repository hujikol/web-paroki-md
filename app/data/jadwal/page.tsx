import { Metadata } from "next";
import { Calendar } from "lucide-react";
import { getScheduleEvents } from "@/lib/data";
import JadwalList from "@/components/data/JadwalList";

export const metadata: Metadata = {
    title: "Jadwal Kegiatan | Paroki Brayut",
    description: "Kalender dan jadwal kegiatan Paroki Brayut Santo Yohanes Paulus II",
};

import { getMasterCategories } from "@/actions/master-categories";

export default async function JadwalKegiatanPage() {
    const activities = await getScheduleEvents();
    const categories = await getMasterCategories();

    return (
        <div className="py-12">
            {/* ... */}
            <section className="bg-gradient-to-r from-brand-blue to-brand-darkBlue text-white py-16">
                {/* ... */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="h-10 w-10" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Jadwal Kegiatan</h1>
                            <p className="text-blue-100 mt-2">Kalender Aktivitas Paroki Brayut</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                {/* Client Component for List & Filters */}
                <JadwalList initialEvents={activities} categories={categories.jadwal} />

                {/* Info Box */}
                <div className="bg-brand-cream rounded-xl border-2 border-brand-blue/20 p-8">
                    <h3 className="text-xl font-bold text-brand-dark mb-4">Informasi Penting</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-brand-blue mt-1">•</span>
                            <span>Jadwal kegiatan dapat berubah sewaktu-waktu. Harap konfirmasi ke sekretariat paroki.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-brand-blue mt-1">•</span>
                            <span>Untuk mendaftarkan atau mengusulkan kegiatan, silakan hubungi koordinator bidang terkait.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-brand-blue mt-1">•</span>
                            <span>Informasi lebih detail akan diumumkan melalui warta paroki atau grup komunitas.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
