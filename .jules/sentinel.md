## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-02-23 - JWT Algorithm Confusion Vulnerability
**Vulnerability:** The application was vulnerable to JWT algorithm confusion attacks because the `token.Method` was not explicitly verified inside the `Keyfunc` of `jwt.ParseWithClaims`. An attacker could potentially change the algorithm (e.g., to "none" or HMAC using a public key) to forge valid tokens.
**Learning:** Always verify the expected signing algorithm type (e.g., `*jwt.SigningMethodHMAC`) in the key function when using `golang-jwt/jwt/v5` to ensure tokens are signed with the expected method.
**Prevention:** Explicitly type assert `token.Method` in `jwt.ParseWithClaims`'s keyfunc to verify it matches the expected algorithm before returning the secret key.
