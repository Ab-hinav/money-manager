package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/Ab-hinav/money-manager/internal/config"
	"github.com/golang-jwt/jwt/v5"
)

func TestAuthMiddlewareJWTAlgorithmConfusion(t *testing.T) {
	// Set a dummy secret key for testing
	t.Setenv("JWT_SECRET", "dummy_secret_for_testing")

	// Create a valid HMAC token
	claims := &Claims{
		Email:  "test@example.com",
		UserID: 1,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	validTokenStr, err := token.SignedString(config.GetJWTKey())
	if err != nil {
		t.Fatalf("Failed to create token: %v", err)
	}

	// Create an RSA token (Simulating None or asymmetric alg confusion)
	rsaToken := jwt.NewWithClaims(jwt.SigningMethodNone, claims)
	invalidAlgTokenStr, err := rsaToken.SignedString(jwt.UnsafeAllowNoneSignatureType)
	if err != nil {
		t.Fatalf("Failed to create unsecure token: %v", err)
	}

	tests := []struct {
		name       string
		token      string
		wantStatus int
	}{
		{
			name:       "Valid HMAC token",
			token:      validTokenStr,
			wantStatus: http.StatusOK,
		},
		{
			name:       "Invalid None Alg token",
			token:      invalidAlgTokenStr,
			wantStatus: http.StatusUnauthorized,
		},
	}

	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	handler := AuthMiddleware(nextHandler)

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			req, err := http.NewRequest("GET", "/", nil)
			if err != nil {
				t.Fatalf("Failed to create request: %v", err)
			}
			if tc.token != "" {
				req.Header.Set("Authorization", "Bearer "+tc.token)
			}

			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)

			if rr.Code != tc.wantStatus {
				t.Errorf("Expected status %v, got %v", tc.wantStatus, rr.Code)
			}
		})
	}
}
