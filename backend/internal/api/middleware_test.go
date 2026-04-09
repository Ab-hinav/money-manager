package api

import (
	"crypto/rand"
	"crypto/rsa"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/Ab-hinav/money-manager/internal/config"
	"github.com/golang-jwt/jwt/v5"
)

func TestAuthMiddleware_AlgorithmCheck(t *testing.T) {
	// Setup Environment for Test
	t.Setenv("JWT_SECRET", "testsecret")

	// Helper to create token
	createToken := func(method jwt.SigningMethod, secret interface{}) string {
		claims := &Claims{
			Email:  "test@example.com",
			UserID: 1,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
			},
		}
		token := jwt.NewWithClaims(method, claims)
		str, err := token.SignedString(secret)
		if err != nil {
			t.Fatalf("Failed to sign token: %v", err)
		}
		return str
	}

	// 1. Valid HS256 Token
	validToken := createToken(jwt.SigningMethodHS256, config.GetJWTKey())

	// 2. Invalid Algorithm (RS256)
	// We generate a valid RSA key pair, sign with private key.
	// The middleware will try to verify with the symmetric secret (GetJWTKey), which should fail.
	// However, without the algorithm check, it might fail with "invalid key type" error inside the library.
	// With the algorithm check, it fails explicitly because of the method mismatch.
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		t.Fatalf("Failed to generate RSA key: %v", err)
	}
	invalidAlgoToken := createToken(jwt.SigningMethodRS256, privateKey)

	tests := []struct {
		name           string
		token          string
		expectedStatus int
	}{
		{"Valid Token (HS256)", validToken, http.StatusOK},
		{"Invalid Algo Token (RS256)", invalidAlgoToken, http.StatusUnauthorized},
		{"No Token", "", http.StatusUnauthorized},
		{"Invalid Format", "InvalidToken", http.StatusUnauthorized},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Mock Handler
			nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
			})

			req := httptest.NewRequest("GET", "/", nil)
			if tt.token != "" {
				req.Header.Set("Authorization", "Bearer "+tt.token)
			}

			rr := httptest.NewRecorder()
			handler := AuthMiddleware(nextHandler)
			handler.ServeHTTP(rr, req)

			if status := rr.Code; status != tt.expectedStatus {
				t.Errorf("handler returned wrong status code: got %v want %v",
					status, tt.expectedStatus)
			}
		})
	}
}
