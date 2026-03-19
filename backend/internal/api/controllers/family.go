package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

type Family struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Icon string `json:"icon"`
	Type string `json:"type"`
}

type FamilyHandler struct {
	DB *sql.DB
}

func (h *FamilyHandler) GetFamilyData(w http.ResponseWriter, r *http.Request) {
	log.Println("GetFamilyData called")

	userID := r.Context().Value("user_id").(int)
	log.Println("user_id", userID)

	query := `SELECT f.id, f.name, f.icon, f.type FROM families f
				JOIN users_family uf ON f.id = uf.family_id
				WHERE uf.user_id = $1`

	rows, err := h.DB.Query(query, userID)
	if err != nil {
		log.Println("Database error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var families []Family
	for rows.Next() {
		var family Family
		if err := rows.Scan(&family.Id, &family.Name, &family.Icon, &family.Type); err != nil {
			log.Println("Database error", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		families = append(families, family)
	}

	if err := rows.Err(); err != nil {
		log.Println("Rows iteration error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if len(families) == 0 {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(families)
	log.Println("Family Data", families)

}

func (h *FamilyHandler) CreateFamily(w http.ResponseWriter, r *http.Request) {
	log.Println("CreateFamily called")

	userID := r.Context().Value("user_id").(int)
	log.Println("user_id", userID)

	var family Family
	if err := json.NewDecoder(r.Body).Decode(&family); err != nil {
		log.Println("Database error", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	log.Println("Family Body", family)

	query := `INSERT INTO families (name, icon, type) VALUES ($1, $2, $3) RETURNING id, name, icon, type`
	var familyResponse Family
	err := h.DB.QueryRow(query, family.Name, family.Icon, family.Type).Scan(&familyResponse.Id, &familyResponse.Name, &familyResponse.Icon, &familyResponse.Type)
	if err != nil {
		log.Println("Database error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	query2 := `INSERT INTO users_family (user_id, family_id) VALUES ($1, $2)`
	_, err = h.DB.Exec(query2, userID, familyResponse.Id)
	if err != nil {
		log.Println("Database error", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	log.Println("Family created successfully")
	json.NewEncoder(w).Encode(familyResponse)
}
