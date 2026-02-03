package utils

import "regexp"

// Simple email regex pattern
var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

// IsValidEmail checks if the email string matches standard email format
func IsValidEmail(email string) bool {
	return emailRegex.MatchString(email)
}

// IsStrongPassword checks if the password meets minimum security requirements
// Currently enforces minimum length of 8 characters
func IsStrongPassword(password string) bool {
	return len(password) >= 8
}
