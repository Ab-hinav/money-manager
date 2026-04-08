package config

import (
	"database/sql"
	"os"
	"testing"

	_ "github.com/lib/pq"
)

func TestConfigureDB(t *testing.T) {
	// Helper to create a dummy DB object (won't connect)
	createDummyDB := func() *sql.DB {
		db, err := sql.Open("postgres", "postgres://user:pass@localhost/db?sslmode=disable")
		if err != nil {
			t.Fatalf("Failed to open dummy DB: %v", err)
		}
		return db
	}

	t.Run("Defaults", func(t *testing.T) {
		// Ensure env vars are unset
		os.Unsetenv("DB_MAX_OPEN_CONNS")
		os.Unsetenv("DB_MAX_IDLE_CONNS")
		os.Unsetenv("DB_CONN_MAX_LIFETIME")

		db := createDummyDB()
		defer db.Close()

		configureDB(db)

		stats := db.Stats()
		if stats.MaxOpenConnections != 25 {
			t.Errorf("Expected MaxOpenConnections 25, got %d", stats.MaxOpenConnections)
		}
	})

	t.Run("Custom Values", func(t *testing.T) {
		os.Setenv("DB_MAX_OPEN_CONNS", "50")
		os.Setenv("DB_MAX_IDLE_CONNS", "10")
		os.Setenv("DB_CONN_MAX_LIFETIME", "1h")
		defer func() {
			os.Unsetenv("DB_MAX_OPEN_CONNS")
			os.Unsetenv("DB_MAX_IDLE_CONNS")
			os.Unsetenv("DB_CONN_MAX_LIFETIME")
		}()

		db := createDummyDB()
		defer db.Close()

		configureDB(db)

		stats := db.Stats()
		if stats.MaxOpenConnections != 50 {
			t.Errorf("Expected MaxOpenConnections 50, got %d", stats.MaxOpenConnections)
		}
	})

	t.Run("Invalid Values Fallback", func(t *testing.T) {
		os.Setenv("DB_MAX_OPEN_CONNS", "invalid")
		defer os.Unsetenv("DB_MAX_OPEN_CONNS")

		db := createDummyDB()
		defer db.Close()

		configureDB(db)

		stats := db.Stats()
		if stats.MaxOpenConnections != 25 {
			t.Errorf("Expected MaxOpenConnections 25 (fallback), got %d", stats.MaxOpenConnections)
		}
	})
}
