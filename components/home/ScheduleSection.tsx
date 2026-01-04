"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScheduleEvent } from "@/types/data";

interface MassSchedule {
    day: string;
    time: string;
    location?: string;
    type: "daily" | "weekly" | "special";
}

interface ScheduleSectionProps {
    upcomingEvents?: ScheduleEvent[];
}

const mainChurchSchedule: MassSchedule[] = [
    { day: "Minggu", time: "06.00, 08.00, 17.00 WIB", type: "weekly" },
    { day: "Senin - Sabtu", time: "06.00 WIB", type: "daily" },
    { day: "Jumat Pertama", time: "18.30 WIB", type: "special" },
];

export default function ScheduleSection({ upcomingEvents = [] }: ScheduleSectionProps) {
    return (
        <section className="py-20 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Jadwal & Kegiatan</h2>
                        <p className="text-gray-500 max-w-xl">
                            Informasi jadwal perayaan Ekaristi dan kegiatan terkini di Paroki Brayut Santo Yohanes Paulus II.
                        </p>
                    </div>
                    <Button variant="outline" asChild className="hidden md:flex">
                        <Link href="/jadwal-misa">
                            Lihat Semua Jadwal <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Mass Schedule - Spans 2 cols on tablet */}
                    <Card className="md:col-span-2 lg:col-span-1 h-full shadow-sm hover:shadow-md transition-shadow border-gray-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-brand-gold" />
                                Jadwal Misa
                            </CardTitle>
                            <CardDescription>Gereja Santo Yusuf Tambakrejo</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mainChurchSchedule.map((schedule, idx) => (
                                <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                                    <div>
                                        <p className="font-semibold text-gray-900">{schedule.day}</p>
                                        <p className="text-sm text-gray-700">{schedule.time}</p>
                                    </div>
                                    <Badge variant={schedule.type === 'weekly' ? 'default' : 'secondary'} className={schedule.type === 'weekly' ? 'bg-brand-blue hover:bg-blue-700' : ''}>
                                        {schedule.type === 'weekly' ? 'Mingguan' : schedule.type === 'daily' ? 'Harian' : 'Bulanan'}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Upcoming Events - Spans 2 cols */}
                    <Card className="md:col-span-3 lg:col-span-2 h-full shadow-sm hover:shadow-md transition-shadow border-gray-200 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-brand-blue" />
                                    Agenda Kegiatan
                                </CardTitle>
                                <CardDescription>Kegiatan mendatang di paroki</CardDescription>
                            </div>
                            <Link href="/data/jadwal" className="text-sm text-brand-blue hover:underline md:hidden">
                                Lihat Semua
                            </Link>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.slice(0, 4).map((event) => (
                                    <Link href={`/data/jadwal`} key={event.id} className="group">
                                        <div className="h-full p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-brand-blue/30 hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between mb-2">
                                                <Badge variant="outline" className="bg-white text-xs font-normal">
                                                    {new Date(event.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                                </Badge>
                                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand-blue transition-colors" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-1 mb-1">
                                                {event.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="h-3 w-3" />
                                                <span>{event.time}</span>
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span className="line-clamp-1">{event.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                                    Belum ada kegiatan mendatang
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Mobile CTA for All Schedule */}
                    <div className="md:hidden w-full mt-4">
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/jadwal-misa">
                                Lihat Semua Jadwal <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
