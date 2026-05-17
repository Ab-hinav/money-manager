## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-02-24 - JWT Algorithm Confusion Vulnerability
**Vulnerability:** The JWT validation in `middleware.go` failed to verify the signing method algorithm (`alg` header), allowing for Algorithm Confusion attacks.
**Learning:** `golang-jwt/jwt`'s `ParseWithClaims` function does not enforce the signing method automatically. If a malicious user changes the `alg` to "none" or another unexpected type (e.g., using a public key as HMAC secret), the token can be verified improperly if the explicit type check is omitted.
**Prevention:** Always verify the type of the `token.Method` explicitly inside the key function in `jwt.ParseWithClaims` to ensure it matches the expected algorithm (e.g., `*jwt.SigningMethodHMAC`).
