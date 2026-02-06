## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-10-26 - Wildcard CORS Configuration
**Vulnerability:** The Chi router was configured with `AllowedOrigins: []string{"https://*"}`.
**Learning:** Wildcards in CORS configurations (`https://*`) allow any HTTPS origin to make requests to the API, defeating the purpose of Cross-Origin Resource Sharing restrictions and exposing the API to CSRF-like attacks from malicious sites.
**Prevention:** Always use an allowlist for origins. For development, default to localhost. For production, configure allowed origins via environment variables (e.g., `CORS_ALLOWED_ORIGINS`).
