Fixed project for Vercel deployment:
- Added vercel.json with rewrites to proxy /api/* to https://api.realworld.io/api/*
- Inserted fallback BASE definitions in files that referenced BASE but didn't define it.
  The code now uses https://api.realworld.io/api as a fallback BASE so posts load on Vercel.
- If you prefer using the proxy, keep BASE = '/api' and the vercel.json will forward requests.
How to deploy:
1. Push this project to your Git repository.
2. Deploy to Vercel from that repo (it will pick up vercel.json).
3. Alternatively, set BASE in your code to '' and use NEXT_PUBLIC_API_URL env var.
