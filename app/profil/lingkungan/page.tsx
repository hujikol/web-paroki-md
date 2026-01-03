import { Metadata } from "next";
import { MapPin, Users, Home, Mail, Phone } from "lucide-react";

import { getChurchStatistics } from "@/lib/data";
import { getWilayahLingkungan } from "@/actions/data";

export const metadata: Metadata = {
    title: "Lingkungan | Paroki Brayut",
    description: "Daftar lingkungan dan wilayah Paroki Brayut Santo Yohanes Paulus II",
};

export default async function LingkunganPage() {
    const stats = await getChurchStatistics();
    const wilayahData = await getWilayahLingkungan();

    return (
        <div className="py-12">
            {/* Hero */}
            <section className="bg-gradient-to-r from-brand-blue to-brand-darkBlue text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <MapPin className="h-10 w-10" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Lingkungan</h1>
                            <p className="text-blue-100 mt-2">Komunitas Umat Paroki Brayut</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Wilayah Overview */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
                        <div className="rounded-full bg-brand-blue/10 p-4 w-16 h-16 mx-auto mb-4">
                            <MapPin className="h-8 w-8 text-brand-blue" />
                        </div>
                        <div className="text-3xl font-bold text-brand-dark mb-1">
                            {stats?.churches.toLocaleString('id-ID') || "5"}
                        </div>
                        <div className="text-gray-600">Wilayah</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
                        <div className="rounded-full bg-brand-blue/10 p-4 w-16 h-16 mx-auto mb-4">
                            <Users className="h-8 w-8 text-brand-blue" />
                        </div>
                        <div className="text-3xl font-bold text-brand-dark mb-1">
                            {stats?.wards.toLocaleString('id-ID') || "--"}
                        </div>
                        <div className="text-gray-600">Lingkungan</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
                        <div className="rounded-full bg-brand-blue/10 p-4 w-16 h-16 mx-auto mb-4">
                            <Home className="h-8 w-8 text-brand-blue" />
                        </div>
                        <div className="text-3xl font-bold text-brand-dark mb-1">
                            {stats?.families.toLocaleString('id-ID') || "--"}
                        </div>
                        <div className="text-gray-600">Keluarga (KK)</div>
                    </div>
                </section>

                {/* Wilayah List */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Daftar Wilayah & Lingkungan</h2>

                    <div className="space-y-6">
                        {wilayahData.length > 0 ? (
                            wilayahData.map((wilayah) => (
                                <div key={wilayah.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="rounded-lg bg-brand-blue/10 p-3 flex-shrink-0">
                                            <MapPin className="h-6 w-6 text-brand-blue" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-brand-dark mb-1">{wilayah.name}</h3>
                                            <div className="flex flex-col gap-1 mb-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-brand-blue" />
                                                    <span className="font-medium text-brand-blue">Ketua Wilayah: {wilayah.coordinator}</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                                                    <span>{wilayah.address || "belum terdapat data"}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:gap-4 mt-1">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                        <span>{wilayah.email || "belum terdapat data"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                        <span>{wilayah.phone || "belum terdapat data"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {wilayah.lingkungan.length > 0 ? (
                                                    wilayah.lingkungan.map((lingkungan) => (
                                                        <div key={lingkungan.id} className="bg-brand-cream rounded-lg p-4 border border-brand-blue/10">
                                                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-brand-blue/10">
                                                                <Home className="h-4 w-4 text-brand-blue" />
                                                                <span className="font-semibold text-brand-dark">{lingkungan.name}</span>
                                                            </div>
                                                            <div className="space-y-1.5 text-sm text-gray-600">
                                                                <div className="font-medium text-brand-blue">Ketua: {lingkungan.chief}</div>
                                                                <div className="text-xs">{lingkungan.address || "belum terdapat data"}</div>
                                                                <div className="text-xs flex items-center gap-1">
                                                                    <Mail className="h-3 w-3 text-gray-400" />
                                                                    {lingkungan.email || "belum terdapat data"}
                                                                </div>
                                                                <div className="text-xs flex items-center gap-1">
                                                                    <Phone className="h-3 w-3 text-gray-400" />
                                                                    {lingkungan.phone || "belum terdapat data"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-sm text-gray-500 italic col-span-full">Belum ada data lingkungan</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                Data Wilayah belum tersedia.
                            </div>
                        )}
                    </div>
                </section>

                {/* Note */}
                <div className="bg-blue-50 border-l-4 border-brand-blue rounded-lg p-6">
                    <p className="text-gray-700">
                        <strong className="text-brand-dark">Catatan:</strong> Informasi detail mengenai batas wilayah,
                        koordinator lingkungan, dan data lengkap akan selalu diperbarui. Untuk informasi lebih lanjut,
                        silakan hubungi sekretariat paroki.
                    </p>
                </div>
            </div>
        </div>
    );
}
