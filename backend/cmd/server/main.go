package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Ab-hinav/money-manager/internal/api"
	"github.com/Ab-hinav/money-manager/internal/config"
	"github.com/joho/godotenv"
)

func main() {
	// 0. Load .env (Local Development)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found (using system env)")
	}

	// 1. Connect to DB
	db := config.ConnectDB()
	defer db.Close()

	// 4. Initialize Chi Router
	router := api.NewRouter(db)

	// 5. Start Server
	fmt.Println("Server starting on port 8080...")
	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
