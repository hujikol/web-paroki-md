import { Metadata } from "next";
import Image from "next/image";
import { Church, MapPin, Users, Calendar } from "lucide-react";
import { getChurchStatistics } from "@/lib/data";

export const metadata: Metadata = {
    title: "Profil & Selayang Pandang | Paroki Brayut",
    description: "Selayang pandang Paroki Brayut Santo Yohanes Paulus II - Sejarah, visi, dan misi paroki",
};

export default async function ProfilPage() {
    const stats = await getChurchStatistics();

    return (
        <div className="py-12">
            {/* Hero Section */}
            <section className="relative h-[400px] bg-brand-dark">
                <Image
                    src="https://images.unsplash.com/photo-1548625149-fc4a29cf7092?q=80&w=2072&auto=format&fit=crop"
                    alt="Paroki Brayut"
                    fill
                    className="object-cover opacity-40"
                />
                <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
                    <div className="max-w-4xl px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Paroki Brayut
                        </h1>
                        <p className="text-xl md:text-2xl font-light">
                            Santo Yohanes Paulus II
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Selayang Pandang */}
                <section>
                    <h2 className="text-3xl font-bold text-brand-dark mb-6">Selayang Pandang</h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p>
                            Paroki Brayut Santo Yohanes Paulus II merupakan salah satu paroki di Keuskupan Agung Semarang
                            yang melayani umat Katolik di wilayah Sleman, Yogyakarta. Paroki ini didirikan dengan semangat
                            evangelisasi dan pelayanan kepada umat beriman.
                        </p>
                        <p>
                            Dengan motto pelayanan yang penuh kasih dan dedikasi, Paroki Brayut terus bertumbuh dalam iman
                            dan pelayanan kepada Tuhan melalui berbagai kegiatan liturgi, pastoral, dan sosial kemasyarakatan.
                        </p>
                    </div>
                </section>

                {/* Statistics Cards */}
                <section>
                    <h2 className="text-3xl font-bold text-brand-dark mb-6">Data Paroki</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-brand-blue/10 p-3">
                                    <Church className="h-8 w-8 text-brand-blue" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-brand-dark">
                                        {stats?.churches.toLocaleString('id-ID') || "5"}
                                    </div>
                                    <div className="text-sm text-gray-600">Gereja</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-brand-blue/10 p-3">
                                    <MapPin className="h-8 w-8 text-brand-blue" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-brand-dark">
                                        {stats?.wards.toLocaleString('id-ID') || "--"}
                                    </div>
                                    <div className="text-sm text-gray-600">Lingkungan</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-brand-blue/10 p-3">
                                    <Users className="h-8 w-8 text-brand-blue" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-brand-dark">
                                        {stats?.families.toLocaleString('id-ID') || "--"}
                                    </div>
                                    <div className="text-sm text-gray-600">Keluarga (KK)</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-brand-blue/10 p-3">
                                    <Users className="h-8 w-8 text-brand-blue" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-brand-dark">
                                        {stats?.parishioners.toLocaleString('id-ID') || "--"}
                                    </div>
                                    <div className="text-sm text-gray-600">Umat</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        * Data statistik {stats?.lastUpdated
                            ? `terakhir diperbarui: ${new Date(stats.lastUpdated).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
                            : 'akan diperbarui dari sistem manajemen paroki'}
                    </p>
                </section>

                {/* Visi & Misi */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-brand-blue to-brand-darkBlue text-white rounded-xl shadow-lg p-8">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Calendar className="h-6 w-6" />
                            Visi
                        </h3>
                        <p className="text-blue-100 leading-relaxed">
                            Menjadi komunitas Katolik yang hidup, beriman, dan penuh kasih, serta aktif dalam mewartakan
                            Kabar Gembira Yesus Kristus kepada semua orang.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border-2 border-brand-blue p-8">
                        <h3 className="text-2xl font-bold mb-4 text-brand-dark flex items-center gap-2">
                            <Calendar className="h-6 w-6 text-brand-blue" />
                            Misi
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-brand-blue mt-1">•</span>
                                <span>Meningkatkan kehidupan rohani umat melalui liturgi dan sakramen</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-brand-blue mt-1">•</span>
                                <span>Membangun persaudaraan dan kebersamaan dalam komunitas</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-brand-blue mt-1">•</span>
                                <span>Melayani sesama dengan penuh kasih dan kerendahan hati</span>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}
