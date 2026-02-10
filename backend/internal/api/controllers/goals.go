package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/Ab-hinav/money-manager/internal/models"
)

type GoalHandler struct {
	DB *sql.DB
}

func (h *GoalHandler) GetGoals(w http.ResponseWriter, r *http.Request) {
	log.Println("GetGoals called")
	userID := r.Context().Value("user_id").(int)
	log.Println("user_id", userID)

	query := `SELECT id, user_id, name, target_amount, current_amount, icon, color, created_at 
			  FROM goals WHERE user_id = $1`
	rows, err := h.DB.Query(query, userID)
	if err != nil {
		log.Println("Database error fetching goals:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var goals []models.Goal
	for rows.Next() {
		var g models.Goal
		if err := rows.Scan(&g.ID, &g.UserID, &g.Name, &g.TargetAmount, &g.CurrentAmount, &g.Icon, &g.Color, &g.CreatedAt); err != nil {
			log.Println("Error scanning goal:", err)
			continue
		}
		goals = append(goals, g)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(goals)
}

func (h *GoalHandler) CreateGoal(w http.ResponseWriter, r *http.Request) {
	log.Println("CreateGoal called")
	userID := r.Context().Value("user_id").(int)

	var goal models.Goal
	if err := json.NewDecoder(r.Body).Decode(&goal); err != nil {
		log.Println("Error decoding goal body:", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Default values if needed
	if goal.CurrentAmount == 0 {
		goal.CurrentAmount = 0
	}
	// Validate?
	if goal.Name == "" || goal.TargetAmount <= 0 {
		http.Error(w, "Name and Target Amount are required", http.StatusBadRequest)
		return
	}

	query := `INSERT INTO goals (user_id, name, target_amount, current_amount, icon, color) 
			  VALUES ($1, $2, $3, $4, $5, $6) 
			  RETURNING id, created_at`

	err := h.DB.QueryRow(query, userID, goal.Name, goal.TargetAmount, goal.CurrentAmount, goal.Icon, goal.Color).
		Scan(&goal.ID, &goal.CreatedAt)
	if err != nil {
		log.Println("Database error creating goal:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	goal.UserID = userID

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(goal)
}
