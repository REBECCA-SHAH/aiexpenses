# Design Notes

- Stack: React (Vite) + Express + MongoDB
- Auth: JWT in Authorization header, 7d expiry, password hashing with bcrypt
- Models: `User`, `Expense` with enum category, boolean `isRecurring`, calculated `totalWithTax`
- Pagination: query `page`/`limit` with defaults (10, cap 50)
- Filtering: category, recurring; Search: `title` regex; Sorting: `createdAt`, `amount`, `spentAt`, `title`
- AI: Endpoint `/api/ai/suggest-category` using Gemini 1.5 Flash; backend only, frontend invokes via API
- Security: CORS locked to credentials true; server-side validation; user scoping by `userId`
- OOP/Modularity: routes, middleware, models separated; small API client on frontend encapsulates fetch/token
