import Link from "next/link";
import { Heart, Building2, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function DonationSection() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Image */}
                    <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1548625149-fc4a29cf7092?q=80&w=2072&auto=format&fit=crop"
                            alt="Pembangunan Gereja Santo Yohanes Paulus II"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Floating badge */}
                        <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-brand-blue p-3">
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-brand-dark">Pembangunan Gereja</div>
                                    <div className="text-sm text-gray-600">Santo Yohanes Paulus II</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="space-y-6">
                        <div>
                            <span className="text-brand-blue font-bold tracking-wider uppercase text-sm">
                                Mari Berpartisipasi
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mt-2 mb-4">
                                Donasi Pembangunan Gereja
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Gereja Paroki Brayut saat ini sedang dalam proses pembangunan Gereja Santo Yohanes Paulus II.
                                Dukungan doa dan dana dari Bapak/Ibu/Saudara/i sangat berarti bagi kelancaran pembangunan ini.
                            </p>
                        </div>

                        {/* Bank Accounts */}
                        <div className="space-y-4">
                            <div className="bg-brand-cream border-2 border-brand-blue/20 rounded-xl p-6">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="rounded-lg bg-brand-blue/10 p-2">
                                        <Building2 className="h-5 w-5 text-brand-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-brand-dark">Bank Mandiri KCP Sleman</div>
                                        <div className="font-mono text-lg font-semibold text-brand-blue mt-1">
                                            137-00-1632682-5
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-brand-cream border-2 border-brand-blue/20 rounded-xl p-6">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="rounded-lg bg-brand-blue/10 p-2">
                                        <Building2 className="h-5 w-5 text-brand-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-brand-dark">Bank BRI Unit Palagan</div>
                                        <div className="font-mono text-lg font-semibold text-brand-blue mt-1">
                                            7307-01-015723-53-5
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                                <Heart className="h-4 w-4 text-red-500 inline mr-2" />
                                Atas nama: <span className="font-semibold">PGPM Paroki Santo Yohanes Paulus II</span>
                            </div>
                        </div>

                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-full font-bold hover:bg-brand-darkBlue transition-all shadow-lg hover:shadow-xl"
                        >
                            Informasi Lebih Lanjut
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
