"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message?: string;
    description?: string;
    loading?: boolean;
    confirmText?: string;
    confirmVariant?: "default" | "destructive";
    variant?: "default" | "destructive";
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    description,
    loading = false,
    confirmText = "Confirm",
    confirmVariant,
    variant = "default",
}: ConfirmModalProps) {
    // Support both message and description props
    const displayMessage = message || description || "";
    // Support both confirmVariant and variant props
    const buttonVariant = confirmVariant || variant;

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="z-[100]">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {displayMessage}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={loading}
                        className={buttonVariant === "destructive"
                            ? "bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
                        }
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            confirmText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
