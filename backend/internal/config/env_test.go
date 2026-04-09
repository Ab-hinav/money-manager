package config

import (
	"os"
	"testing"
)

func TestGetJWTKey(t *testing.T) {
	expected := "test_secret"

	t.Run("Valid Secret", func(t *testing.T) {
		ResetJWTKey()
		defer ResetJWTKey()

		os.Setenv("JWT_SECRET", expected)
		defer os.Unsetenv("JWT_SECRET")

		key := GetJWTKey()
		if string(key) != expected {
			t.Errorf("expected %s, got %s", expected, string(key))
		}
	})

	t.Run("Missing Secret", func(t *testing.T) {
		ResetJWTKey()
		defer ResetJWTKey()

		os.Unsetenv("JWT_SECRET")
		defer func() {
			if r := recover(); r == nil {
				t.Errorf("The code did not panic")
			}
		}()
		GetJWTKey()
	})
}
