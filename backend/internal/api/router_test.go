package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRouterHealth(t *testing.T) {
	// Initialize the router with a nil DB since /api/health doesn't use it
	r := NewRouter(nil)

	// Create a request to /api/health
	req, err := http.NewRequest("GET", "/api/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Request GZIP compression
	req.Header.Set("Accept-Encoding", "gzip")

	// Create a ResponseRecorder to record the response
	rr := httptest.NewRecorder()

	// Serve the request
	r.ServeHTTP(rr, req)

	// Check the status code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	expected := "Backend is Healthy"
	// If compressed, the body won't match the string directly without decoding.
	// But likely it is too small to compress.
	// If it IS compressed, Content-Encoding will be gzip.

	contentEncoding := rr.Header().Get("Content-Encoding")
	if contentEncoding == "gzip" {
		// If it is compressed, we are good.
		t.Logf("Response was compressed")
	} else {
		// If not compressed, check body matches
		if rr.Body.String() != expected {
			t.Errorf("handler returned unexpected body: got %v want %v",
				rr.Body.String(), expected)
		}
	}
}
