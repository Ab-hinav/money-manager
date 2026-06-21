## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.
## 2025-02-20 - [JWT Algorithm Confusion]
**Vulnerability:** In Go, the JWT `Keyfunc` callback provided to `jwt.ParseWithClaims` wasn't verifying `token.Method` which could allow Algorithm Confusion vulnerability where an attacker manipulates the JWT header.
**Learning:** Always explicitly verify `token.Method` inside the `Keyfunc` block, validating it against the expected JWT signing algorithm (e.g. `*jwt.SigningMethodHMAC`).
**Prevention:** Use a type assertion (like `if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok`) inside `Keyfunc` to return an error when methods don't match, preventing algorithm manipulation.
