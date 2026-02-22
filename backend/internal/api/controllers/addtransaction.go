package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

type Category struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Icon string `json:"icon"`
	Type string `json:"type"`
}

type AddTransactionHandler struct {
	DB *sql.DB
}

type TransactionBody struct {
	Amount      float64 `json:"amount"`
	Type        string  `json:"type"`
	CategoryId  string  `json:"categoryId"`
	Date        string  `json:"date"`
	Description string  `json:"description"`
	Scope       string  `json:"scope"`
	GroupId     *int `json:"groupId"`
	GoalId      *int    `json:"goalId"`
}

type TransactionResponse struct {
	Id          int     `json:"id"`
	UserId      int     `json:"userId"`
	GroupId     *int    `json:"groupId"`
	CategoryId  string  `json:"categoryId"`
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	Description string  `json:"description"`
	GoalId      *int    `json:"goalId"`
}

func (h *AddTransactionHandler) GetCategoriesData(w http.ResponseWriter, r *http.Request) {
	log.Println("GetCategoriesData called")
	var categories []Category = []Category{}

	userID := r.Context().Value("user_id").(int)

	log.Println("user_id", userID)

	query := `SELECT id, name, icon, type FROM categories 
				WHERE user_id = $1 OR user_id IS NULL`
	rows, err := h.DB.Query(query, userID)
	if err != nil {
		log.Println("Database error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var category Category
		if err := rows.Scan(&category.Id, &category.Name, &category.Icon, &category.Type); err != nil {
			log.Println("Database error", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		categories = append(categories, category)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)

	if len(categories) == 0 {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.WriteHeader(http.StatusOK)
	log.Println("Categories Data", categories)
}

func (h *AddTransactionHandler) AddTransaction(w http.ResponseWriter, r *http.Request) {
	log.Println("AddTransaction called")

	userID := r.Context().Value("user_id").(int)

	// parse the body
	var transaction TransactionBody
	if err := json.NewDecoder(r.Body).Decode(&transaction); err != nil {
		log.Println("Database error", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	log.Println("Transaction Body", transaction)

	// insert the transaction into the database
	query := `INSERT INTO transactions (user_id,family_id, category_id, amount, transaction_date, description,goal_id) 
				VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING id, user_id, family_id, category_id, amount, transaction_date, description,goal_id`

	var transactionResponse TransactionResponse
	err := h.DB.QueryRow(query, userID, transaction.GroupId, transaction.CategoryId, transaction.Amount, transaction.Date,
		transaction.Description, transaction.GoalId).Scan(&transactionResponse.Id, &transactionResponse.UserId, &transactionResponse.GroupId, &transactionResponse.CategoryId, &transactionResponse.Amount, &transactionResponse.Date, &transactionResponse.Description, &transactionResponse.GoalId)
	if err != nil {
		log.Println("Database error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	log.Println("Transaction added successfully")
	json.NewEncoder(w).Encode(transactionResponse)

}
