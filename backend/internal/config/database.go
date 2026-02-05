package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	_ "github.com/lib/pq"
)

func ConnectDB() *sql.DB {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=require",
		os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error opening DB: %v", err)
	}

	configureDB(db)

	if err = db.Ping(); err != nil {
		log.Fatalf("Error connecting to DB: %v", err)
	}

	log.Println("Connected to Database successfully!")
	return db
}

func configureDB(db *sql.DB) {
	// Default values
	maxOpenConns := 25
	maxIdleConns := 25
	connMaxLifetime := 15 * time.Minute

	if val := os.Getenv("DB_MAX_OPEN_CONNS"); val != "" {
		if i, err := strconv.Atoi(val); err == nil {
			maxOpenConns = i
		} else {
			log.Printf("Invalid DB_MAX_OPEN_CONNS value: %v. Using default: %d", val, maxOpenConns)
		}
	}

	if val := os.Getenv("DB_MAX_IDLE_CONNS"); val != "" {
		if i, err := strconv.Atoi(val); err == nil {
			maxIdleConns = i
		} else {
			log.Printf("Invalid DB_MAX_IDLE_CONNS value: %v. Using default: %d", val, maxIdleConns)
		}
	}

	if val := os.Getenv("DB_CONN_MAX_LIFETIME"); val != "" {
		if d, err := time.ParseDuration(val); err == nil {
			connMaxLifetime = d
		} else {
			log.Printf("Invalid DB_CONN_MAX_LIFETIME value: %v. Using default: %v", val, connMaxLifetime)
		}
	}

	db.SetMaxOpenConns(maxOpenConns)
	db.SetMaxIdleConns(maxIdleConns)
	db.SetConnMaxLifetime(connMaxLifetime)
}
