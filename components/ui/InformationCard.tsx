import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InformationCardProps {
    title?: string;
    description: string;
    className?: string;
}

export default function InformationCard({
    title = "Informasi Penting",
    description,
    className
}: InformationCardProps) {
    return (
        <div className={cn("bg-brand-warm/50 rounded-xl border border-brand-blue/10 p-8", className)}>
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-brand-blue/10 rounded-full">
                    <Info className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-xl font-bold font-sans text-brand-dark">{title}</h3>
            </div>
            <p className="text-blue-900 leading-relaxed">
                {description}
            </p>
        </div>
    );
}