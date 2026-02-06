package config

import (
	"os"
	"testing"
)

func TestGetJWTKey(t *testing.T) {
	// 1. Test when JWT_SECRET is set
	expected := "test_secret"
	os.Setenv("JWT_SECRET", expected)
	// We defer unset here in case panic happens before, but for the first test block it's fine.
	// Actually better structure:

	t.Run("Valid Secret", func(t *testing.T) {
		os.Setenv("JWT_SECRET", expected)
		defer os.Unsetenv("JWT_SECRET")

		key := GetJWTKey()
		if string(key) != expected {
			t.Errorf("expected %s, got %s", expected, string(key))
		}
	})

	t.Run("Missing Secret", func(t *testing.T) {
		os.Unsetenv("JWT_SECRET")
		defer func() {
			if r := recover(); r == nil {
				t.Errorf("The code did not panic")
			}
		}()
		GetJWTKey()
	})
}

func TestGetAllowedOrigins(t *testing.T) {
	t.Run("Default Origins", func(t *testing.T) {
		os.Unsetenv("CORS_ALLOWED_ORIGINS")
		origins := GetAllowedOrigins()
		expected := []string{"http://localhost:3000", "http://127.0.0.1:3000"}

		if len(origins) != len(expected) {
			t.Errorf("expected %d origins, got %d", len(expected), len(origins))
		}

		for i, origin := range origins {
			if origin != expected[i] {
				t.Errorf("expected %s, got %s", expected[i], origin)
			}
		}
	})

	t.Run("Custom Origins", func(t *testing.T) {
		customOrigins := "https://example.com,https://api.example.com"
		os.Setenv("CORS_ALLOWED_ORIGINS", customOrigins)
		defer os.Unsetenv("CORS_ALLOWED_ORIGINS")

		origins := GetAllowedOrigins()
		expected := []string{"https://example.com", "https://api.example.com"}

		if len(origins) != len(expected) {
			t.Errorf("expected %d origins, got %d", len(expected), len(origins))
		}

		for i, origin := range origins {
			if origin != expected[i] {
				t.Errorf("expected %s, got %s", expected[i], origin)
			}
		}
	})
}
