package config

import (
	"log"
	"os"
	"strconv"
	"sync"
)

var (
	jwtExpiry     int
	jwtExpiryOnce sync.Once
)

// GetJWTKey retrieves the JWT_SECRET from the environment.
// It ensures the key is not empty to prevent insecure token signing.
func GetJWTKey() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		// Critical security failure: Do not allow operation without a secret.
		// Panic will be caught by middleware.Recoverer, returning 500 to client.
		log.Println("CRITICAL: JWT_SECRET is not set in environment")
		panic("JWT_SECRET is not set")
	}
	return []byte(secret)
}

// GetJWTExpiry retrieves the JWT_EXPIRY from the environment, defaulting to 6 if not set or invalid.
// It uses sync.Once to cache the value.
func GetJWTExpiry() int {
	jwtExpiryOnce.Do(func() {
		valStr := os.Getenv("JWT_EXPIRY")
		if valStr == "" {
			jwtExpiry = 6
			return
		}
		val, err := strconv.Atoi(valStr)
		if err != nil {
			jwtExpiry = 6
			return
		}
		jwtExpiry = val
	})
	return jwtExpiry
}

// ResetJWTExpiry resets the cached JWT expiry for testing purposes.
func ResetJWTExpiry() {
	jwtExpiryOnce = sync.Once{}
}
