package api

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/Ab-hinav/money-manager/internal/config"
)

func TestAuthMiddleware(t *testing.T) {
	os.Setenv("JWT_SECRET", "testsecret")
	defer os.Unsetenv("JWT_SECRET")

	secret := config.GetJWTKey()

	// 1. Valid HMAC Token
	validToken := jwt.NewWithClaims(jwt.SigningMethodHS256, &Claims{
		Email:  "test@example.com",
		UserID: 1,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	})
	validTokenStr, _ := validToken.SignedString(secret)

	// 2. Token with "none" algorithm (Algorithm Confusion)
	noneToken := jwt.Token{
		Header: map[string]interface{}{
			"alg": "none",
			"typ": "JWT",
		},
		Claims: &Claims{
			Email:  "hacker@example.com",
			UserID: 1,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
			},
		},
		Method: jwt.SigningMethodNone,
	}
	noneTokenStr, _ := noneToken.SignedString(jwt.UnsafeAllowNoneSignatureType)

	// Test Handler
	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})
	middlewareHandler := AuthMiddleware(nextHandler)

	tests := []struct {
		name         string
		token        string
		expectedCode int
	}{
		{
			name:         "Valid Token",
			token:        "Bearer " + validTokenStr,
			expectedCode: http.StatusOK,
		},
		{
			name:         "Algorithm Confusion (none alg)",
			token:        "Bearer " + noneTokenStr,
			expectedCode: http.StatusUnauthorized,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", "/test", nil)
			req.Header.Set("Authorization", tt.token)

			rr := httptest.NewRecorder()
			middlewareHandler.ServeHTTP(rr, req)

			if rr.Code != tt.expectedCode {
				t.Errorf("expected status %v, got %v", tt.expectedCode, rr.Code)
			}
		})
	}
}
