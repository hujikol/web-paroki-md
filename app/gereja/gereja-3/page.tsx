import { Metadata } from "next";
import Image from "next/image";
import { MapPin, Clock, Phone, Calendar } from "lucide-react";

export const metadata: Metadata = {
    title: "Gereja [Nama Gereja 3] | Paroki Brayut",
    description: "Gereja [Nama Gereja 3] - Paroki Brayut Santo Yohanes Paulus II",
};

export default function Gereja3Page() {
    return (
        <div className="py-12">
            <section className="relative h-[400px] bg-brand-dark">
                <Image
                    src="https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=2071&auto=format&fit=crop"
                    alt="Gereja 3"
                    fill
                    className="object-cover opacity-40"
                />
                <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
                    <div className="max-w-4xl px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">[Nama Gereja 3]</h1>
                        <p className="text-xl md:text-2xl font-light">Wilayah [Nama Wilayah]</p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-bold text-brand-dark mb-6">Tentang Gereja</h2>
                        <div className="prose prose-lg text-gray-700">
                            <p>[Deskripsi singkat tentang gereja, sejarah, dan peran dalam paroki]</p>
                            <p>[Tambahkan informasi penting lainnya di sini]</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                        <h3 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                            <MapPin className="h-6 w-6 text-brand-blue" />
                            Lokasi
                        </h3>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <div className="font-semibold text-brand-dark mb-1">Alamat</div>
                                <p>[Alamat Lengkap Gereja]<br />Kabupaten Sleman, DIY 55581</p>
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
                        </div>
                    </div>
                </section>

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
                            <div className="text-gray-700">
                                <span className="font-semibold">[Jam] WIB</span>
                            </div>
                        </div>
                        <div className="bg-brand-cream rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="h-6 w-6 text-brand-blue" />
                                <h3 className="font-bold text-brand-dark">Hari Lain</h3>
                            </div>
                            <div className="text-gray-700">
                                <span className="font-semibold">[Hari]: [Jam] WIB</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="bg-blue-50 border-l-4 border-brand-blue rounded-lg p-6">
                    <p className="text-gray-700">
                        <strong className="text-brand-dark">Informasi:</strong> Konten halaman ini akan segera dilengkapi.
                        Untuk informasi sementara, silakan hubungi sekretariat paroki.
                    </p>
                </div>
            </div>
        </div>
    );
}
