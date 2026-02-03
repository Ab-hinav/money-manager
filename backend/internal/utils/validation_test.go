package utils

import "testing"

func TestIsValidEmail(t *testing.T) {
	tests := []struct {
		name  string
		email string
		want  bool
	}{
		{"valid email", "test@example.com", true},
		{"valid email with dots", "first.last@example.co.uk", true},
		{"invalid email missing @", "testexample.com", false},
		{"invalid email missing domain", "test@", false},
		{"invalid email missing tld", "test@example", false}, // Regex expects at least 2 chars TLD
		{"empty email", "", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IsValidEmail(tt.email); got != tt.want {
				t.Errorf("IsValidEmail(%q) = %v, want %v", tt.email, got, tt.want)
			}
		})
	}
}

func TestIsStrongPassword(t *testing.T) {
	tests := []struct {
		name     string
		password string
		want     bool
	}{
		{"strong password", "password123", true},
		{"exact length 8", "12345678", true},
		{"weak password short", "short", false},
		{"empty password", "", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IsStrongPassword(tt.password); got != tt.want {
				t.Errorf("IsStrongPassword(%q) = %v, want %v", tt.password, got, tt.want)
			}
		})
	}
}
