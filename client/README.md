# DockPanel Frontend

Frontend for the DockPanel Docker monitoring dashboard.

## Backend contract

The frontend is built against the existing backend:

- `GET /health`
- `GET /containers`
- `GET /containers/:id/stats`
- `POST /containers/:id/start`
- `POST /containers/:id/stop`
- `POST /containers/:id/restart`
- `WS /ws/logs/:id`

Default local backend URL:

```text
http://localhost:4000
```

## Run

```bash
npm install
npm run dev
```

If your backend runs on another host/port, create `.env.local`:

```env
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000
```

## Structure

```text
src/
├── api.ts
├── App.tsx
├── appTypes.ts
├── types.ts
├── utils.ts
├── hooks/
│   ├── useMonitoring.ts
│   └── useTheme.ts
└── components/
    ├── common/
    ├── landing/
    └── dashboard/
```

`api.ts` contains all HTTP/WebSocket communication. Components only receive data and callbacks. `useMonitoring` owns polling, selected container state, history, and container actions.
