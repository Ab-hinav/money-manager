# Money Manager

A comprehensive financial management application designed to provide users and organizations with a clear view of their expenses, savings, and overall financial health. This project empowers users to achieve better financial control through real-time visualization of financial activities.

## Features

-   **Expense Tracking**: Log and categorize individual expenses (e.g., Groceries, Rent, Utilities). Support for custom categories and recurring entries.
-   **Income Tracking**: Log various sources of income with support for recurring entries.
-   **Account Management**: Manage multiple financial accounts (Bank, Credit Card, Cash) with balance updates.
-   **Dashboard**: Real-time overview of financial status, including net worth, expense breakdowns, and spending trends.
-   **Organization Support**: Assign expenses to specific projects or departments.
-   **Landing Page**: Modern, high-converting marketing page with "Clean Fintech" aesthetic.

## Tech Stack

### Frontend
-   **Framework**: [Next.js 16.1.3](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **UI Components**: Shadcn/UI (Radix Primitives + Tailwind) & Lucide React
-   **State Management**: React Hooks

### Backend
-   **Language**: Go (Golang) 1.25.4
-   **Database Driver**: `lib/pq`
-   **Architecture**: Monolithic API (initially)

### Infrastructure & DevOps
-   **Cloud Provider**: AWS (Region: `ap-south-1`)
-   **Containerization**: Docker
-   **Orchestration**: Kubernetes (K3s) on EC2
-   **IaC**: Terraform (AWS Provider ~> 5.0)
-   **Database**: Managed PostgreSQL (AWS RDS)

## Project Structure

-   `frontend/`: Next.js web application source code.
    -   `app/`: App Router pages and layouts (Includes Marketing Landing Page `page.tsx`).
    -   `components/`: Reusable UI components (Shadcn) and feature-specific components (`landing/`).
    -   `lib/`: Utility functions.
-   `backend/`: Go API services source code.
    -   `cmd/`: Entry points for applications.
    -   `internal/`: Private application and library code.
-   `k8s/`: Kubernetes manifest files for deployment (`backend.yaml`, `frontend.yaml`, `ingress.yaml`).
-   `terraform/`: Terraform configuration for provisioning AWS infrastructure (VPC, EC2, RDS).
-   `docs/`: Project documentation (PRD) and design assets.

## Getting Started

### Prerequisites

Ensure you have the following installed:
-   [Go 1.25+](https://go.dev/dl/)
-   [Node.js 20+](https://nodejs.org/)
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
    # Open http://localhost:3000 to view the app
    ```

4.  **Infrastructure Provisioning (Optional)**
    ```bash
    cd terraform
    terraform init
    terraform plan
    terraform apply
    ```

## Architecture Overview

The application follows a **3-Tier Hybrid Architecture**:
1.  **Frontend**: Next.js application served via AWS CloudFront (CDN) and running in a Kubernetes pod (or locally).
2.  **Backend**: Go API services running as containerized pods in Kubernetes, handling business logic.
3.  **Database**: Managed PostgreSQL instance (AWS RDS) for reliable data persistence.

For more details on the product requirements, refer to the `docs/` folder
