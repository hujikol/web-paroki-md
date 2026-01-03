import { Metadata } from "next";
import { Users, Mail, Phone } from "lucide-react";
import { getPastorTimKerja } from "@/actions/data";

export const metadata: Metadata = {
    title: "Pastor & Tim Kerja | Paroki Brayut",
    description: "Pastor Paroki dan Tim Kerja Paroki Brayut Santo Yohanes Paulus II",
};

export default async function PastorTimPage() {
    const data = await getPastorTimKerja();
    const { pastor, timKerja } = data;

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
                    <div className="space-y-6">
                        {pastor.length > 0 ? (
                            pastor.map((p) => (
                                <div key={p.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="flex-shrink-0">
                                            {p.imageUrl ? (
                                                <img src={p.imageUrl} alt={p.name} className="w-48 h-48 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-48 h-48 rounded-lg bg-gray-200 flex items-center justify-center">
                                                    <Users className="h-20 w-20 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-brand-dark mb-2">{p.name}</h3>
                                            <p className="text-brand-blue font-semibold mb-4">{p.role}</p>

                                            {p.quote && (
                                                <blockquote className="border-l-4 border-brand-blue pl-4 italic text-gray-600 mb-4 bg-gray-50 py-2 pr-2 rounded-r">
                                                    "{p.quote}"
                                                </blockquote>
                                            )}

                                            <p className="text-gray-700 mb-4 whitespace-pre-line">
                                                {p.description}
                                            </p>

                                            <div className="space-y-2 text-sm pt-4 border-t border-gray-100">
                                                {p.email && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="h-4 w-4 text-brand-blue" />
                                                        <span>{p.email}</span>
                                                    </div>
                                                )}
                                                {p.phone && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone className="h-4 w-4 text-brand-blue" />
                                                        <span>{p.phone}</span>
                                                    </div>
                                                )}
                                                {!p.email && !p.phone && (
                                                    <div className="text-gray-500 italic">Kontak via Sekretariat Paroki</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center text-gray-500">
                                Data Pastor belum tersedia.
                            </div>
                        )}
                    </div>
                </section>

                {/* Tim Kerja Paroki */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Tim Kerja Paroki</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {timKerja.length > 0 ? (
                            timKerja.map((member) => (
                                <div key={member.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center">
                                            <Users className="h-8 w-8 text-brand-blue" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-brand-dark">{member.name}</h3>
                                            <p className="text-sm font-semibold text-brand-blue">{member.division}</p>
                                            <p className="text-xs text-gray-600 mb-2">{member.role}</p>

                                            {member.quote && (
                                                <p className="text-xs italic text-gray-500 mb-2">"{member.quote}"</p>
                                            )}

                                            <div className="space-y-1 mt-2 pt-2 border-t border-gray-100">
                                                {member.email && (
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Mail className="h-3 w-3" />
                                                        <span>{member.email}</span>
                                                    </div>
                                                )}
                                                {member.phone && (
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Phone className="h-3 w-3" />
                                                        <span>{member.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                Data Tim Kerja belum tersedia.
                            </div>
                        )}
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

