## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-02-23 - Missing Tenant Isolation in Analytical Queries
**Vulnerability:** A critical Cross-Tenant Data Leak (IDOR variant) existed in `GetTotalExpenses` where the monthly aggregation SQL query omitted the `user_id` filter.
**Learning:** Analytical and time-series aggregation queries (like fetching monthly data points) are often written differently than standard CRUD operations and may easily miss tenant isolation filters. Here, the query fetched expenses for ALL users instead of just the authenticated user.
**Prevention:** Always ensure that `user_id` (tenant ID) filtering is explicitly present in the `WHERE` clause for every query executed in a multi-tenant application, even for aggregations and summary data.
