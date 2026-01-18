# Build Stage
FROM golang:1.25-alpine AS builder
WORKDIR /app

# 1. INSTALL GIT (The missing piece)
RUN apk add --no-cache git

# 2. Copy files
COPY go.mod go.sum ./

# 3. Download dependencies
RUN go mod download

# 4. Copy the rest of the code
COPY . .

# 5. Build
RUN go build -o main ./cmd/server

# Run Stage (Keep this lightweight)
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]