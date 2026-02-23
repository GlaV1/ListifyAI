"use client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Spotify Playlist AI
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          Muzik zevkine gore kisisel playlist olustur
        </p>
          <a href="/api/auth/login" className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-8 rounded-full text-lg transition-all">
          Spotify ile Giris Yap
        </a>
      </div>
      </main>
  );
}