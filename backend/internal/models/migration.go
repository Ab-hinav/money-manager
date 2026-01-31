package models

import (
	"database/sql"
	"log"
)

func RunMigrations(db *sql.DB) {
	queries := []string{
		// 1. Create Families
		`CREATE TABLE IF NOT EXISTS families (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,

		// 2. Create Users (Basic Structure)
		`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL DEFAULT 'User', -- Default for safety
			email VARCHAR(255) UNIQUE NOT NULL,
			password TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,

		// 2b. Alter Users - Add 'family_id' if missing
		`DO $$ 
		BEGIN 
			IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='family_id') THEN 
				ALTER TABLE users ADD COLUMN family_id INT REFERENCES families(id); 
			END IF; 
		END $$;`,

		// 2c. Alter Users - Add 'name' if missing (For existing DBs)
		`DO $$ 
		BEGIN 
			IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='name') THEN 
				ALTER TABLE users ADD COLUMN name VARCHAR(100) NOT NULL DEFAULT 'User'; 
			END IF; 
		END $$;`,

		// 3. Create Categories
		`CREATE TABLE IF NOT EXISTS categories (
			id SERIAL PRIMARY KEY,
			name VARCHAR(50) NOT NULL,
			type VARCHAR(10) CHECK (type IN ('INCOME', 'EXPENSE')),
			user_id INT REFERENCES users(id), -- Nullable for System Defaults
			UNIQUE (name, user_id)
		);`,

		// 4. Seed Default Categories
		`INSERT INTO categories (name, type, user_id) VALUES 
			('Food', 'EXPENSE', NULL),
			('Transport', 'EXPENSE', NULL),
			('Salary', 'INCOME', NULL),
			('Rent', 'EXPENSE', NULL),
			('Groceries', 'EXPENSE', NULL)
		ON CONFLICT DO NOTHING;`,

		// 5. Create Transactions
		`CREATE TABLE IF NOT EXISTS transactions (
			id SERIAL PRIMARY KEY,
			user_id INT NOT NULL REFERENCES users(id),
			family_id INT REFERENCES families(id),
			category_id INT REFERENCES categories(id),
			amount DECIMAL(15, 2) NOT NULL,
			transaction_date DATE NOT NULL,
			description TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
	}

	for _, query := range queries {
		_, err := db.Exec(query)
		if err != nil {
			// Log but don't panic (unless it's critical)
			log.Printf("Migration Warning: %v\nQuery: %s", err, query)
		}
	}
	log.Println("Database Migrations Completed Successfully.")
}
