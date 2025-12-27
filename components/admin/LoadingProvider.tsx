"use client";

import { useTransition } from "react";
import { createContext, useContext, ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  startTransition: (callback: () => Promise<void> | void) => Promise<void>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isPending, startReactTransition] = useTransition();

  const startTransition = async (callback: () => Promise<void> | void) => {
    startReactTransition(() => {
      const result = callback();
      if (result instanceof Promise) {
        // We handle the promise resolution via the transition state
      }
    });
  };

  return (
    <LoadingContext.Provider value={{ isLoading: isPending, startTransition }}>
      {children}
      {isPending && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-100 border-t-brand-blue rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-brand-blue/10 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-brand-dark font-medium tracking-tighter text-lg">Loading...</span>
                <span className="text-gray-400 text-[14px] font-medium tracking-[0.2em] animate-pulse">Please wait</span>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
