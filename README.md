# RealWorld Vite + React Frontend (demo)

This project is a Vite + React scaffold that connects to `https://realworld.habsida.net/api`.

## Quick start

1. Extract archive.
2. Install dependencies:
   ```
   npm install
   ```
3. Run dev server:
   ```
   npm run dev
   ```
   Vite dev server uses a proxy (`/api`) to forward requests to `https://realworld.habsida.net/api` to avoid CORS issues during development.

## Features
- Login / Register (stores token in localStorage)
- Favorite/unfavorite articles (only for authorized users)
- Create new article
- Settings with update user and Log out button
- Profile page showing "Your feed"
- Popular tags on the homepage

Notes:
- This is a minimal but functional scaffold. You can customize styles and components (Ant Design already included).
