## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2026-02-15 - JWT Algorithm Confusion Vulnerability
**Vulnerability:** The JWT verification middleware used `jwt.ParseWithClaims` without verifying the signing method in the `Keyfunc`.
**Learning:** `golang-jwt` library does not automatically enforce algorithm matching unless explicitly checked in the `Keyfunc`. This allows attackers to potentially bypass authentication if they can force algorithm confusion (e.g. using `RS256` but verifying with the HMAC secret).
**Prevention:** Always verify `token.Method` matches the expected signing method (e.g. `*jwt.SigningMethodHMAC`) inside the `Keyfunc` callback.
