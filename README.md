# Money Manager

A comprehensive financial management application designed to provide users and organizations with a clear view of their expenses, savings, and overall financial health.

## Key Features

### Current (MVP)
-   **Secure Authentication**: JWT-based login and registration system using NextAuth.js.
-   **Interactive Dashboard**: Real-time overview of financial status.
-   **Transaction Management**: User interface for adding and categorizing transactions.
-   **Dynamic Navigation**: Context-aware navbar with authenticated/guest states and mobile support.
-   **Responsive Design**: Mobile-first "Clean Fintech" aesthetic using Tailwind CSS and Shadcn/UI.

### Planned
-   **Advanced Analytics**: Detailed expense breakdowns and spending trends.
-   **Family/Organization Support**: Shared accounts and role-based access.
-   **Account Management**: Multi-account support (Bank, Credit Card, Cash).

## Tech Stack

### Frontend
-   **Framework**: [Next.js 16.1.3](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **UI Library**: Shadcn/UI (Radix Primitives + Lucide Icons)
-   **Auth**: NextAuth.js (Session Management)

### Backend
-   **Language**: Go 1.25.4
-   **Framework**: Chi Router
-   **API**: RESTful Monolith
-   **Auth**: JWT (JSON Web Tokens)
-   **Database Driver**: `lib/pq`

### Infrastructure & DevOps
-   **Cloud**: AWS (Region: `ap-south-1`)
-   **Containerization**: Docker
-   **Orchestration**: K3s (Lightweight Kubernetes) on EC2
-   **IaC**: Terraform (VPC, EC2, RDS)
-   **Database**: AWS RDS (Managed PostgreSQL 16 - Free Tier)
-   **CI/CD**: GitHub Actions

## Project Structure

```bash
.
├── frontend/           # Next.js Web Application
│   ├── app/            # App Router Pages & Layouts
│   ├── components/     # Reusable UI Components (Shadcn)
│   ├── lib/            # Utilities & Auth Config
│   └── types/          # TypeScript Definitions
├── backend/            # Go API Service
│   ├── cmd/server/     # Entry Point
│   └── internal/       # Application Logic
│       ├── api/        # Controllers & Routes
│       ├── config/     # Configuration & DB Setup
│       ├── models/     # Data Structures
│       └── utils/      # Helper Functions
├── k8s/                # Kubernetes Manifests (Deployments, Services, Ingress)
├── terraform/          # Infrastructure as Code (AWS)
├── .github/workflows/  # CI/CD Pipelines
└── docs/               # Product Requirements & Design Assets
```

## Getting Started

### Prerequisites
-   [Go 1.25+](https://go.dev/dl/)
-   [Node.js 20+](https://nodejs.org/)
-   [Docker](https://www.docker.com/)
-   [Terraform](https://www.terraform.io/) (Optional)

### Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Ab-hinav/money-manager.git
    cd money-manager
    ```

2.  **Backend Setup**
    Create a `.env` file in `backend/` (see `backend/config/config.go` for required keys) or set environment variables directly.
    ```bash
    cd backend
    go mod download
    go run cmd/server/main.go
    # Server starts on localhost:8080
    ```

3.  **Frontend Setup**
    Create a `.env` file in `frontend/` with:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080
    NEXTAUTH_SECRET=your-secret
    NEXTAUTH_URL=http://localhost:3000
    ```

    Run the app:
    ```bash
    cd frontend
    npm install
    npm run dev
    # App opens at http://localhost:3000
    ```

4.  **Infrastructure (Optional)**
    Deploy to AWS using Terraform:
    ```bash
    cd terraform
    terraform init && terraform apply
    # Note outputs: ec2_public_ip, db_endpoint, db_connection_url
    ```

## Architecture

The application follows a **3-Tier Architecture**:
1.  **Frontend**: Next.js (SSR/CSR) running in K3s (or Vercel), served via AWS CloudFront.
2.  **Backend**: Go API handling business logic and DB interactions.
3.  **Database**: AWS RDS (PostgreSQL) for persistent storage.

For detailed product requirements, refer to [docs/PRD_live.txt](docs/PRD_live.txt).
