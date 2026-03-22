## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-02-23 - JWT Algorithm Confusion Prevention
**Vulnerability:** The JWT validation logic in `AuthMiddleware` parsed claims without explicitly verifying the signing method used by the token. This could potentially allow an attacker to use a token signed with a different algorithm (e.g., using "none" or asymmetric algorithms with symmetric keys), leading to an algorithm confusion vulnerability.
**Learning:** `golang-jwt/jwt/v5` requires the user-provided key function to validate the `token.Method`. Without this validation, the library blindly relies on the algorithm specified in the unverified token header.
**Prevention:** Always verify `token.Method` inside the `jwt.ParseWithClaims` key function (e.g., by ensuring it matches the expected `*jwt.SigningMethodHMAC` for symmetric signatures) before returning the secret key.
