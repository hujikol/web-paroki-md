
import { CheckCircle2, ArrowRight, Link } from "lucide-react";
import { cn } from "@/lib/utils";

interface GradientActionCardProps {
    title: string;
    description: string;
    actioLabel: string;
    actionLink: string;
    icon?: React.ElementType;
    className?: string;
}

export default function GradientActionCard({
    title,
    description,
    actioLabel,
    actionLink,
    icon: Icon = CheckCircle2,
    className
}: GradientActionCardProps) {
    return (
        <div className={cn("bg-blur-lg bg-gradient-to-br from-brand-blue/10 via-brand-cream/20 to-brand-gold/10 rounded-3xl p-8 md:p-12 text-center border border-brand-blue/10 relative overflow-hidden group", className)}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4 relative z-10">{title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed relative z-10">
                {description}
            </p>
            <Link
                href={actionLink}
                target="_blank"
                className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-8 py-4 rounded-full font-bold hover:bg-brand-gold transition-all shadow-lg hover:shadow-brand-gold/30 transform hover:scale-105 relative z-10"
            >
                <Icon className="h-5 w-5" />
                {actioLabel} <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
