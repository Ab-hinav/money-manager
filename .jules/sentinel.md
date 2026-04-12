## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-02-23 - JWT Algorithm Confusion Vulnerability
**Vulnerability:** `jwt.ParseWithClaims` was used without validating the JWT signing method, exposing the application to JWT algorithm confusion attacks.
**Learning:** In Go using `golang-jwt/jwt`, the callback function in `ParseWithClaims` must explicitly check the token's signing method. If it doesn't, an attacker could forge a token by changing the `alg` header (e.g., to `none` or using a public key for HMAC).
**Prevention:** Always verify the `*jwt.SigningMethodHMAC` type (or the specific expected signing method) in the `ParseWithClaims` key function before returning the secret key.
