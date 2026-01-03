import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-brand-dark text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Column 1: Church Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-12 w-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-xl">
                                P
                            </div>
                            <div>
                                <div className="font-bold text-lg">Paroki Brayut</div>
                                <div className="text-sm text-gray-300">Santo Yohanes Paulus II</div>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-gray-300">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                                <span>
                                    Gereja Santo Yusuf Tambakrejo<br />
                                    Rejodani 1, Sariharjo, Ngaglik<br />
                                    Kabupaten Sleman, DIY 55581
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <a href="mailto:sekpar.brayut@kas.id" className="hover:text-brand-blue transition-colors">
                                    sekpar.brayut@kas.id
                                </a>
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <a href="tel:+622748609221" className="hover:text-brand-blue transition-colors">
                                    (0274) 860-9221
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Secretariat */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">
                            Sekretariat Paroki Brayut<br />
                            Santo Yohanes Paulus II
                        </h3>

                        <div className="space-y-3 text-sm text-gray-300">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                                <span>
                                    Jogopaten, Pandowoharjo<br />
                                    Kec. Sleman, Kabupaten Sleman<br />
                                    Daerah Istimewa Yogyakarta 55581
                                </span>
                            </div>

                            <div className="flex items-start gap-2">
                                <Clock className="h-4 w-4 mt-1 flex-shrink-0" />
                                <div>
                                    <div>Senin s.d. Jumat: 08.00 - 15.00 WIB</div>
                                    <div>Sabtu: 08.00 - 14.00 WIB</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Donation */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">
                            Donasi Pembangunan Gereja<br />
                            Santo Yohanes Paulus II
                        </h3>

                        <div className="space-y-3 text-sm text-gray-300">
                            <div className="rounded-lg bg-white/10 p-4 space-y-2">
                                <div>
                                    <div className="font-semibold text-white">Bank Mandiri KCP Sleman</div>
                                    <div className="font-mono">No. Rek. 137-00-1632682-5</div>
                                </div>

                                <div className="border-t border-white/20 pt-2">
                                    <div className="font-semibold text-white">Bank BRI Unit Palagan</div>
                                    <div className="font-mono">No. Rek. 7307-01-015723-53-5</div>
                                </div>

                                <div className="border-t border-white/20 pt-2 text-xs">
                                    a.n. PGPM Paroki Santo Yohanes Paulus II
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Paroki Brayut - Santo Yohanes Paulus II. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
