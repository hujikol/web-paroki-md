import { Metadata } from "next";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

export const metadata: Metadata = {
    title: "Jadwal Misa | Paroki Brayut",
    description: "Jadwal misa lengkap untuk semua gereja dan kapel di Paroki Brayut Santo Yohanes Paulus II",
};

interface MassSchedule {
    day: string;
    times: string[];
    notes?: string;
}

const mainChurchSchedule: MassSchedule[] = [
    { day: "Minggu", times: ["06.00", "08.00", "17.00"], notes: "Misa Minggu" },
    { day: "Senin - Sabtu", times: ["06.00"], notes: "Misa Harian" },
];

const specialMasses = [
    { title: "Jumat Pertama", time: "18.30 WIB", location: "Gereja Utama", description: "Misa Jumat Pertama setiap bulan" },
    { title: "Misa Orang Muda Katolik (OMK)", time: "19.00 WIB", location: "Gereja Utama", description: "Misa khusus untuk kaum muda, Minggu ketiga setiap bulan" },
];

const chapelSchedules = [
    {
        name: "Kapel 1",
        location: "Wilayah 1",
        schedule: [
            { day: "Minggu", time: "07.00 WIB" },
            { day: "Rabu", time: "06.00 WIB" },
        ],
    },
    {
        name: "Kapel 2",
        location: "Wilayah 2",
        schedule: [
            { day: "Minggu", time: "08.00 WIB" },
            { day: "Kamis", time: "06.00 WIB" },
        ],
    },
    {
        name: "Kapel 3",
        location: "Wilayah 3",
        schedule: [
            { day: "Minggu", time: "09.00 WIB" },
            { day: "Jumat", time: "06.00 WIB" },
        ],
    },
];

export default function JadwalMisaPage() {
    return (
        <div className="py-12">
            {/* Header */}
            <section className="bg-brand-blue text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="h-10 w-10" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Jadwal Misa</h1>
                            <p className="text-blue-100 mt-2">Paroki Brayut - Santo Yohanes Paulus II</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Main Church Schedule */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
                            <MapPin className="h-6 w-6 text-brand-blue" />
                            Gereja Santo Yusuf Tambakrejo
                        </h2>
                        <p className="text-gray-600 mt-1">Rejodani 1, Sariharjo, Ngaglik</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mainChurchSchedule.map((schedule, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-full bg-brand-blue/10 p-3">
                                        <Clock className="h-6 w-6 text-brand-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-brand-dark mb-2">{schedule.day}</h3>
                                        <div className="space-y-2">
                                            {schedule.times.map((time, idx) => (
                                                <div key={idx} className="text-gray-700 font-medium">
                                                    {time} WIB
                                                </div>
                                            ))}
                                        </div>
                                        {schedule.notes && (
                                            <p className="text-sm text-gray-500 mt-2">{schedule.notes}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Special Masses */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                        <Users className="h-6 w-6 text-brand-blue" />
                        Misa Khusus
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {specialMasses.map((mass, index) => (
                            <div key={index} className="bg-gradient-to-br from-brand-blue to-brand-darkBlue text-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold mb-2">{mass.title}</h3>
                                <div className="space-y-2 text-blue-100">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{mass.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{mass.location}</span>
                                    </div>
                                    <p className="text-sm mt-3">{mass.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Chapel Schedules */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Jadwal Kapel</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {chapelSchedules.map((chapel, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-brand-dark">{chapel.name}</h3>
                                    <p className="text-sm text-gray-600">{chapel.location}</p>
                                </div>

                                <div className="space-y-3">
                                    {chapel.schedule.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-brand-cream rounded-lg">
                                            <span className="font-medium text-gray-700">{item.day}</span>
                                            <span className="text-brand-blue font-semibold">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Note */}
                <div className="bg-blue-50 border-l-4 border-brand-blue rounded-lg p-6">
                    <p className="text-gray-700">
                        <strong className="text-brand-dark">Catatan:</strong> Jadwal misa dapat berubah sewaktu-waktu mengikuti
                        kalender liturgi atau keadaan khusus. Untuk informasi terkini, silakan hubungi sekretariat paroki.
                    </p>
                </div>
            </div>
        </div>
    );
}
