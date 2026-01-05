"use client";

import Link from "next/link";
import { Heart, Building2, ArrowRight, Copy } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function DonationSection() {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Nomor rekening berhasil disalin");
    };

    return (
        <section className="py-24 bg-brand-warm/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Side - Content */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-8 text-center lg:text-left">
                        <div>
                            <span className="text-brand-gold font-bold tracking-wider uppercase text-sm mb-2 block">
                                Mari Berpartisipasi
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Donasi Pembangunan <br /> Gereja
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Gereja Paroki Brayut sedang dalam proses pembangunan Gereja Santo Yohanes Paulus II.
                                Dukungan doa dan dana dari Anda sangat berarti bagi kelancaran pembangunan rumah Tuhan ini.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button size="lg" className="rounded-full px-8 bg-brand-blue hover:bg-blue-800" asChild>
                                <Link href="/contact">
                                    Konfirmasi Donasi
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full px-8 border-brand-blue text-brand-blue hover:bg-brand-blue/5" asChild>
                                <Link href="/profil/sejarah">
                                    Lihat Progress
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Side - Cards */}
                    <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Card */}
                        <div className="relative h-[300px] md:h-full min-h-[300px] rounded-2xl overflow-hidden shadow-lg md:col-span-1 hidden md:block group">
                            <Image
                                src="https://images.unsplash.com/photo-1548625149-fc4a29cf7092?q=80&w=2072&auto=format&fit=crop"
                                alt="Pembangunan Gereja"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-brand-blue/10 p-2">
                                        <Building2 className="h-5 w-5 text-brand-blue" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">Gereja Baru</div>
                                        <div className="text-xs text-gray-600">Santo Yohanes Paulus II</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bank Accounts */}
                        <div className="space-y-4">
                            <Card className="border-l-4 border-l-blue-700 overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-sm text-gray-700 font-medium">Bank Mandiri</p>
                                            <h4 className="text-lg font-bold text-gray-900">KCP Sleman</h4>
                                        </div>
                                        <Building2 className="h-6 w-6 text-blue-700 opacity-20" />
                                    </div>
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mt-2 group cursor-pointer" onClick={() => handleCopy("137-00-1632682-5")}>
                                        <code className="text-lg font-mono font-semibold text-blue-700">137-00-1632682-5</code>
                                        <Copy className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-orange-600 overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Bank BRI</p>
                                            <h4 className="text-lg font-bold text-gray-900">Unit Palagan</h4>
                                        </div>
                                        <Building2 className="h-6 w-6 text-orange-600 opacity-20" />
                                    </div>
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mt-2 group cursor-pointer" onClick={() => handleCopy("7307-01-015723-53-5")}>
                                        <code className="text-lg font-mono font-semibold text-orange-600">7307-01-015723-53-5</code>
                                        <Copy className="h-4 w-4 text-gray-400 group-hover:text-orange-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="bg-white rounded-lg p-4 border border-red-100 flex items-center gap-3 shadow-sm">
                                <div className="bg-red-50 p-2 rounded-full">
                                    <Heart className="h-4 w-4 text-red-500" />
                                </div>
                                <div className="text-xs text-gray-600">
                                    Rekening a.n: <br /> <span className="font-bold text-gray-900">PGPM Paroki Santo Yohanes Paulus II</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
