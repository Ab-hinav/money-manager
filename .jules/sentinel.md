## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-02-23 - JWT Algorithm Confusion Vulnerability
**Vulnerability:** JWT parsing in `AuthMiddleware` did not verify the signing algorithm before returning the signing key, making it susceptible to JWT Algorithm Confusion attacks (where an attacker signs a token with "none" or uses the public key as an HMAC secret).
**Learning:** The `jwt-go` and `golang-jwt` libraries require explicit verification of `token.Method` inside the `Keyfunc` callback. Failing to do so bypasses cryptographic integrity checks if the attacker alters the `alg` header in the JWT.
**Prevention:** Always explicitly check `token.Method` with a type assertion (e.g., `_, ok := token.Method.(*jwt.SigningMethodHMAC)`) to ensure the token was signed with the expected algorithm before providing the key material.
