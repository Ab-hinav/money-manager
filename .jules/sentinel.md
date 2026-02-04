## 2026-02-04 - [Go Global Init vs .env Loading]
**Vulnerability:** `JWT_SECRET` was read into a global variable (`var jwtKey = os.Getenv(...)`) at package initialization time.
**Learning:** In Go, package-level variables are initialized before `main()` starts. Since `godotenv.Load()` is typically called in `main()`, any environment variables defined in `.env` are NOT yet available during global variable initialization. This resulted in `jwtKey` being empty (insecure) even if `JWT_SECRET` was present in `.env`.
**Prevention:** Avoid initializing configuration-dependent global variables. Use functions (lazy loading) or an explicit `InitConfig()` called from `main()` after loading environment variables. Always validate that critical secrets are not empty.
