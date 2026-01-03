import { Metadata } from "next";
import { Calendar, Clock, MapPin, Plus, Filter } from "lucide-react";

export const metadata: Metadata = {
    title: "Jadwal Kegiatan | Paroki Brayut",
    description: "Kalender dan jadwal kegiatan Paroki Brayut Santo Yohanes Paulus II",
};

// Placeholder data - will be loaded from JSON
interface Activity {
    id: number;
    date: string;
    title: string;
    description: string;
    location: string;
    category: "liturgi" | "pastoral" | "sosial" | "lainnya";
}

const activities: Activity[] = [
    {
        id: 1,
        date: "2026-01-15",
        title: "[Nama Kegiatan]",
        description: "[Deskripsi kegiatan]",
        location: "Gereja Santo Yusuf Tambakrejo",
        category: "liturgi",
    },
    // More activities will be loaded from JSON
];

const categories = [
    { name: "Semua", value: "all" },
    { name: "Liturgi", value: "liturgi" },
    { name: "Pastoral", value: "pastoral" },
    { name: "Sosial", value: "sosial" },
    { name: "Lainnya", value: "lainnya" },
];

const categoryColors = {
    liturgi: "bg-blue-100 text-blue-700 border-blue-200",
    pastoral: "bg-green-100 text-green-700 border-green-200",
    sosial: "bg-purple-100 text-purple-700 border-purple-200",
    lainnya: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function JadwalKegiatanPage() {
    return (
        <div className="py-12">
            {/* Hero */}
            <section className="bg-gradient-to-r from-brand-blue to-brand-darkBlue text-white py-16">
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
                {/* Filter & Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${category.value === "all"
                                        ? "bg-brand-blue text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-brand-cream hover:text-brand-blue"
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <button className="flex items-center gap-2 bg-brand-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-brand-darkBlue transition-colors">
                        <Filter className="h-4 w-4" />
                        Filter Bulan
                    </button>
                </div>

                {/* Calendar View Placeholder */}
                <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                    <h2 className="text-xl font-bold text-brand-dark mb-6">Kalender Interaktif</h2>
                    <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="text-center text-gray-400">
                            <Calendar className="h-16 w-16 mx-auto mb-4" />
                            <p className="text-lg font-medium">Kalender Interaktif</p>
                            <p className="text-sm mt-2">Akan ditampilkan dengan library kalender</p>
                        </div>
                    </div>
                </section>

                {/* Activity List */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Kegiatan Mendatang</h2>

                    <div className="space-y-4">
                        {activities.length > 0 ? (
                            activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:border-brand-blue hover:shadow-lg transition-all"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Date Box */}
                                        <div className="flex-shrink-0">
                                            <div className="bg-brand-blue text-white rounded-lg p-4 text-center w-20">
                                                <div className="text-2xl font-bold">
                                                    {new Date(activity.date).getDate()}
                                                </div>
                                                <div className="text-sm">
                                                    {new Date(activity.date).toLocaleDateString('id-ID', { month: 'short' })}
                                                </div>
                                                <div className="text-xs">
                                                    {new Date(activity.date).getFullYear()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <h3 className="text-xl font-bold text-brand-dark">{activity.title}</h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[activity.category]
                                                        }`}
                                                >
                                                    {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                                                </span>
                                            </div>

                                            <p className="text-gray-700 mb-4">{activity.description}</p>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-brand-blue" />
                                                    <span>{new Date(activity.date).toLocaleDateString('id-ID', { weekday: 'long' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-brand-blue" />
                                                    <span>{activity.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Belum ada kegiatan terjadwal.</p>
                                <p className="text-sm text-gray-400 mt-2">Data kegiatan akan diperbarui secara berkala.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Past Events */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Kegiatan yang Telah Berlalu</h2>
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
                        <p className="text-gray-600">
                            Riwayat kegiatan akan ditampilkan di sini
                        </p>
                    </div>
                </section>

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
