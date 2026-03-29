## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-02-17 - JWT Algorithm Confusion Vulnerability
**Vulnerability:** The backend `AuthMiddleware` parsed JWTs using `jwt.ParseWithClaims` without explicitly validating that the `SigningMethod` matched the expected algorithm (`*jwt.SigningMethodHMAC`). This allows an attacker to create a token signed with the `none` algorithm, or modify the algorithm to `HS256` and use a publicly available RSA or ECDSA public key as the secret, successfully bypassing authentication.
**Learning:** The `golang-jwt` library requires manual validation of the expected signing algorithm inside the `Keyfunc` callback. Failing to do so blindly trusts the `alg` header controlled by the client.
**Prevention:** Always verify the type of `token.Method` (e.g., `if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok { return nil, jwt.ErrSignatureInvalid }`) before returning the secret key in the `Keyfunc`.
