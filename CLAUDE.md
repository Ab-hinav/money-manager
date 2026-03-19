# Money Manager

Full-stack personal finance application with a Next.js frontend and Go backend.

## Project Structure

```
frontend/          Next.js 16 app (React 19, Tailwind CSS 4, NextAuth.js)
backend/           Go HTTP server (Chi router, PostgreSQL, JWT auth)
k8s/               Kubernetes manifests (K3s deployment, Traefik ingress)
terraform/         AWS infrastructure (EC2, RDS, VPC, CloudFront)
docs/              Documentation
```

## Tech Stack

### Frontend (`frontend/`)
- Next.js 16.1.3 with React 19.2.3
- Tailwind CSS 4 + Radix UI components
- NextAuth.js for authentication
- Recharts for data visualization
- App Router with route groups: `(auth)`, `(dashboard)`, `(marketing)`

### Backend (`backend/`)
- Go 1.25 with Chi v5 router
- PostgreSQL via `lib/pq`
- JWT authentication (`golang-jwt/jwt/v5`)
- Password hashing with `golang.org/x/crypto`
- Structure: `cmd/server/main.go` entrypoint, `internal/{api,config,models,utils}`

## Development

### Prerequisites
- Node.js 23+ and npm
- Go 1.25+
- PostgreSQL

### Environment Variables

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_SECRET=<secret>
NEXTAUTH_URL=http://localhost:3000
```

**Backend** (`backend/.env`):
```
JWT_SECRET=<secret>
DB_HOST=localhost
DB_PORT=5432
DB_USER=<user>
DB_PASSWORD=<password>
DB_NAME=moneymanager
FRONTEND_URL=http://localhost:3000
```

### Running Dev Servers
- **Frontend**: `cd frontend && npm run dev` (port 3000)
- **Backend**: `cd backend && go run cmd/server/main.go` (port 8080)

### Build
- **Frontend**: `cd frontend && npm run build`
- **Backend**: Built via Dockerfile (multi-stage Go build)

### Lint
- **Frontend**: `cd frontend && npm run lint`

## Deployment
- Infrastructure managed via Terraform (AWS: EC2 + K3s, RDS PostgreSQL, CloudFront CDN)
- Container images built with Docker
- Deployed to K3s cluster with Kubernetes manifests in `k8s/`
