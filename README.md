Realworld Blog - Complete demo scaffold

Features included:
- Home: article list + likes (favorites)
- Auth: Sign In / Register (token saved to localStorage)
- New Post: create article (editor)
- Settings: update user profile and logout
- Navbar shows links based on login state
- Uses relative /api base and vite proxy to forward to https://realworld.habsida.net

How to run:
1. unzip the project
2. cd realworld-complete
3. npm install
4. npm run dev
5. open http://localhost:5173

Notes & troubleshooting:
- The project uses a dev proxy (vite.config.js) so local requests to '/api' are forwarded to https://realworld.habsida.net/api.
- If you still see CORS errors, try opening your browser console and check network. Alternatively, you may need to enable CORS on the API server.
- Login/Register require the API to support the RealWorld Conduit endpoints at the target host.
