## Local Setup

Prereqs:
- Node.js 18+
- MongoDB (Atlas or local)

Steps:
1. Copy `backend/.env.example` to `backend/.env` and fill values
2. Install deps in both apps
```bash
cd backend && npm i
cd ../frontend && npm i
```
3. Start backend
```bash
cd backend && npm run dev
```
4. Start frontend
```bash
cd frontend && npm run dev
```

Environment:
- Backend: PORT=4000 (default)
- Frontend: Vite dev on 5173 (default)
