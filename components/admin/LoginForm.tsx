"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginFormInner() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Nama pengguna atau kata sandi salah.");
        setLoading(false);
      } else if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 flex flex-col space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-20 h-20 bg-brand-cream rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-blue/10">
            <svg className="w-10 h-10 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>
        <h1 className="text-4xl font-black text-brand-dark tracking-tighter">
          Admin Portal
        </h1>
        <p className="text-gray-500 font-medium tracking-tight">
          Silakan masuk untuk mengelola konten Paroki.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-100 animate-slide-up flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="username" className="block text-xs font-extra-bold uppercase tracking-widest text-gray-400 px-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all disabled:opacity-50 font-bold text-gray-900 outline-none"
            placeholder="Masukkan username"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-extra-bold uppercase tracking-widest text-gray-400 px-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all disabled:opacity-50 font-bold text-gray-900 outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-4 bg-brand-blue text-white font-black rounded-xl hover:bg-brand-darkBlue shadow-lg hover:shadow-brand-blue/20 transition-all duration-300 disabled:opacity-50 transform active:scale-95 flex items-center justify-center gap-2"
        >
          {loading ? (
             <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
             </>
          ) : (
            <>
                Sign In
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </>
          )}
        </button>
      </form>

      <div className="pt-4 text-center border-t border-gray-100">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-brand-blue font-bold transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Website
        </Link>
      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 font-rubik relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl" />
      
      <Suspense fallback={<div className="text-brand-blue font-bold flex items-center gap-2 animate-pulse">
          <div className="w-4 h-4 bg-brand-blue rounded-full"></div>
          Loading Admin...
      </div>}>
        <LoginFormInner />
      </Suspense>
    </div>
  );
}
