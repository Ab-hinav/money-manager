package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/Ab-hinav/money-manager/internal/config"
	"github.com/Ab-hinav/money-manager/internal/utils"
)

type AuthHandler struct {
	DB *sql.DB
}

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Claims struct {
	Email  string `json:"email"`
	UserID int    `json:"user_id"`
	jwt.RegisteredClaims
}

// Login handles the NextAuth credentials provider call
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// 1. Fetch User details
	var storedPass, name string
	var userID int

	// We verify email and grab the ID, Password, and Name
	err := h.DB.QueryRow("SELECT id, password, name FROM users WHERE email=$1", creds.Email).Scan(&userID, &storedPass, &name)
	if err == sql.ErrNoRows {
		// Use generic error message to prevent user enumeration
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	} else if err != nil {
		log.Println("Error fetching user:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// 2. Check Password
	if err := bcrypt.CompareHashAndPassword([]byte(storedPass), []byte(creds.Password)); err != nil {
		// Use generic error message to prevent user enumeration
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	// 3. Generate JWT Token
	expirationTime := time.Now().Add(time.Duration(utils.GetEnvInt("JWT_EXPIRY", 6)) * time.Hour)
	claims := &Claims{
		Email:  creds.Email,
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(config.GetJWTKey())
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	// 4. Return JSON (NextAuth will read this)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Login successful",
		"token":   tokenString, // Bearer token for NextAuth
		"user": map[string]interface{}{
			"id":    userID,
			"email": creds.Email,
			"name":  name,
		},
	})
}

// Signup handles new user registration
func (h *AuthHandler) Signup(w http.ResponseWriter, r *http.Request) {
	var user struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Println("Invalid request body", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Basic validation
	if user.Email == "" || user.Password == "" || user.Name == "" {
		log.Println("Missing required fields")
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// 1. Check if user already exists
	var existingID int
	err := h.DB.QueryRow("SELECT id FROM users WHERE email=$1", user.Email).Scan(&existingID)
	if err == nil {
		log.Println("User already exists")
		http.Error(w, "User already exists", http.StatusConflict)
		return
	} else if err != sql.ErrNoRows {
		log.Println("Database error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// 2. Hash Password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Error processing password", err)
		http.Error(w, "Error processing password", http.StatusInternalServerError)
		return
	}

	// 3. Insert User
	var newUserID int
	err = h.DB.QueryRow(
		"INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
		user.Name, user.Email, string(hashedPassword),
	).Scan(&newUserID)

	if err != nil {
		log.Println("Error creating user", err)
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	// 4. Return Success
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"message": "User registered successfully",
		"user_id": newUserID,
	})
}
