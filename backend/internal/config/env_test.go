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

func TestGetJWTExpiry(t *testing.T) {
	// Reset state
	ResetJWTExpiry()

	t.Run("Default Value", func(t *testing.T) {
		ResetJWTExpiry()
		os.Unsetenv("JWT_EXPIRY")

		val := GetJWTExpiry()
		if val != 6 {
			t.Errorf("expected default 6, got %d", val)
		}
	})

	t.Run("Custom Value", func(t *testing.T) {
		ResetJWTExpiry()
		expected := 12
		os.Setenv("JWT_EXPIRY", "12")
		defer os.Unsetenv("JWT_EXPIRY")

		val := GetJWTExpiry()
		if val != expected {
			t.Errorf("expected %d, got %d", expected, val)
		}
	})

	t.Run("Invalid Value", func(t *testing.T) {
		ResetJWTExpiry()
		os.Setenv("JWT_EXPIRY", "invalid")
		defer os.Unsetenv("JWT_EXPIRY")

		val := GetJWTExpiry()
		if val != 6 {
			t.Errorf("expected default 6 for invalid input, got %d", val)
		}
	})
}
