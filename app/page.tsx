"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-black" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-4">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-black">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">Spotify Ai</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
          AI ile kişisel
          <span className="text-green-400 block">playlist&apos;ini oluştur</span>
        </h1>

        <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
          Müzik zevkini analiz edip Grok AI ile sana özel çalma listesi hazırlıyoruz.
        </p>

        <a
          href="/api/auth/login"
          className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-200 hover:scale-105"
        >
          Spotify ile Giriş Yap
        </a>

        <p className="text-gray-600 text-sm mt-6">Ücretsiz · Güvenli · Veriler saklanmaz</p>
      </div>
    </main>
  );
}
