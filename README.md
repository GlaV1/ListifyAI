# 🎵 spoai

AI destekli Spotify playlist oluşturucu. Groq AI (LLaMA 3.3) ile istediğin tarza, ruh haline veya aktiviteye göre kişiselleştirilmiş playlist önerileri alırsın ve direkt Spotify hesabına kaydedersin.

## Özellikler

- Spotify OAuth 2.0 ile güvenli giriş
- Groq AI (LLaMA 3.3 70B) ile doğal dil tabanlı playlist önerisi
- Hazır öneri butonları (lo-fi, parti, sabah koşusu vb.)
- Oluşturulan playlist'i tek tıkla Spotify'a kaydet
- CSRF koruması ve güvenli httpOnly cookie yönetimi

## Kurulum

### Gereksinimler

- Node.js 18+
- Spotify Developer hesabı → [developer.spotify.com](https://developer.spotify.com)
- Groq API key → [console.groq.com](https://console.groq.com)
- **Spotify Premium** (playlist kaydetme özelliği için)

### Adımlar

1. Repoyu klonla:
```bash
git clone https://github.com/GlaV1/spoai.git
cd spoai
npm install
```

2. `.env.local` dosyası oluştur:
```env
SPOTIFY_CLIENT_ID=spotify_client_id
SPOTIFY_CLIENT_SECRET=spotify_client_secret
GROQ_API_KEY=groq_api_key
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_REDIRECT_URI=http://127.0.0.1:3000/api/auth/callback
```

3. Spotify Developer Dashboard'da:
   - Redirect URI olarak `http://127.0.0.1:3000/api/auth/callback` ekle
   - User Management'tan Spotify hesabını ekle (development mode)

4. Geliştirme sunucusunu başlat:
```bash
npm run dev
```

5. Tarayıcıda aç: `http://127.0.0.1:3000`

## Kullanılan Teknolojiler

- [Next.js 16](https://nextjs.org) — Full-stack framework
- [Groq API](https://groq.com) — LLaMA 3.3 70B ile AI önerileri
- [Spotify Web API](https://developer.spotify.com/documentation/web-api) — Playlist yönetimi
- [Tailwind CSS](https://tailwindcss.com) — Stil

## Güvenlik

- OAuth 2.0 CSRF koruması (state parametresi)
- httpOnly cookie ile token saklama (XSS koruması)
- Production'da Secure cookie flag
- Client secret sunucu tarafında, client'a hiç gönderilmiyor

## Lisans

MIT