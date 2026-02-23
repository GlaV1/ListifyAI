"use client";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Hosgeldin!
        </h1>
        <p className="text-gray-400 mb-8">
          Spotify hesabın baglandi.
        </p>
        
          <a href="/api/auth/logout"className="text-red-400 hover:text-red-300">
          Cikis Yap
        </a>
      </div>
    </main>
  );
}