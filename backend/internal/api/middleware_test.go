package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestAuthMiddleware(t *testing.T) {
	// Set up environment variable for JWT secret
	t.Setenv("JWT_SECRET", "supersecretkey")

	// Create a dummy handler to wrap with middleware
	dummyHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// Create the middleware
	middleware := AuthMiddleware(dummyHandler)

	t.Run("Valid Token", func(t *testing.T) {
		// Create a valid token
		claims := &Claims{
			Email:  "test@example.com",
			UserID: 1,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
			},
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString([]byte("supersecretkey"))
		if err != nil {
			t.Fatalf("Failed to sign token: %v", err)
		}

		req := httptest.NewRequest("GET", "/", nil)
		req.Header.Set("Authorization", "Bearer "+tokenString)
		rr := httptest.NewRecorder()

		middleware.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Expected status OK, got %v", rr.Code)
		}
	})

	t.Run("Invalid Token", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/", nil)
		req.Header.Set("Authorization", "Bearer invalidtoken")
		rr := httptest.NewRecorder()

		middleware.ServeHTTP(rr, req)

		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected status Unauthorized, got %v", rr.Code)
		}
	})

	t.Run("No Token", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/", nil)
		rr := httptest.NewRecorder()

		middleware.ServeHTTP(rr, req)

		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected status Unauthorized, got %v", rr.Code)
		}
	})

    // This test ensures that we are checking the signing method.
    // Even if the token is validly signed with another algorithm (which is hard to forge without the key),
    // we want to ensure the code explicitly checks for HMAC.
    // For this test, we'll try to use 'none' alg if possible, or just rely on the code review aspect
    // since forging a valid signature with a different alg and the same secret is tricky/impossible for some combos.
    // However, we can test that the middleware REJECTS 'none' alg tokens.
    t.Run("None Algorithm Token", func(t *testing.T) {
        token := jwt.New(jwt.SigningMethodNone)
        // We need to provide claims or it might fail on structure
        claims := token.Claims.(jwt.MapClaims)
        claims["email"] = "hacker@example.com"
        claims["user_id"] = 666
        claims["exp"] = time.Now().Add(time.Hour).Unix()

        // SignedString with UnsafeAllowNoneSignatureType is needed for jwt-go v5 to sign 'none'
        tokenString, err := token.SignedString(jwt.UnsafeAllowNoneSignatureType)
        if err != nil {
            t.Fatalf("Failed to sign none token: %v", err)
        }

        req := httptest.NewRequest("GET", "/", nil)
        req.Header.Set("Authorization", "Bearer "+tokenString)
        rr := httptest.NewRecorder()

        middleware.ServeHTTP(rr, req)

        // It should be unauthorized
        if rr.Code != http.StatusUnauthorized {
            t.Errorf("Expected status Unauthorized for 'none' alg, got %v", rr.Code)
        }
    })
}
