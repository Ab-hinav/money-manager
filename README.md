# Money Manager

A comprehensive financial management application designed to provide users and organizations with a clear view of their expenses, savings, and overall financial health. This project empowers users to achieve better financial control through real-time visualization of financial activities.

## Features

-   **Expense Tracking**: Log and categorize individual expenses (e.g., Groceries, Rent, Utilities). Support for custom categories and recurring entries.
-   **Income Tracking**: Log various sources of income with support for recurring entries.
-   **Account Management**: Manage multiple financial accounts (Bank, Credit Card, Cash) with balance updates.
-   **Dashboard**: Real-time overview of financial status, including net worth, expense breakdowns, and spending trends.
-   **Organization Support**: Assign expenses to specific projects or departments.

## Tech Stack

### Frontend
-   **Framework**: [Next.js 16.1+](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **UI Components**: Shadcn/UI (planned)

### Backend
-   **Language**: Go (Golang) 1.25+
-   **Database Driver**: lib/pq

### Database
-   **Database**: PostgreSQL
-   **Hosting**: AWS RDS

### Infrastructure
-   **Cloud Provider**: AWS
-   **Containerization**: Docker
-   **Orchestration**: Kubernetes (K3s)
-   **IaC**: Terraform

## Architecture Overview

The application follows a 3-Tier Managed Architecture:
1.  **Frontend**: Next.js application served via AWS CloudFront (CDN) and running in a Kubernetes pod.
2.  **Backend**: Go API services running as containerized pods in Kubernetes, handling business logic.
3.  **Database**: Managed PostgreSQL instance (AWS RDS) for reliable data persistence.

## Getting Started

### Prerequisites

Ensure you have the following installed:
-   [Go](https://go.dev/dl/)
-   [Node.js](https://nodejs.org/)
-   [Docker](https://www.docker.com/)
-   [Terraform](https://www.terraform.io/) (optional, for infrastructure)

### Installation & Local Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Ab-hinav/money-manager.git
    cd money-manager
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    go mod download
    # Run the server
    go run cmd/server/main.go
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Docker Setup (Optional)**
    You can build the images using the provided Dockerfiles in `backend/` and `frontend/`.

## Project Structure

-   `frontend/`: Source code for the Next.js web application.
-   `backend/`: Source code for the Go API services.
-   `k8s/`: Kubernetes manifest files for deployment.
-   `terraform/`: Terraform configuration for AWS infrastructure.
-   `docs/`: Project documentation and PRD.
