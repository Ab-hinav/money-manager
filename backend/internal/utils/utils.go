package utils

import (
	"log"
	"os"
	"strconv"
	"time"
)

func GetEnvInt(key string, defaultVal int) int {
	valStr := os.Getenv(key)
	if valStr == "" {
		return defaultVal
	}

	val, err := strconv.Atoi(valStr)
	if err != nil {
		return defaultVal
	}

	return val
}

func DateValidation(dateFrom string, dateTo string) bool {

	// 1 are dates parsable
	// from should be less than to

	loc, _ := time.LoadLocation("Asia/Kolkata")

	from, err := time.ParseInLocation("2006-01-02", dateFrom, loc)
	if err != nil {
		log.Println("Error parsing dateFrom", err)
		return false
	}

	to, err := time.ParseInLocation("2006-01-02", dateTo, loc)
	if err != nil {
		log.Println("Error parsing dateTo", err)
		return false
	}

	log.Println("from", from)
	log.Println("to", to)

	if from.After(to) {
		return false
	}

	return true

}
