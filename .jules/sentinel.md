## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-02-23 - JWT Algorithm Confusion
**Vulnerability:** The `jwt.ParseWithClaims` key function returned the symmetric key without verifying `token.Method.(*jwt.SigningMethodHMAC)`. An attacker could forge tokens by setting the algorithm to `none` or using an asymmetric key's public key as the symmetric secret (`HS256`).
**Learning:** Always explicitly verify the token's `SigningMethod` type inside the `Keyfunc` callback of `jwt.ParseWithClaims`, especially when returning a symmetric secret. The `golang-jwt` library relies on this callback to ensure the correct algorithm was used.
**Prevention:** Add `if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok { return nil, jwt.ErrSignatureInvalid }` to the key function for HMAC signed tokens.
