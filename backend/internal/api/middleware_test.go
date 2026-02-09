package api

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestAuthMiddleware(t *testing.T) {
	// Setup JWT_SECRET for test
	os.Setenv("JWT_SECRET", "test-secret")
	defer os.Unsetenv("JWT_SECRET")

	// Create a valid token
	validClaims := jwt.MapClaims{
		"user_id": 1.0,
		"email":   "test@example.com",
		"exp":     time.Now().Add(time.Hour).Unix(),
	}
	validToken := jwt.NewWithClaims(jwt.SigningMethodHS256, validClaims)
	validTokenString, _ := validToken.SignedString([]byte("test-secret"))

	// Create a token with 'none' algorithm
	noneToken := jwt.NewWithClaims(jwt.SigningMethodNone, validClaims)
	// We have to use UnsafeAllowNoneSignatureType otherwise SignedString fails
	noneTokenString, _ := noneToken.SignedString(jwt.UnsafeAllowNoneSignatureType)

	tests := []struct {
		name           string
		token          string
		expectedStatus int
	}{
		{"Valid Token", validTokenString, http.StatusOK},
		{"No Token", "", http.StatusUnauthorized},
		{"Invalid Token", "invalid-token", http.StatusUnauthorized},
		{"None Algorithm Token", noneTokenString, http.StatusUnauthorized}, // Should fail if fix is applied
	}

	handler := AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", "/", nil)
			if tt.token != "" {
				req.Header.Set("Authorization", "Bearer "+tt.token)
			}
			rec := httptest.NewRecorder()
			handler.ServeHTTP(rec, req)

			if rec.Code != tt.expectedStatus {
				t.Errorf("handler returned wrong status code: got %v want %v", rec.Code, tt.expectedStatus)
			}
		})
	}
}
