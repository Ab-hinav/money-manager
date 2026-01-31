package models

import (
	"database/sql"
	"log"
)

type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"` // Added
	Email    string `json:"email"`
	Password string `json:"-"`                   // Never send password in JSON
	FamilyID *int   `json:"family_id,omitempty"` // Pointer allows NULL
}

func CreateTestUser(db *sql.DB, name string, email string, hashedPassword string) {

	query := `INSERT INTO users (name, email, password) 
				VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING`

	_, err := db.Exec(query, name, email, hashedPassword)
	if err != nil {
		log.Printf("Error seeding test user: %v", err)
		return
	}
	log.Println("Test user seeded successfully!")

}
