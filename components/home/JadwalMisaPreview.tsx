import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

interface MassSchedule {
    day: string;
    time: string;
    location?: string;
}

const mainChurchSchedule: MassSchedule[] = [
    { day: "Minggu", time: "06.00, 08.00, 17.00 WIB" },
    { day: "Senin - Sabtu", time: "06.00 WIB" },
    { day: "Jumat Pertama", time: "18.30 WIB" },
];

export default function JadwalMisaPreview() {
    return (
        <section className="bg-white py-16 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    {/* Left Side - Schedule */}
                    <div className="flex-1 w-full">
                        <div className="mb-6">
                            <span className="text-brand-blue font-bold tracking-wider uppercase text-sm">
                                Jadwal Liturgi
                            </span>
                            <h2 className="text-3xl font-bold text-brand-dark mt-1">
                                Jadwal Misa
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Gereja Santo Yusuf Tambakrejo
                            </p>
                        </div>

                        <div className="space-y-4">
                            {mainChurchSchedule.map((schedule, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-cream/30 transition-all"
                                >
                                    <div className="rounded-full bg-brand-blue/10 p-2 flex-shrink-0">
                                        <Clock className="h-5 w-5 text-brand-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-brand-dark">
                                            {schedule.day}
                                        </div>
                                        <div className="text-gray-600 text-sm mt-1">
                                            {schedule.time}
                                        </div>
                                        {schedule.location && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                <MapPin className="h-3 w-3" />
                                                {schedule.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - CTAs */}
                    <div className="flex-1 w-full space-y-6">
                        {/* Full Schedule CTA */}
                        <div className="bg-gradient-to-br from-brand-blue to-brand-darkBlue rounded-2xl p-8 text-white shadow-lg">
                            <div className="flex items-start gap-3 mb-4">
                                <Calendar className="h-8 w-8 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Jadwal Lengkap
                                    </h3>
                                    <p className="text-blue-100 text-sm">
                                        Lihat jadwal misa lengkap untuk semua gereja dan kapel di Paroki Brayut
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/jadwal-misa"
                                className="inline-flex items-center gap-2 mt-4 bg-white text-brand-blue px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md"
                            >
                                Lihat Jadwal Lengkap
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Activity Calendar CTA */}
                        <div className="bg-brand-cream rounded-2xl p-8 border-2 border-brand-blue/20 hover:border-brand-blue/40 transition-all">
                            <div className="flex items-start gap-3 mb-4">
                                <Calendar className="h-8 w-8 flex-shrink-0 text-brand-blue" />
                                <div>
                                    <h3 className="text-xl font-bold text-brand-dark mb-2">
                                        Jadwal Kegiatan
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Ikuti berbagai kegiatan dan acara paroki
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/data/jadwal"
                                className="inline-flex items-center gap-2 mt-4 bg-brand-blue text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-darkBlue transition-colors"
                            >
                                Lihat Kegiatan
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
