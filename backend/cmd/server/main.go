package main

import (
	"log"
	"net/http"

	"github.com/Ab-hinav/money-manager/internal/config"
	"github.com/Ab-hinav/money-manager/internal/models"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// 1. Connect to DB
	db := config.ConnectDB()
	defer db.Close()

	// 2. Setup Router
	mux := http.NewServeMux()

	// Health Check
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Backend is Healthy & DB Connected! "))
	})

	// Login Placeholder
	mux.HandleFunc("/api/login", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Login Endpoint Coming Soon"))
	})

	// 3. Run Migrations & Seed Data
	models.RunMigrations(db)
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	models.CreateTestUser(db, "Admin User", "admin@example.com", string(hash))

	// 4. Start
	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Printf("Server failed: %s\n", err)
	}
}
