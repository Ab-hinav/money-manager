## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2026-02-22 - Missing JWT Algorithm Verification
**Vulnerability:** The `AuthMiddleware` parsed JWTs using `jwt.ParseWithClaims` without verifying the signing algorithm in the key function. This exposed the application to algorithm confusion attacks (e.g., using `none` alg or HMAC/RSA confusion).
**Learning:** Even when using a type-safe language like Go, specific libraries like `golang-jwt` require explicit algorithm verification inside the `Keyfunc`. Relying on defaults or assuming the library handles it can lead to critical bypasses.
**Prevention:** Always check `token.Method` inside the `Keyfunc` callback of `jwt.Parse` functions to ensure it matches the expected signing method (e.g., `*jwt.SigningMethodHMAC`).
