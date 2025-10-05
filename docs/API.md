# API

- Swagger UI: `/api/docs`
- Auth: `Authorization: Bearer <token>` for protected endpoints

Examples (PowerShell):

```powershell
# Register
curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"username":"u1","email":"u1@x.com","password":"pass"}'

# Login
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"username":"u1","password":"pass"}'

# List expenses
$token = "<JWT>"
curl -H "Authorization: Bearer $token" http://localhost:4000/api/expenses?page=1&limit=10
```
