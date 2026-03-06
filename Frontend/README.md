# Handicraft Online Store – Frontend

React + Vite frontend with clean architecture.

## Architecture (Layers)

```
Frontend/
├── public/           # Static assets
├── src/
│   ├── app/          # App entry, layout, global styles
│   ├── pages/        # Page/screen components
│   ├── services/     # API client
│   ├── shared/       # Schemas, types, shared data
│   └── assets/       # Images
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Scripts

- `npm run dev` – Start dev server (port 5173)
- `npm run build` – Production build
- `npm run preview` – Preview production build

## Environment

Create `.env` with `VITE_API_URL=http://localhost:3000` (backend URL).
