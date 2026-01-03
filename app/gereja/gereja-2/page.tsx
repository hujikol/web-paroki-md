import { Metadata } from "next";
import Image from "next/image";
import { MapPin, Clock, Phone, Mail, Calendar } from "lucide-react";

export const metadata: Metadata = {
    title: "Gereja [Nama Gereja 2] | Paroki Brayut",
    description: "Gereja [Nama Gereja 2] - Paroki Brayut Santo Yohanes Paulus II",
};

export default function Gereja2Page() {
    return (
        <div className="py-12">
            {/* Hero Section */}
            <section className="relative h-[400px] bg-brand-dark">
                <Image
                    src="https://images.unsplash.com/photo-1503982046-1ac59829895f?q=80&w=2070&auto=format&fit=crop"
                    alt="Gereja 2"
                    fill
                    className="object-cover opacity-40"
                />
                <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
                    <div className="max-w-4xl px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            [Nama Gereja 2]
                        </h1>
                        <p className="text-xl md:text-2xl font-light">
                            Wilayah [Nama Wilayah]
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Overview */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-bold text-brand-dark mb-6">Tentang Gereja</h2>
                        <div className="prose prose-lg text-gray-700">
                            <p>
                                [Deskripsi singkat tentang gereja, sejarah, dan peran dalam paroki]
                            </p>
                            <p>
                                [Tambahkan informasi penting lainnya di sini]
                            </p>
                        </div>
                    </div>

                    {/* Location Card */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                        <h3 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                            <MapPin className="h-6 w-6 text-brand-blue" />
                            Lokasi
                        </h3>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <div className="font-semibold text-brand-dark mb-1">Alamat</div>
                                <p>
                                    [Alamat Lengkap Gereja]<br />
                                    Kabupaten Sleman, DIY 55581
                                </p>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="font-semibold text-brand-dark mb-2 flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-brand-blue" />
                                    Kontak
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div>Telp: [Nomor Telepon]</div>
                                    <div>Koordinator: [Nama Koordinator]</div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-darkBlue transition-colors"
                                >
                                    <MapPin className="h-4 w-4" />
                                    Buka di Google Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mass Schedule */}
                <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-brand-blue" />
                        Jadwal Misa
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-brand-cream rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="h-6 w-6 text-brand-blue" />
                                <h3 className="font-bold text-brand-dark">Minggu</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="text-gray-700">
                                    <span className="font-semibold">[Jam] WIB</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-brand-cream rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="h-6 w-6 text-brand-blue" />
                                <h3 className="font-bold text-brand-dark">Hari Lain</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="text-gray-700">
                                    <span className="font-semibold">[Hari]: [Jam] WIB</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        * Jadwal dapat berubah sewaktu-waktu. Untuk informasi terkini, hubungi koordinator gereja.
                    </p>
                </section>

                {/* Facilities */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Fasilitas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            "Ruang Ibadah",
                            "Parkir",
                            "Kamar Kecil",
                            "Sound System",
                        ].map((facility, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:border-brand-blue hover:shadow-md transition-all"
                            >
                                <div className="font-medium text-gray-700">{facility}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Note */}
                <div className="bg-blue-50 border-l-4 border-brand-blue rounded-lg p-6">
                    <p className="text-gray-700">
                        <strong className="text-brand-dark">Informasi:</strong> Untuk informasi lebih detail atau untuk menambahkan
                        konten gereja ini, silakan hubungi sekretariat paroki.
                    </p>
                </div>
            </div>
        </div>
    );
}
