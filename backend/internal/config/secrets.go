package config

import (
	"log"
	"os"
)

// GetJWTKey retrieves the JWT secret from the environment.
// It fails securely by terminating the application if the secret is missing.
func GetJWTKey() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatal("FATAL: JWT_SECRET environment variable is not set. Exiting.")
	}
	return []byte(secret)
}
