import { Metadata } from "next";
import { Users, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
    title: "Pastor & Tim Kerja | Paroki Brayut",
    description: "Pastor Paroki dan Tim Kerja Paroki Brayut Santo Yohanes Paulus II",
};

export default function PastorTimPage() {
    return (
        <div className="py-12">
            {/* Hero */}
            <section className="bg-gradient-to-r from-brand-blue to-brand-darkBlue text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="h-10 w-10" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Pastor Paroki & Tim Kerja</h1>
                            <p className="text-blue-100 mt-2">Pelayan Umat Paroki Brayut</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Pastor Paroki */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Pastor Paroki</h2>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-shrink-0">
                                <div className="w-48 h-48 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <Users className="h-20 w-20 text-gray-400" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-brand-dark mb-2">[Nama Pastor Paroki]</h3>
                                <p className="text-brand-blue font-semibold mb-4">Pastor Paroki</p>
                                <p className="text-gray-700 mb-4">
                                    [Biografi dan deskripsi pastor paroki akan ditambahkan di sini]
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        <span>pastor@parokibrayut.id</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone className="h-4 w-4" />
                                        <span>(0274) 860-9221</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tim Kerja Paroki */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Tim Kerja Paroki</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: "[Nama]", position: "Ketua Dewan Paroki" },
                            { name: "[Nama]", position: "Sekretaris Paroki" },
                            { name: "[Nama]", position: "Bendahara Paroki" },
                            { name: "[Nama]", position: "Koordinator Liturgi" },
                            { name: "[Nama]", position: "Koordinator Diakonia" },
                            { name: "[Nama]", position: "Koordinator Koinonia" },
                        ].map((member, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center">
                                        <Users className="h-8 w-8 text-brand-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-brand-dark">{member.name}</h3>
                                        <p className="text-sm text-gray-600">{member.position}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Staff Sekretariat */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Staff Sekretariat</h2>
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                        <p className="text-gray-700">
                            Informasi staff sekretariat akan segera ditambahkan. Untuk bantuan dan informasi,
                            silakan hubungi sekretariat paroki pada jam kerja.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
