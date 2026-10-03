# indowud_panel

Admin panel for the Indowud loyalty programme. React 19 + Vite + Tailwind, deployed on Vercel.
It talks only to the `indowud-main-engine` API — there is no Firebase in this app.

## Setup

```bash
git clone https://github.com/ryavee/indowud_panel.git
cd indowud_panel
cp .env.example .env.local     # set VITE_API_URL to the backend, e.g. http://localhost:2000
npm install
npm run dev                    # http://localhost:5173
```

For local development run the backend too (see its README) and make sure its `CORS_ORIGINS` includes `http://localhost:5173`.
On Vercel, set `VITE_API_URL` in the project's environment variables.

## How auth works

- Login (`src/Context/AuthContext.jsx`) calls `POST /api/admin/v1/auth/login` and stores the access and refresh tokens.
- Every request goes through `src/Services/apiClient.js#apiFetch`, which adds the token, refreshes it once on a `401`
  (concurrent requests share the refresh), and signs the admin out if the session can't be renewed.
- On page load the session is confirmed with `GET /api/admin/v1/auth/me`, so a deactivated admin or changed role takes effect immediately.
- `src/Components/ProtectedRoute.jsx` guards the signed-in area and each page's roles (see `src/Routes/AppRoutes.jsx`).
  This only decides what to show — the backend checks the role on every request.
- Data contexts (`src/Context/DataProviders.jsx`) mount only after login, and remount per admin.
- Password resets: the emailed link opens `/reset-password?token=…`.

Roles: `SUPER_ADMIN`, `ADMIN` (everything) and `QR_GENERATE` (dealers, QR generation, read-only products).
