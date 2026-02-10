package models

import "time"

type Goal struct {
	ID            int       `json:"id"`
	UserID        int       `json:"userId"`
	Name          string    `json:"name"`
	TargetAmount  float64   `json:"targetAmount"`
	CurrentAmount float64   `json:"currentAmount"`
	Icon          string    `json:"icon"`
	Color         string    `json:"color"`
	CreatedAt     time.Time `json:"createdAt"`
}
