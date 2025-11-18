# Getting Started Guide - Running TeamBoard

This guide will help you get TeamBoard up and running on your local machine for development or testing.

## Table of Contents
- [Quick Start with Docker](#quick-start-with-docker)
- [Local Development Setup](#local-development-setup)
- [Troubleshooting](#troubleshooting)
- [Useful Commands](#useful-commands)

---

## Quick Start with Docker

**Recommended for:** Testing, quick demos, or if you prefer containerized development

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) 24.x or higher
- [Docker Compose](https://docs.docker.com/compose/install/) 2.x or higher
- [Git](https://git-scm.com/downloads)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/sayeed007/team-board.git
   cd team-board
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

   This single command will:
   - Start PostgreSQL database
   - Build and start the backend API
   - Build and start the frontend
   - Run database migrations automatically

3. **Wait for services to be ready** (about 1-2 minutes for first build)
   ```bash
   # Check the status
   docker-compose ps

   # Watch the logs
   docker-compose logs -f
   ```

4. **Access the application**
   - **Frontend (Angular)**: http://localhost:8080
   - **Backend API**: http://localhost:3000
   - **API Documentation (Swagger)**: http://localhost:3000/api
   - **PostgreSQL**: localhost:5432

5. **Stop the application**
   ```bash
   # Stop containers
   docker-compose down

   # Stop and remove data (⚠️ deletes database)
   docker-compose down -v
   ```

### Docker Commands Cheat Sheet

```bash
# Start in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up --build -d

# View logs
docker-compose logs -f          # All services
docker-compose logs -f backend  # Backend only
docker-compose logs -f frontend # Frontend only

# Restart a specific service
docker-compose restart backend

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# View database
docker-compose exec postgres psql -U teamboard_user -d teamboard_dev
```

---

## Local Development Setup

**Recommended for:** Active development, debugging, or learning the codebase

### Prerequisites
- [Node.js](https://nodejs.org/) 20.x LTS or higher
- [npm](https://www.npmjs.com/) 10.x or higher
- [Docker](https://docs.docker.com/get-docker/) (for PostgreSQL only)
- [Git](https://git-scm.com/downloads)

### Part 1: Clone and Install

1. **Clone the repository**
   ```bash
   git clone https://github.com/sayeed007/team-board.git
   cd team-board
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

   This may take 1-2 minutes.

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

   This may take 2-3 minutes.

### Part 2: Setup Database

4. **Start PostgreSQL with Docker**
   ```bash
   cd ..
   docker-compose up -d postgres
   ```

5. **Verify PostgreSQL is running**
   ```bash
   docker-compose ps postgres
   # Should show "Up" status
   ```

6. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```

   The defaults are fine for local development. You can edit `.env` if needed.

7. **Run database migrations**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

   This creates all database tables.

8. **Verify database schema** (optional)
   ```bash
   npx prisma studio
   ```

   Opens a browser at http://localhost:5555 to view/edit database.

### Part 3: Start the Applications

You'll need **two terminal windows** (or use a terminal multiplexer like tmux).

#### Terminal 1: Backend

```bash
cd backend
npm run start:dev
```

**Expected output:**
```
[Nest] 12345  - 01/01/2024, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 01/01/2024, 10:00:01 AM     LOG [InstanceLoader] AppModule dependencies initialized
...
[Nest] 12345  - 01/01/2024, 10:00:02 AM     LOG [NestApplication] Nest application successfully started
[Nest] 12345  - 01/01/2024, 10:00:02 AM     LOG Application is running on: http://localhost:3000
```

**Backend is ready when you see:** `Application is running on: http://localhost:3000`

- **API Endpoint**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api

The backend will **auto-reload** when you save changes to `.ts` files.

#### Terminal 2: Frontend

```bash
cd frontend
npm start
```

**Expected output:**
```
✔ Browser application bundle generation complete.
Initial Chunk Files   | Names         |  Raw Size
main.js               | main          |   2.5 MB |
...
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

**Frontend is ready when you see:** `Compiled successfully.`

- **Frontend URL**: http://localhost:4200

The frontend will **auto-reload** when you save changes to `.ts`, `.html`, or `.scss` files.

### Part 4: Verify Everything Works

1. **Open your browser** to http://localhost:4200

2. **You should see** the TeamBoard login page

3. **Test the API** (optional):
   ```bash
   # In a third terminal
   curl http://localhost:3000/health
   # Should return: {"status":"ok"}
   ```

4. **View API documentation**:
   - Open http://localhost:3000/api in your browser
   - You'll see interactive Swagger API docs

---

## Troubleshooting

### Backend Issues

#### Error: "Cannot connect to database"

**Problem**: PostgreSQL is not running or connection string is wrong.

**Solution**:
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# If not running, start it
docker-compose up -d postgres

# Check database connection
cd backend
npx prisma studio  # Should open without errors
```

#### Error: "Port 3000 is already in use"

**Problem**: Another service is using port 3000.

**Solution**:
```bash
# Find what's using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Option 1: Stop that service
# Option 2: Change backend port in backend/.env
PORT=3001
```

#### Error: "Prisma Client has not been generated"

**Problem**: Prisma client needs to be generated after fresh install.

**Solution**:
```bash
cd backend
npx prisma generate
```

#### Backend starts but shows errors

**Solution**:
```bash
# Check backend logs
cd backend
npm run start:dev

# Common fixes:
# 1. Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Reset database (⚠️ deletes all data)
npx prisma migrate reset

# 3. Check .env file exists
ls -la .env
```

### Frontend Issues

#### Error: "Port 4200 is already in use"

**Problem**: Another Angular app is running.

**Solution**:
```bash
# Kill the other process or use different port
npm start -- --port 4201
```

#### Frontend shows blank page or errors

**Solution**:
```bash
# Check if backend is running
curl http://localhost:3000/health

# Clear Angular cache and rebuild
cd frontend
rm -rf .angular dist node_modules package-lock.json
npm install
npm start
```

#### CORS errors in browser console

**Problem**: Backend CORS is not configured for frontend URL.

**Solution**:
```bash
# In backend/.env (or .env in root), ensure:
CORS_ORIGIN=http://localhost:4200

# Restart backend
cd backend
# Ctrl+C to stop, then:
npm run start:dev
```

### Database Issues

#### Error: "Migration failed"

**Solution**:
```bash
# Reset database (⚠️ deletes all data)
cd backend
npx prisma migrate reset

# Or manually reset
docker-compose down -v
docker-compose up -d postgres
npx prisma migrate dev
```

#### Can't connect to PostgreSQL

**Solution**:
```bash
# Check if container is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres

# If still failing, recreate
docker-compose down postgres
docker-compose up -d postgres
```

### Docker Issues

#### Error: "Cannot connect to Docker daemon"

**Problem**: Docker is not running.

**Solution**:
- **macOS**: Open Docker Desktop
- **Linux**: `sudo systemctl start docker`
- **Windows**: Start Docker Desktop

#### Containers won't start

**Solution**:
```bash
# Check Docker logs
docker-compose logs

# Remove old containers and rebuild
docker-compose down
docker-compose up --build -d

# If still failing, prune Docker
docker system prune -a
```

---

## Useful Commands

### Development Workflow

```bash
# Backend development
cd backend
npm run start:dev      # Start with auto-reload
npm run build          # Build for production
npm test               # Run unit tests
npm run test:e2e       # Run E2E tests
npm run lint           # Check code style
npm run format         # Format code

# Frontend development
cd frontend
npm start              # Start with auto-reload (port 4200)
npm run build:prod     # Build for production
npm test               # Run unit tests
npm run lint           # Check code style
npm run format         # Format code
```

### Database Management

```bash
cd backend

# Open Prisma Studio (visual database editor)
npx prisma studio

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Seed database (if seed file exists)
npx prisma db seed
```

### Docker Operations

```bash
# Start everything
docker-compose up -d

# Start with rebuild
docker-compose up --build -d

# Stop everything
docker-compose down

# Stop and remove volumes (⚠️ deletes database)
docker-compose down -v

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Restart a service
docker-compose restart backend

# Execute command in container
docker-compose exec backend npm test
docker-compose exec postgres psql -U teamboard_user -d teamboard_dev

# Check service status
docker-compose ps

# See resource usage
docker stats
```

### Testing the API

```bash
# Using curl
curl http://localhost:3000/health

# Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "organizationName": "Test Org"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Or use the Swagger UI
open http://localhost:3000/api  # macOS
start http://localhost:3000/api # Windows
xdg-open http://localhost:3000/api # Linux
```

### Git Workflow

```bash
# Create a feature branch
git checkout -b feature/my-feature

# See what changed
git status
git diff

# Commit changes
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature

# Pull latest changes
git pull origin main
```

---

## Quick Reference

### URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:4200 | Angular app (local dev) |
| Frontend | http://localhost:8080 | Angular app (Docker) |
| Backend API | http://localhost:3000 | NestJS API |
| Swagger Docs | http://localhost:3000/api | Interactive API docs |
| Prisma Studio | http://localhost:5555 | Database GUI |
| PostgreSQL | localhost:5432 | Database |

### Default Credentials

| Service | User | Password | Database |
|---------|------|----------|----------|
| PostgreSQL | `teamboard_user` | `teamboard_pass` | `teamboard_dev` |

### Environment Variables

Key variables in `.env`:

```env
# Backend
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://teamboard_user:teamboard_pass@localhost:5432/teamboard_dev
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:4200

# Docker
POSTGRES_USER=teamboard_user
POSTGRES_PASSWORD=teamboard_pass
POSTGRES_DB=teamboard_dev
BACKEND_PORT=3000
FRONTEND_PORT=8080
```

---

## Next Steps

Now that you have TeamBoard running:

1. **Create an account**: Register a user at http://localhost:4200
2. **Explore the API**: Check out http://localhost:3000/api
3. **Read the docs**: See [README.md](README.md) for full documentation
4. **Start developing**: Check [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
5. **Deploy**: See [DEPLOYMENT.md](DEPLOYMENT.md) when ready for production

---

## Need Help?

- **Documentation**: Check [docs/](docs/) folder
- **Issues**: [GitHub Issues](https://github.com/sayeed007/team-board/issues)
- **API Reference**: http://localhost:3000/api
- **Database Schema**: [docs/Database_Schema.md](docs/Database_Schema.md)

---

Happy coding! 🚀
