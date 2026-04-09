package config

import (
	"log"
	"os"
	"sync"
)

var (
	jwtKey  []byte
	jwtOnce sync.Once
)

// GetJWTKey retrieves the JWT_SECRET from the environment.
// It ensures the key is not empty to prevent insecure token signing.
func GetJWTKey() []byte {
	jwtOnce.Do(func() {
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			// Critical security failure: Do not allow operation without a secret.
			// Panic will be caught by middleware.Recoverer, returning 500 to client.
			log.Println("CRITICAL: JWT_SECRET is not set in environment")
			panic("JWT_SECRET is not set")
		}
		jwtKey = []byte(secret)
	})

	// Ensure that if the first call panicked (and was recovered), subsequent calls also panic.
	if len(jwtKey) == 0 {
		log.Println("CRITICAL: JWT_SECRET is not set in environment")
		panic("JWT_SECRET is not set")
	}

	return jwtKey
}
