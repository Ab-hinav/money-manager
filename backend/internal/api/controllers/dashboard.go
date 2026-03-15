package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/Ab-hinav/money-manager/internal/config"
	"github.com/Ab-hinav/money-manager/internal/utils"
)

type DashboardHandler struct {
	DB *sql.DB
}

func (h *DashboardHandler) GetTotalBalance(w http.ResponseWriter, r *http.Request) {

	userID := r.Context().Value("user_id").(int)
	// read month and year from query params
	toDate := r.URL.Query().Get("toDate")
	fromDate := r.URL.Query().Get("fromDate")

	var totalBalance float64

	// formula for balance = income - expenses -loans - invest - savings

	// get categoryIds

	query := `SELECT SUM(CASE WHEN type = $2 THEN amount ELSE 0 END) - SUM(CASE WHEN type = $3 THEN amount ELSE 0 END) - SUM(CASE WHEN type = $4 THEN amount ELSE 0 END) - SUM(CASE WHEN type = $5 THEN amount ELSE 0 END) - SUM(CASE WHEN type = $6 THEN amount ELSE 0 END) FROM transactions t JOIN categories c ON c.id = t.category_id WHERE t.user_id = $1 AND t.transaction_date BETWEEN $7 AND $8`

	rows, err := h.DB.Query(query, userID, config.CATEGORY_TYPE_INCOME, config.CATEGORY_TYPE_EXPENSE, config.CATEGORY_TYPE_LOAN, config.CATEGORY_TYPE_INVESTMENT, config.CATEGORY_TYPE_SAVINGS, fromDate, toDate)
	if err != nil {
		log.Println("Database error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		if err := rows.Scan(&totalBalance); err != nil {
			log.Println("Database error", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(totalBalance)

}

func (h *DashboardHandler) GetTotalIncome(w http.ResponseWriter, r *http.Request) {

	userID := r.Context().Value("user_id").(int)

	toDate := r.URL.Query().Get("toDate")
	fromDate := r.URL.Query().Get("fromDate")

	log.Println("fromDate", fromDate)
	log.Println("toDate", toDate)

	if !utils.DateValidation(fromDate, toDate) {
		http.Error(w, "Invalid date range", http.StatusBadRequest)
		return
	}

	var totalIncome float64

	query := `SELECT SUM(t.amount) FROM transactions t JOIN categories c ON c.id = t.category_id WHERE t.user_id = $1 AND c.type = $2 AND t.transaction_date BETWEEN $3 AND $4`

	rows, err := h.DB.Query(query, userID, config.CATEGORY_TYPE_INCOME, fromDate, toDate)
	if err != nil {
		log.Println("Database error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		if err := rows.Scan(&totalIncome); err != nil {
			log.Println("Database error", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(totalIncome)

}

func (h *DashboardHandler) GetTotalExpenses(w http.ResponseWriter, r *http.Request) {

	userID := r.Context().Value("user_id").(int)
	loc, _ := time.LoadLocation("Asia/Kolkata")

	toDate := r.URL.Query().Get("toDate")
	fromDate := r.URL.Query().Get("fromDate")
	monthlyData := r.URL.Query().Get("monthlyData")

	//parse monthlyData to boolean
	monthlyDataBool, err := strconv.ParseBool(monthlyData)
	if err != nil {
		http.Error(w, "Invalid monthlyData", http.StatusBadRequest)
		return
	}

	if !utils.DateValidation(fromDate, toDate) {
		http.Error(w, "Invalid date range", http.StatusBadRequest)
		return
	}

	if monthlyDataBool {

		t, _ := time.ParseInLocation("02-01-2006", toDate, loc)
		f, _ := time.ParseInLocation("02-01-2006", fromDate, loc)

		monthGap := t.Month() - f.Month()

		var expenses []map[string]interface{}

		query := `SELECT
		DATE_TRUNC('month', t.transaction_date) AS month,
		COALESCE(SUM(t.amount), 0) AS total_expense
		FROM transactions t
		JOIN categories c ON c.id = t.category_id
		WHERE t.user_id = $1
		AND c.type = $2
		AND t.transaction_date >= DATE_TRUNC('month', CURRENT_DATE) - ($3::int * INTERVAL '1 month')
		GROUP BY 1
		ORDER BY month;`

		rows, err := h.DB.Query(query, userID, config.CATEGORY_TYPE_EXPENSE, int(monthGap))
		if err != nil {
			log.Println("Database error", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var month string
			var totalExpense float64
			if err := rows.Scan(&month, &totalExpense); err != nil {
				log.Println("Database error", err)
				http.Error(w, "Database error", http.StatusInternalServerError)
				return
			}
			expenses = append(expenses, map[string]interface{}{"month": month, "totalExpense": totalExpense})
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(expenses)
		return

	}
	var totalExpenses float64

	query := `SELECT SUM(t.amount) FROM transactions t JOIN categories c ON c.id = t.category_id WHERE t.user_id = $1 AND c.type = $2 AND t.transaction_date BETWEEN $3 AND $4`

	rows, err := h.DB.Query(query, userID, config.CATEGORY_TYPE_EXPENSE, fromDate, toDate)
	if err != nil {
		log.Println("Database error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		if err := rows.Scan(&totalExpenses); err != nil {
			log.Println("Database error", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(totalExpenses)

}

func (h *DashboardHandler) GetTotalSavings(w http.ResponseWriter, r *http.Request) {

	userID := r.Context().Value("user_id").(int)

	fromDate := r.URL.Query().Get("fromDate")
	toDate := r.URL.Query().Get("toDate")

	log.Println("fromDate", fromDate)
	log.Println("toDate", toDate)

	if !utils.DateValidation(fromDate, toDate) {
		http.Error(w, "Invalid date range", http.StatusBadRequest)
		return
	}

	var response struct {
		TotalSavings float64
		Savings      []map[string]interface{}
	}

	var totalSavings float64
	var savings []map[string]interface{}

	query := `SELECT t.amount,c.name FROM transactions t JOIN categories c ON c.id = t.category_id WHERE t.user_id = $1 AND c.type = $2 AND t.transaction_date BETWEEN $3 AND $4`

	rows, err := h.DB.Query(query, userID, config.CATEGORY_TYPE_SAVINGS, fromDate, toDate)
	if err != nil {
		log.Println("Database error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var amount float64
		var name string
		if err := rows.Scan(&amount, &name); err != nil {
			log.Println("Database error", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		savings = append(savings, map[string]interface{}{"amount": amount, "name": name})
	}

	for _, s := range savings {
		totalSavings += s["amount"].(float64)
	}

	response.TotalSavings = totalSavings
	response.Savings = savings

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

}

func (h *DashboardHandler) GetTotalLoans(w http.ResponseWriter, r *http.Request) {

	userID := r.Context().Value("user_id").(int)

	fromDate := r.URL.Query().Get("fromDate")
	toDate := r.URL.Query().Get("toDate")

	if !utils.DateValidation(fromDate, toDate) {
		http.Error(w, "Invalid date range", http.StatusBadRequest)
		return
	}

	var response struct {
		TotalLoans float64
		Loans      map[string]float64
	}

	var totalLoans float64
	var loans = make(map[string]float64)

	query := `SELECT t.amount,c.name FROM transactions t JOIN categories c ON c.id = t.category_id WHERE t.user_id = $1 AND c.type = $2 AND t.transaction_date BETWEEN $3 AND $4`

	rows, err := h.DB.Query(query, userID, config.CATEGORY_TYPE_LOAN, fromDate, toDate)
	if err != nil {
		log.Println("Database error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {

		var amount float64
		var name string
		if err := rows.Scan(&amount, &name); err != nil {
			log.Println("Database error", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		loans[name] += amount
	}

	for _, l := range loans {
		totalLoans += l
	}

	response.TotalLoans = totalLoans
	response.Loans = loans

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

}

func (h *DashboardHandler) GetTotalInvestments(w http.ResponseWriter, r *http.Request) {

	userID := r.Context().Value("user_id").(int)

	fromDate := r.URL.Query().Get("fromDate")
	toDate := r.URL.Query().Get("toDate")

	if !utils.DateValidation(fromDate, toDate) {
		http.Error(w, "Invalid date range", http.StatusBadRequest)
		return
	}

	var response struct {
		TotalInvestments float64
		Investments      map[string]float64
	}

	var totalInvestments float64
	var investments = make(map[string]float64)

	query := `SELECT t.amount,c.name FROM transactions t JOIN categories c ON c.id = t.category_id WHERE t.user_id = $1 AND c.type = $2 AND t.transaction_date BETWEEN $3 AND $4`

	rows, err := h.DB.Query(query, userID, config.CATEGORY_TYPE_INVESTMENT, fromDate, toDate)
	if err != nil {
		log.Println("Database error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {

		var amount float64
		var name string
		if err := rows.Scan(&amount, &name); err != nil {
			log.Println("Database error", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		investments[name] += amount
	}

	for _, i := range investments {
		totalInvestments += i
	}

	response.TotalInvestments = totalInvestments
	response.Investments = investments

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

}
