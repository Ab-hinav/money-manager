package api

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/Ab-hinav/money-manager/internal/config"
	"github.com/golang-jwt/jwt/v5"
)

func TestAuthMiddleware(t *testing.T) {
	// Setup Secret
	os.Setenv("JWT_SECRET", "testsecret")
	// Clean up environment variable after test
	t.Cleanup(func() {
		os.Unsetenv("JWT_SECRET")
	})

	// Helper to generate token
	genToken := func(method jwt.SigningMethod, claims jwt.Claims) string {
		token := jwt.NewWithClaims(method, claims)

		var key interface{}
		if method == jwt.SigningMethodNone {
			key = jwt.UnsafeAllowNoneSignatureType
		} else {
			key = config.GetJWTKey()
		}

		s, _ := token.SignedString(key)
		return s
	}

	tests := []struct {
		name           string
		tokenString    string
		expectedStatus int
	}{
		{
			name: "Valid HS256 Token",
			tokenString: func() string {
				claims := &Claims{
					Email: "test@example.com",
					UserID: 1,
					RegisteredClaims: jwt.RegisteredClaims{
						ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
					},
				}
				return genToken(jwt.SigningMethodHS256, claims)
			}(),
			expectedStatus: http.StatusOK,
		},
		{
			name: "None Algorithm Token",
			tokenString: func() string {
				claims := &Claims{
					Email: "test@example.com",
					UserID: 1,
					RegisteredClaims: jwt.RegisteredClaims{
						ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
					},
				}
				return genToken(jwt.SigningMethodNone, claims)
			}(),
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name: "No Token",
			tokenString: "",
			expectedStatus: http.StatusUnauthorized,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req, _ := http.NewRequest("GET", "/", nil)
			if tt.tokenString != "" {
				req.Header.Set("Authorization", "Bearer "+tt.tokenString)
			}

			rr := httptest.NewRecorder()

			// Dummy handler
			nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
			})

			AuthMiddleware(nextHandler).ServeHTTP(rr, req)

			if status := rr.Code; status != tt.expectedStatus {
				t.Errorf("handler returned wrong status code: got %v want %v",
					status, tt.expectedStatus)
			}
		})
	}
}
