import Link from "next/link";
import { FileText, Download, ArrowRight } from "lucide-react";

const formCategories = [
    { title: "Baptis", count: 2 },
    { title: "Pernikahan", count: 1 },
    { title: "Sakramen", count: 3 },
    { title: "Administrasi", count: 3 },
];

export default function FormulirLinkSection() {
    return (
        <section className="bg-gradient-to-br from-brand-blue to-brand-darkBlue py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Description */}
                    <div className="text-white">
                        <span className="text-blue-200 font-bold tracking-wider uppercase text-sm">
                            Layanan Digital
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                            Formulir Gereja
                        </h2>
                        <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                            Unduh formulir yang Anda butuhkan untuk berbagai keperluan administrasi gereja.
                            Semua formulir tersedia dalam format PDF.
                        </p>

                        <div className="flex flex-wrap gap-3 mb-8">
                            {formCategories.map((category, index) => (
                                <div
                                    key={index}
                                    className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20"
                                >
                                    <div className="text-sm font-medium">{category.title}</div>
                                    <div className="text-xs text-blue-200">{category.count} formulir</div>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/data/formulir"
                            className="inline-flex items-center gap-2 bg-white text-brand-blue px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            <FileText className="h-5 w-5" />
                            Lihat Semua Formulir
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>

                    {/* Right Side - Visual Element */}
                    <div className="relative">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                            <div className="space-y-4">
                                {[
                                    "Baptis Anak",
                                    "Baptis Dewasa",
                                    "Pernikahan",
                                    "Keterangan Kematian",
                                    "Komuni Pertama",
                                ].map((form, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                                    >
                                        <div className="rounded-lg bg-white/20 p-3">
                                            <Download className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1 text-white">
                                            <div className="font-semibold">{form}</div>
                                            <div className="text-sm text-blue-200">PDF Format</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Decorative element */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}
