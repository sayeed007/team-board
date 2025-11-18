# TeamBoard Deployment Guide

This guide covers deploying TeamBoard to production environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
  - [AWS](#aws-deployment)
  - [Azure](#azure-deployment)
  - [Google Cloud](#google-cloud-deployment)
  - [Render](#render-deployment)
- [Database Setup](#database-setup)
- [CI/CD Setup](#cicd-setup)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:
- Docker and Docker Compose installed (for containerized deployment)
- Access to a PostgreSQL 15+ database
- Domain name (optional but recommended)
- SSL certificate (recommended for production)

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Critical production variables
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/teamboard
JWT_SECRET=<generate-strong-secret>  # Use: openssl rand -base64 32
JWT_EXPIRES_IN=7d

# CORS (frontend URL)
CORS_ORIGIN=https://teamboard.yourdomain.com

# Optional: SOAP Integration
SOAP_ENDPOINT_URL=https://external-hr-system.com/soap/endpoint
SOAP_USERNAME=your-username
SOAP_PASSWORD=your-password
```

**Security Note**: Never commit `.env` files to version control!

---

## Docker Deployment

### Using Docker Compose (Easiest)

1. **Clone the repository**
   ```bash
   git clone https://github.com/sayeed007/team-board.git
   cd team-board
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

3. **Build and start**
   ```bash
   docker-compose up --build -d
   ```

4. **Check status**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

5. **Access the application**
   - Frontend: http://your-server:8080
   - Backend: http://your-server:3000

### Individual Container Deployment

```bash
# Build images
docker build -t teamboard-backend ./backend
docker build -t teamboard-frontend ./frontend

# Run backend
docker run -d \
  --name teamboard-backend \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  teamboard-backend

# Run frontend
docker run -d \
  --name teamboard-frontend \
  -p 8080:8080 \
  -e API_URL="http://your-backend-url:3000" \
  teamboard-frontend
```

---

## Cloud Deployment

### AWS Deployment

#### Option 1: ECS Fargate

1. **Push images to ECR**
   ```bash
   # Authenticate
   aws ecr get-login-password --region us-east-1 | \
     docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

   # Tag and push
   docker tag teamboard-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/teamboard-backend:latest
   docker push <account>.dkr.ecr.us-east-1.amazonaws.com/teamboard-backend:latest
   ```

2. **Create RDS PostgreSQL instance**
   - Engine: PostgreSQL 15
   - Instance class: db.t3.micro (for testing) or db.t3.small (production)
   - Storage: 20GB SSD
   - Enable automated backups

3. **Create ECS Task Definition**
   - Use the ECR image URIs
   - Set environment variables
   - Configure container port mappings
   - Set memory and CPU limits

4. **Create ECS Service**
   - Choose Fargate launch type
   - Configure load balancer (ALB)
   - Set desired task count
   - Enable auto-scaling

#### Option 2: EC2 with Docker Compose

```bash
# SSH to EC2 instance
ssh ec2-user@your-instance

# Install Docker and Docker Compose
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone and deploy
git clone https://github.com/sayeed007/team-board.git
cd team-board
cp .env.example .env
# Edit .env
docker-compose up -d
```

### Azure Deployment

#### Azure Container Apps

1. **Create Azure resources**
   ```bash
   az group create --name teamboard-rg --location eastus

   # Create PostgreSQL
   az postgres flexible-server create \
     --resource-group teamboard-rg \
     --name teamboard-db \
     --admin-user teamboard \
     --admin-password <password> \
     --sku-name Standard_B1ms \
     --version 15
   ```

2. **Create Container Registry**
   ```bash
   az acr create --resource-group teamboard-rg \
     --name teamboardacr --sku Basic
   ```

3. **Push images**
   ```bash
   az acr login --name teamboardacr
   docker tag teamboard-backend teamboardacr.azurecr.io/backend:latest
   docker push teamboardacr.azurecr.io/backend:latest
   ```

4. **Create Container Apps**
   ```bash
   az containerapp create \
     --name teamboard-backend \
     --resource-group teamboard-rg \
     --image teamboardacr.azurecr.io/backend:latest \
     --target-port 3000 \
     --env-vars DATABASE_URL=<connection-string> JWT_SECRET=<secret>
   ```

### Google Cloud Deployment

#### Cloud Run

1. **Build and push to GCR**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/teamboard-backend ./backend
   gcloud builds submit --tag gcr.io/PROJECT_ID/teamboard-frontend ./frontend
   ```

2. **Create Cloud SQL PostgreSQL**
   ```bash
   gcloud sql instances create teamboard-db \
     --database-version=POSTGRES_15 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy teamboard-backend \
     --image gcr.io/PROJECT_ID/teamboard-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars DATABASE_URL=<cloud-sql-connection>,JWT_SECRET=<secret>
   ```

### Render Deployment

#### Backend (Web Service)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npx prisma migrate deploy && node dist/main`
   - **Environment**: Node
4. Add environment variables:
   - `DATABASE_URL` (use Render PostgreSQL)
   - `JWT_SECRET`
   - `NODE_ENV=production`

#### Frontend (Static Site)

1. Create new Static Site on Render
2. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build:prod`
   - **Publish Directory**: `frontend/dist/teamboard-frontend`
3. Add environment variable:
   - `API_URL` (backend URL from Render)

---

## Database Setup

### PostgreSQL Configuration

1. **Create database**
   ```sql
   CREATE DATABASE teamboard;
   CREATE USER teamboard_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE teamboard TO teamboard_user;
   ```

2. **Run migrations**
   ```bash
   cd backend
   DATABASE_URL="postgresql://user:pass@host:5432/teamboard" npx prisma migrate deploy
   ```

3. **Verify connection**
   ```bash
   npx prisma studio
   ```

### Database Backup

```bash
# Backup
pg_dump -h host -U user -d teamboard > backup_$(date +%Y%m%d).sql

# Restore
psql -h host -U user -d teamboard < backup_20240101.sql
```

---

## CI/CD Setup

### GitHub Actions (Already Configured)

The repository includes `.github/workflows/ci-cd.yml` which automatically:
- Runs tests on push/PR
- Builds Docker images
- Pushes to Docker Hub
- Runs security scans

**Required Secrets**:
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password/token

Add these in: Repository Settings → Secrets and variables → Actions

### Continuous Deployment

Extend the workflow to deploy on merge to main:

```yaml
- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: |
    # SSH to server and pull latest images
    ssh user@server "cd /app && docker-compose pull && docker-compose up -d"
```

---

## Monitoring

### Health Checks

- **Backend**: `GET http://backend:3000/health`
- **Frontend**: `GET http://frontend:8080`

### Logging

**Docker Compose**:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Cloud Platforms**:
- AWS: CloudWatch Logs
- Azure: Application Insights
- GCP: Cloud Logging
- Render: Built-in logs

### Recommended Monitoring Tools

- **Uptime**: UptimeRobot, Pingdom
- **APM**: Datadog, New Relic, Sentry
- **Logs**: LogRocket, Papertrail

---

## Troubleshooting

### Backend Won't Start

1. **Check database connection**
   ```bash
   docker-compose logs backend | grep -i error
   ```

2. **Verify environment variables**
   ```bash
   docker-compose exec backend env | grep DATABASE_URL
   ```

3. **Run migrations manually**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

### Frontend Can't Connect to Backend

1. **Check API_URL environment variable**
2. **Verify CORS settings** in backend `.env`
3. **Check network connectivity**

### Database Migration Failed

```bash
# Reset migrations (dev only!)
npx prisma migrate reset

# Deploy specific migration
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

### Container Memory Issues

Increase memory limits in `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
```

---

## Post-Deployment Checklist

- [ ] Database backups configured
- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] Monitoring/alerting set up
- [ ] Health checks verified
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Logs being collected
- [ ] CI/CD pipeline tested
- [ ] Documentation updated

---

## Security Best Practices

1. **Use HTTPS** in production
2. **Rotate JWT secrets** regularly
3. **Enable database connection pooling**
4. **Set up WAF** (Web Application Firewall)
5. **Regular security updates** via Dependabot
6. **Monitor for vulnerabilities** with Snyk/Trivy
7. **Implement rate limiting** (already in backend)
8. **Use secrets management** (AWS Secrets Manager, Azure Key Vault, etc.)

---

## Need Help?

- Check [GitHub Issues](https://github.com/sayeed007/team-board/issues)
- Review [Architecture Documentation](docs/Architecture_Plan.md)
- Contact: [Create an issue](https://github.com/sayeed007/team-board/issues/new)
