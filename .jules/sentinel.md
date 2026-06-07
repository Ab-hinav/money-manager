## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2024-05-24 - JWT Algorithm Confusion Vulnerability in Middleware
**Vulnerability:** The JWT parsing mechanism in `AuthMiddleware` did not check the signing algorithm in the token header, leaving it vulnerable to algorithm confusion attacks where an attacker could forge a token with `"alg": "none"` or using the public key with `"alg": "HS256"`.
**Learning:** `jwt.ParseWithClaims` does not automatically validate the signing method against a required set of algorithms, and developers must explicitly verify `token.Method` in the `Keyfunc`.
**Prevention:** Always verify `token.Method` inside the `Keyfunc` callback (e.g., using type assertion to `*jwt.SigningMethodHMAC` or checking `token.Method.Alg()`) before returning the secret key.
