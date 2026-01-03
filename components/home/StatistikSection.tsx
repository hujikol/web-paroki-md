import { ChurchStatistics } from "@/types/data";
import { Users, Home, MapPin, Heart } from "lucide-react";

interface StatistikSectionProps {
    stats: ChurchStatistics | null;
}

export default function StatistikSection({ stats }: StatistikSectionProps) {
    if (!stats) return null;

    const statItems = [
        {
            label: "Umat",
            value: stats.parishioners.toLocaleString('id-ID'),
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            label: "Kepala Keluarga",
            value: stats.families.toLocaleString('id-ID'),
            icon: Heart,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            label: "Lingkungan",
            value: stats.wards.toLocaleString('id-ID'),
            icon: MapPin,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
        {
            label: "Gereja Wilayah",
            value: stats.churches.toLocaleString('id-ID'),
            icon: Home,
            color: "text-red-600",
            bg: "bg-red-100",
        },
    ];

    return (
        <section className="bg-white py-12 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <span className="text-brand-blue font-bold tracking-wider uppercase text-sm">
                        Statistik Kami
                    </span>
                    <h2 className="text-3xl font-bold text-brand-dark mt-1">
                        Data Paroki Sesuai Data BIDUK
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Terakhir diperbarui: {new Date(stats.lastUpdated).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {statItems.map((item, index) => (
                        <div
                            key={index}
                            className="group p-6 rounded-2xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-brand-blue/20 hover:shadow-lg transition-all duration-300 text-center"
                        >
                            <div className={`mx-auto w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <item.icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {item.value}
                            </div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
