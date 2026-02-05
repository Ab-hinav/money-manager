package config

import (
	"os"
	"testing"
)

func BenchmarkGetJWTKey(b *testing.B) {
	resetJWTKey()
	os.Setenv("JWT_SECRET", "mysecretkey")
	defer os.Unsetenv("JWT_SECRET")

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		GetJWTKey()
	}
}
