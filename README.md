# Pixovia

> **Pixovia LLC is shutting down. This is the full, real source code of the Pixovia platform — released publicly with full permissions. You are free to reuse, modify, and deploy this for any purpose, commercial or personal, at no cost.**

---

## What is Pixovia?

Pixovia was a multi-service web platform built with React, offering:

| Route | Feature |
|---|---|
| `/` | Home / Landing page |
| `/store` | App Store (Android apps, games, extensions, themes) |
| `/library` | File & media library (albums, files, uploads) |
| `/movies` | Movie streaming/listing |
| `/music` | Music player (JioSaavn API) |
| `/sports` | Live sports listings |
| `/learn` | Learning content |
| `/tv` | TV streaming |
| `/mods` | Game mods (BUSSID, GTA series) |
| `/chatroom` | AI-powered chatroom (Luna Bot) |
| `/tiny` | URL shortener |
| `/webhost` | Web hosting info |
| `/malayalidino` | Malayalidino section |
| `/downloader` | Media downloader (static) |
| `/contact` | Contact page |
| `/about` | About page |

---

## Architecture

- **Frontend:** React 18, React Router v6, react-helmet-async
- **Database 1 (Store):** Supabase — `apps`, `reviews`, `developers`, `hero_banners`, `collections`, `download_variants`
- **Database 2 (Library/Movies/Sports/Music/Learn):** Supabase — `files`, `albums`, `movie_audio_learn`, `sports`
- **Auth:** Supabase Auth (Google OAuth) — used in Library
- **Chatroom AI:** [Luna Bot](https://github.com/pixovia/luna_chat_bot) — AI messaging bot powering the chatroom
- **File Uploads:** [GitHub File Uploader Worker](https://github.com/pixovia/github_file_uploader) — Cloudflare Worker that handles file uploads to GitHub for the Library
- **Database Schema & CSV Data:** [pixovia/Database](https://github.com/pixovia/Database) — full schema and seed data

---

## Two Supabase Databases

This project uses **two separate Supabase projects**:

| Variable | Used In | Purpose |
|---|---|---|
| `REACT_APP_SUPABASE_URL` | Store (`src/store/lib/supabase.js`) | Store DB (DB1) |
| `REACT_APP_SUPABASE_ANON_KEY` | Store (`src/store/lib/supabase.js`) | Store DB anon key |
| Hardcoded in `src/library/lib/supabase.js` | Library, Movies, Sports, Music, Learn | DB2 |

> **Important:** `src/library/lib/supabase.js` has the DB2 credentials hardcoded as placeholder strings (`supabase_db2_url`, `supabase_db2_public_anon`). Replace these with your actual Supabase DB2 URL and anon key directly in that file.

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/pixovia/pixovia
cd pixovia
npm install
```

### 2. Set Up Supabase Databases

- Create **two** Supabase projects (or reuse one for both if you prefer).
- Import the schema and CSV seed data from [github.com/pixovia/Database](https://github.com/pixovia/Database).

**DB1 (Store)** tables: `apps`, `reviews`, `review_replies`, `review_likes`, `developers`, `hero_banners`, `collections`, `collection_items`, `download_variants`

**DB2 (Library/Content)** tables: `files`, `albums`, `movie_audio_learn`, `sports`

### 3. Configure Credentials

**DB1** — create a `.env` file in the project root:

```env
REACT_APP_SUPABASE_URL=https://your-db1-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-db1-anon-key
```

**DB2** — edit `src/library/lib/supabase.js` directly:

```js
const supabaseUrl = 'https://your-db2-project.supabase.co';
const supabaseAnonKey = 'your-db2-anon-key';
```

### 4. Run Locally

```bash
npm start
```

### 5. Build

```bash
npm run build
```

Output goes to the `build/` folder.

---

## Deploy to Cloudflare Pages

This project is optimized for **Cloudflare Pages**.

### Build Settings

| Setting | Value |
|---|---|
| Build command | `npm install && npm run build` |
| Build output directory | `build` |
| Root directory | *(leave blank)* |
| Build comments | Enabled |

### Environment Variables (Cloudflare Dashboard → Settings → Environment Variables)

| Type | Variable Name | Value |
|---|---|---|
| Plaintext | `REACT_APP_SUPABASE_URL` | Your DB1 Supabase URL |
| Plaintext | `REACT_APP_SUPABASE_ANON_KEY` | Your DB1 Supabase anon key |

> DB2 credentials are set directly in `src/library/lib/supabase.js` — not via env vars.

---

## Chatroom — Luna Bot

The `/chatroom` route redirects to a static page at `public/chatroom/`. The AI messaging in the chatroom is powered by **Luna Bot**.

- Repo: [github.com/pixovia/luna_chat_bot](https://github.com/pixovia/luna_chat_bot)
- Follow that repo's setup instructions to deploy Luna and point the chatroom at your instance.

---

## File Uploads — GitHub File Uploader Worker

The Library's file upload feature uses a Cloudflare Worker to upload files to GitHub.

- Repo: [github.com/pixovia/github_file_uploader](https://github.com/pixovia/github_file_uploader)
- Deploy the worker and update the upload endpoint in `src/library/components/UploadModal.js` to point to your worker URL.

---

## Library Auth (Google OAuth)

The Library uses Supabase Google OAuth. To enable:

1. In your DB2 Supabase project → Authentication → Providers → enable Google.
2. Add your Google OAuth client ID and secret.
3. Add your site URL to the allowed redirect URLs (e.g. `https://yourdomain.com/library`).

---

## Database & Seed Data

Full schema SQL and CSV data for all tables are available at:

**[github.com/pixovia/Database](https://github.com/pixovia/Database)**

Import the SQL schema first, then import the CSVs via the Supabase dashboard (Table Editor → Import CSV) or via `psql`.

---

## License & Permissions

**This project is fully open and free.** Pixovia LLC grants everyone full permission to:

- Use, copy, modify, and distribute this code
- Deploy it commercially or personally
- Rebrand and build new products on top of it

No attribution required. No restrictions. Do whatever you want with it.

---

## Related Repositories

| Repo | Purpose |
|---|---|
| [pixovia/Database](https://github.com/pixovia/Database) | DB schema + CSV seed data |
| [pixovia/luna_chat_bot](https://github.com/pixovia/luna_chat_bot) | AI chatroom bot (Luna) |
| [pixovia/github_file_uploader](https://github.com/pixovia/github_file_uploader) | Cloudflare Worker for file uploads |
