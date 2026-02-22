package api

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/Ab-hinav/money-manager/internal/config"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Email    string `json:"email"`
	UserID   int    `json:"user_id"`
	FamilyID *int   `json:"family_id,omitempty"`
	jwt.RegisteredClaims
}

// AuthMiddleware validates the Bearer Token from the Header
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1. Get Token from Header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized: No token provided", http.StatusUnauthorized)
			return
		}

		// 2. Remove "Bearer " prefix
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenStr == authHeader { // No "Bearer " prefix found
			http.Error(w, "Unauthorized: Invalid token format", http.StatusUnauthorized)
			return
		}

		// 3. Parse & Validate Token
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			// Validate the alg is what you expect:
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return config.GetJWTKey(), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
			return
		}

		// 4. Inject User info into Context
		ctx := context.WithValue(r.Context(), "user_id", claims.UserID)
		ctx = context.WithValue(ctx, "email", claims.Email)
		if claims.FamilyID != nil {
			ctx = context.WithValue(ctx, "family_id", *claims.FamilyID)
		}

		// 5. Pass to next handler
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
