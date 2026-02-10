package api

import (
	"database/sql"
	"net/http"

	"github.com/Ab-hinav/money-manager/internal/api/controllers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func NewRouter(db *sql.DB) *chi.Mux {
	r := chi.NewRouter()

	// 1. Global Middlewares
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	// Enable GZIP compression for responses
	r.Use(middleware.Compress(5))
	r.Use(cors.Handler(cors.Options{
		// Allow Next.js (port 3000) and your CloudFront URL
		AllowedOrigins:   []string{"http://localhost:3000", "http://money-manager-frontend:80"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// 2. Initialize Handlers
	authHandler := &controllers.AuthHandler{DB: db}
	addTransactionHandler := &controllers.AddTransactionHandler{DB: db}
	familyHandler := &controllers.FamilyHandler{DB: db}
	dashboardHandler := &controllers.DashboardHandler{DB: db}
	goalHandler := &controllers.GoalHandler{DB: db}

	// 3. API Routes
	r.Route("/api", func(r chi.Router) {

		// --- PUBLIC ROUTES (No Token Needed) ---
		r.Group(func(r chi.Router) {
			r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
				w.Write([]byte("Backend is Healthy"))
			})
			r.Post("/login", authHandler.Login)
			r.Post("/signup", authHandler.Signup)
			// Auth endpoints
		})

		// --- PROTECTED ROUTES (Token Required) ---
		r.Group(func(r chi.Router) {
			r.Use(AuthMiddleware) // <--- Gatekeeper applied here

			r.Get("/categories", addTransactionHandler.GetCategoriesData)

			r.Route("/family", func(r chi.Router) {
				r.Get("/", familyHandler.GetFamilyData)
				r.Post("/", familyHandler.CreateFamily)
			})

			r.Route("/goals", func(r chi.Router) {
				r.Get("/", goalHandler.GetGoals)
				r.Post("/", goalHandler.CreateGoal)
			})

			// Dashboard
			r.Route("/dashboard", func(r chi.Router) {
				// We can access user info from context now

				r.Get("/total-income", dashboardHandler.GetTotalIncome)
				r.Get("/total-expenses", dashboardHandler.GetTotalExpenses)
				r.Get("/total-savings", dashboardHandler.GetTotalSavings)
				r.Get("/total-loans", dashboardHandler.GetTotalLoans)
				r.Get("/total-balance", dashboardHandler.GetTotalBalance)
				r.Get("/total-investment", dashboardHandler.GetTotalInvestments)
				// TODO: Fetch real data for this user

			})

			// Transactions
			r.Route("/transactions", func(r chi.Router) {
				r.Get("/", func(w http.ResponseWriter, r *http.Request) {
					w.Write([]byte("List all transactions"))
				})
				r.Post("/", addTransactionHandler.AddTransaction)
			})
		})
	})

	return r
}
