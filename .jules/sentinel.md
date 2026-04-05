## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-02-23 - JWT Algorithm Confusion Vulnerability
**Vulnerability:** The `jwt.ParseWithClaims` function in `backend/internal/api/middleware.go` did not explicitly type-check the token's signing method. This allowed an attacker to tamper with the `alg` header (e.g., setting it to "none" or using an asymmetric key algorithm with a symmetric key) to forge tokens and bypass authentication.
**Learning:** Always explicitly verify the `*jwt.SigningMethodHMAC` (or whatever algorithm is expected) type in the `ParseWithClaims` key function to prevent JWT Algorithm Confusion.
**Prevention:** Include a type assertion `if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok` inside the key callback to ensure the token was signed with the expected algorithm.
