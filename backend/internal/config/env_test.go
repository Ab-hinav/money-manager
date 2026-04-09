package config

import (
	"os"
	"sync"
	"testing"
)

// resetJWTKey resets the singleton for testing purposes
func resetJWTKey() {
	jwtKey = nil
	jwtOnce = sync.Once{}
}

func TestGetJWTKey(t *testing.T) {
	expected := "test_secret"

	t.Run("Valid Secret", func(t *testing.T) {
		resetJWTKey()
		os.Setenv("JWT_SECRET", expected)
		defer os.Unsetenv("JWT_SECRET")

		key := GetJWTKey()
		if string(key) != expected {
			t.Errorf("expected %s, got %s", expected, string(key))
		}
	})

	t.Run("Missing Secret", func(t *testing.T) {
		resetJWTKey()
		os.Unsetenv("JWT_SECRET")
		defer func() {
			if r := recover(); r == nil {
				t.Errorf("The code did not panic")
			}
		}()
		GetJWTKey()
	})

	t.Run("Missing Secret Persistence", func(t *testing.T) {
		resetJWTKey()
		os.Unsetenv("JWT_SECRET")

		// First call panics
		func() {
			defer func() {
				if r := recover(); r == nil {
					t.Errorf("First call did not panic")
				}
			}()
			GetJWTKey()
		}()

		// Second call should ALSO panic
		func() {
			defer func() {
				if r := recover(); r == nil {
					t.Errorf("Second call did not panic")
				}
			}()
			GetJWTKey()
		}()
	})
}
