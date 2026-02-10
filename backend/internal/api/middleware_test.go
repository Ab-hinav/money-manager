package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestAuthMiddleware(t *testing.T) {
	// Set the secret key for testing
	t.Setenv("JWT_SECRET", "test-secret")

	// Create a mock handler that will be wrapped by AuthMiddleware
	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Authorized"))
	})

	handler := AuthMiddleware(nextHandler)

	t.Run("Valid Token", func(t *testing.T) {
		// Create a valid token signed with HS256
		claims := &Claims{
			Email:  "test@example.com",
			UserID: 1,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
			},
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString([]byte("test-secret"))
		if err != nil {
			t.Fatalf("Failed to sign token: %v", err)
		}

		req := httptest.NewRequest("GET", "/", nil)
		req.Header.Set("Authorization", "Bearer "+tokenString)
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Expected 200 OK, got %v body: %s", rr.Code, rr.Body.String())
		}
	})

	t.Run("Token with None Algorithm", func(t *testing.T) {
		// Create a token with "none" algorithm
		claims := &Claims{
			Email:  "attacker@example.com",
			UserID: 1,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
			},
		}
		token := jwt.NewWithClaims(jwt.SigningMethodNone, claims)
		// For None algorithm, key is jwt.UnsafeAllowNoneSignatureType
		tokenString, err := token.SignedString(jwt.UnsafeAllowNoneSignatureType)
		if err != nil {
			t.Fatalf("Failed to sign none token: %v", err)
		}

		req := httptest.NewRequest("GET", "/", nil)
		req.Header.Set("Authorization", "Bearer "+tokenString)
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		// With current implementation (missing check), golang-jwt v5 might reject it by default?
		// Or if we fix it, we ensure it rejects it.
		// We expect 401.
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected 401 Unauthorized for None algorithm, got %v", rr.Code)
		}
	})

	t.Run("Token with Wrong Key", func(t *testing.T) {
		claims := &Claims{
			Email:  "test@example.com",
			UserID: 1,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
			},
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString([]byte("wrong-secret"))
		if err != nil {
			t.Fatalf("Failed to sign token: %v", err)
		}

		req := httptest.NewRequest("GET", "/", nil)
		req.Header.Set("Authorization", "Bearer "+tokenString)
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected 401 Unauthorized for wrong key, got %v", rr.Code)
		}
	})
}
