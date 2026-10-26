<!-- Tip: add a screenshot or short GIF of the dashboard here, e.g. ![Drozzle dashboard](docs/dashboard.png) -->

# 🐳 Drozzle

**A real-time dashboard for monitoring and managing your Docker containers.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

Drozzle gives you one clean place to see container health, resource usage and live logs, instead of juggling `docker ps`, `docker stats` and `docker logs` across separate terminals. I've been building it over the past few weeks as a full-stack project around the Docker Engine API and WebSockets.

---

## ✨ Features

- **Live resource metrics**: CPU %, memory usage / limit / %, network RX/TX and dropped packets for every running container
- **Real-time logs**: stdout and stderr streamed to the browser over WebSockets, with timestamps and a built-in search filter
- **Container control**: start, stop and restart containers straight from the UI
- **Analytics-style dashboard**: area charts, summary cards (running / stopped / avg CPU / total memory) and per-container tables
- **Landing page + dashboard** with a collapsible sidebar and a dark / light theme (remembered between visits)
- **One-command setup** with Docker Compose

## 🧰 Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Recharts, Axios, lucide-react |
| Backend | Node.js 20, Express, TypeScript, [dockerode](https://github.com/apocas/dockerode), ws, cors |
| Infrastructure | Docker (multi-stage builds), Docker Compose, nginx (static hosting + reverse proxy) |

## 🏗️ Architecture

```
┌──────────┐   HTTP + WebSocket   ┌───────────────┐   proxy    ┌────────────────────┐   docker.sock   ┌───────────────┐
│ Browser  │ ───────────────────► │ nginx  (:80)  │ ─────────► │ Express backend    │ ──────────────► │ Docker Engine │
│ (React)  │ ◄─────────────────── │ serves the SPA│ ◄───────── │ (:4000, dockerode) │ ◄────────────── │               │
└──────────┘                      └───────────────┘            └────────────────────┘                 └───────────────┘
```

- The React app polls the REST API for container lists and stats, and opens a WebSocket per selected container for logs.
- nginx serves the built frontend and proxies `/containers`, `/health` and `/ws/` to the backend, so the browser only ever talks to one origin.
- The backend uses `dockerode` to talk to the local Docker Engine through the Docker socket.

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose
- Node.js 20+ (only needed for local development without Docker)

### Option 1: Docker Compose (recommended)

```bash
git clone https://github.com/premrahi/Drozzle.git
cd Drozzle
docker compose up --build
```

Then open **http://localhost**.

### Option 2: Run locally for development

Run the backend and frontend in two terminals:

```bash
# Terminal 1: backend  →  http://localhost:4000
cd server
npm install
npm run dev
```

```bash
# Terminal 2: frontend  →  http://localhost:5173
cd client
npm install
npm run dev
```

> When the backend runs outside Docker, `dockerode` connects to the local Docker daemon using its default settings: `/var/run/docker.sock` on Linux/macOS and the `//./pipe/docker_engine` named pipe on Windows.

### Available scripts

| Where | Command | What it does |
| --- | --- | --- |
| `server/` | `npm run dev` | Start the backend with hot reload (`tsx watch`) |
| `server/` | `npm run build` / `npm start` | Compile TypeScript and run the compiled server |
| `server/` | `npm run typecheck` | Type-check without emitting files |
| `client/` | `npm run dev` | Start the Vite dev server |
| `client/` | `npm run build` | Type-check and create a production build |
| `client/` | `npm run preview` | Preview the production build |

## ⚙️ Configuration

| Variable | Where | Default | Description |
| --- | --- | --- | --- |
| `PORT` | server | `4000` | Port the backend listens on |
| `VITE_API_URL` | client (build time) | `http://localhost:4000` | Base URL for the REST API. The Docker image sets it to an empty string so requests go through nginx on the same origin |
| `VITE_WS_URL` | client | _unset_ | Optional override for the log WebSocket base URL, e.g. `ws://localhost:4000` |

For local development with a non-default backend address, create `client/.env.local`:

```env
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000
```

## 📡 API Reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Backend health check |
| `GET` | `/containers` | List all containers (running and stopped) |
| `GET` | `/containers/:id/stats` | One-shot CPU / memory / network snapshot |
| `POST` | `/containers/:id/start` | Start a container |
| `POST` | `/containers/:id/stop` | Stop a container |
| `POST` | `/containers/:id/restart` | Restart a container |
| `WS` | `/ws/logs/:id` | Live log stream (last 100 lines, then follows) |

Example `GET /containers/:id/stats` response (values are illustrative):

```json
{
  "cpuPercent": 1.42,
  "memUsageMB": 53.8,
  "memLimitMB": 7861.3,
  "memPercent": 0.68,
  "networkRxBytes": 1048576,
  "networkTxBytes": 524288,
  "packetsDroppedIn": 0,
  "packetsDroppedOut": 0
}
```

## 🔍 How It Works

- **Stats:** Docker returns raw counters, so the backend turns them into usable numbers. CPU % is `(cpuDelta / systemDelta) × online CPUs × 100`, memory % is `usage / limit`, and network and dropped-packet counters are summed across all of a container's interfaces.
- **Logs:** The backend upgrades `/ws/logs/:id` to a WebSocket, attaches to the container's log stream (stdout + stderr, timestamps, last 100 lines, follow mode) and pipes each chunk to the browser. The stream is destroyed when the socket closes. The UI keeps the latest 500 lines and lets you filter them.
- **Polling:** The container list refreshes every 5 seconds and stats for each running container every 3 seconds. Charts show a rolling window of the latest 24 samples for the selected container.
- **Frontend structure:** `api.ts` holds all HTTP/WebSocket communication, and the `useMonitoring` hook owns polling, the selected container, history and container actions, so components only receive data and callbacks.

## 📁 Project Structure

```
Drozzle/
├── docker-compose.yml
├── client/                        # React + TypeScript frontend
│   ├── Dockerfile
│   ├── nginx.conf                 # serves the SPA, proxies API + WebSocket to the backend
│   ├── vite.config.ts
│   └── src/
│       ├── api.ts                 # all HTTP + WebSocket communication
│       ├── App.tsx
│       ├── hooks/
│       │   ├── useMonitoring.ts   # polling, selection, history, container actions
│       │   └── useTheme.ts        # dark / light theme
│       └── components/
│           ├── common/            # shared UI pieces and error boundary
│           ├── landing/           # landing page
│           └── dashboard/         # dashboard layout, charts, tables, logs
└── server/                        # Express + dockerode backend
    ├── Dockerfile
    └── src/
        ├── server.ts              # Express app + HTTP server
        ├── dockerServices.ts      # Docker Engine calls and stats calculations
        ├── types.ts
        ├── routes/
        │   └── containers.ts      # REST endpoints
        └── webSockets/
            └── logs.ts            # live log streaming
```

## 🔒 Security Note

Drozzle controls Docker through the mounted Docker socket and currently has **no authentication**. Anyone who can reach the app can start, stop and restart containers. Run it locally or on a trusted network, and don't expose it to the public internet without putting authentication in front of it.

## 🚧 Current Limitations & Roadmap

- **Networks** and **Volumes** pages are placeholders; the backend endpoints for them aren't built yet
- The time-range selector, **Configure** menu and **New Panel** dialog are UI-only for now
- Metric history lives in the browser and resets on reload

Ideas for next steps: Networks and Volumes endpoints, persistent metrics history, health alerts, authentication, and automated tests.

## 👤 Author

**Prem Rahi**: [GitHub @premrahi](https://github.com/premrahi)

If you find Drozzle useful, a ⭐ on the repo is appreciated, and feedback or suggestions are very welcome.
