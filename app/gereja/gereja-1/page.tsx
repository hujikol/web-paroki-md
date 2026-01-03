import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Phone, Mail, Calendar } from "lucide-react";

export const metadata: Metadata = {
    title: "Gereja Santo Yusuf Tambakrejo | Paroki Brayut",
    description: "Gereja Santo Yusuf Tambakrejo - Paroki Brayut Santo Yohanes Paulus II",
};

export default function Gereja1Page() {
    return (
        <div className="py-12">
            {/* Hero Section */}
            <section className="relative h-[400px] bg-brand-dark">
                <Image
                    src="https://images.unsplash.com/photo-1548625149-fc4a29cf7092?q=80&w=2072&auto=format&fit=crop"
                    alt="Gereja Santo Yusuf Tambakrejo"
                    fill
                    className="object-cover opacity-40"
                />
                <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
                    <div className="max-w-4xl px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Gereja Santo Yusuf Tambakrejo
                        </h1>
                        <p className="text-xl md:text-2xl font-light">
                            Gereja Induk Paroki Brayut
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
                                Gereja Santo Yusuf Tambakrejo merupakan gereja induk dari Paroki Brayut Santo Yohanes Paulus II.
                                Gereja ini menjadi pusat kegiatan liturgi dan pastoral paroki.
                            </p>
                            <p>
                                [Tambahkan sejarah singkat gereja, tahun pembangunan, dan informasi penting lainnya di sini]
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
                                    Rejodani 1, Sariharjo, Ngaglik<br />
                                    Kabupaten Sleman, DIY 55581
                                </p>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="font-semibold text-brand-dark mb-2 flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-brand-blue" />
                                    Kontak
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div>Telp: (0274) 860-9221</div>
                                    <div>Email: sekpar.brayut@kas.id</div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <a
                                    href="https://maps.google.com/?q=Gereja+Santo+Yusuf+Tambakrejo"
                                    target="_blank"
                                    rel="noopener noreferrer"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-brand-cream rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="h-6 w-6 text-brand-blue" />
                                <h3 className="font-bold text-brand-dark">Minggu</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="text-gray-700">
                                    <span className="font-semibold">06.00 WIB</span>
                                </div>
                                <div className="text-gray-700">
                                    <span className="font-semibold">08.00 WIB</span>
                                </div>
                                <div className="text-gray-700">
                                    <span className="font-semibold">17.00 WIB</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-brand-cream rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="h-6 w-6 text-brand-blue" />
                                <h3 className="font-bold text-brand-dark">Senin - Sabtu</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="text-gray-700">
                                    <span className="font-semibold">06.00 WIB</span>
                                    <div className="text-sm text-gray-600">Misa Harian</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-brand-cream rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="h-6 w-6 text-brand-blue" />
                                <h3 className="font-bold text-brand-dark">Misa Khusus</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="text-gray-700">
                                    <span className="font-semibold">Jumat Pertama</span>
                                    <div className="text-sm text-gray-600">18.30 WIB</div>
                                </div>
                                <div className="text-gray-700">
                                    <span className="font-semibold">Misa OMK</span>
                                    <div className="text-sm text-gray-600">Minggu ke-3, 19.00 WIB</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Facilities */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Fasilitas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            "Ruang Utama",
                            "Sekretariat",
                            "Aula",
                            "Parkir",
                            "Kamar Kecil",
                            "Audio System",
                            "AC",
                            "Ruang Koor",
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

                {/* Gallery Placeholder */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Galeri Foto</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                            >
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    Foto {i}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        * Foto-foto akan segera ditambahkan
                    </p>
                </section>

                {/* Note */}
                <div className="bg-blue-50 border-l-4 border-brand-blue rounded-lg p-6">
                    <p className="text-gray-700">
                        <strong className="text-brand-dark">Informasi:</strong> Untuk informasi lebih detail mengenai
                        kegiatan dan jadwal khusus, silakan hubungi sekretariat paroki atau kunjungi halaman{" "}
                        <Link href="/jadwal-misa" className="text-brand-blue hover:underline font-semibold">
                            Jadwal Misa
                        </Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
