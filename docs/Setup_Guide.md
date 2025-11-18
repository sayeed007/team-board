# TeamBoard - Complete Setup Guide

This guide will walk you through setting up the TeamBoard development environment from scratch.

---

## Prerequisites

### Required Software

1. **Node.js 20.x LTS or higher**
   ```bash
   # Check version
   node --version  # Should be v20.x.x or higher
   npm --version   # Should be 10.x.x or higher
   ```

   **Installation:**
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use nvm (recommended):
     ```bash
     # Install nvm
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

     # Install Node.js
     nvm install 20
     nvm use 20
     ```

2. **Docker & Docker Compose**
   ```bash
   # Check versions
   docker --version          # Should be 24.x or higher
   docker-compose --version  # Should be 2.x or higher
   ```

   **Installation:**
   - **Windows/Mac**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - **Linux**:
     ```bash
     # Ubuntu/Debian
     sudo apt-get update
     sudo apt-get install docker.io docker-compose

     # Add user to docker group
     sudo usermod -aG docker $USER
     ```

3. **Git**
   ```bash
   # Check version
   git --version  # Should be 2.x or higher
   ```

   **Installation:**
   - Download from [git-scm.com](https://git-scm.com/)
   - Or via package manager:
     ```bash
     # macOS
     brew install git

     # Ubuntu/Debian
     sudo apt-get install git
     ```

### Optional Tools

- **VS Code** (recommended IDE): [code.visualstudio.com](https://code.visualstudio.com/)
- **Postman** or **Insomnia** (for API testing)
- **pgAdmin** or **TablePlus** (for database management)

---

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/sayeed007/team-board.git
cd team-board

# Verify you're in the correct directory
pwd  # Should show /path/to/team-board
ls   # Should show: apps/, libs/, docs/, etc.
```

---

## Step 2: Install Dependencies

```bash
# Install all npm packages (backend + frontend + shared libraries)
npm install

# This will install:
# - Nx CLI and workspace dependencies
# - NestJS and backend dependencies
# - Angular and frontend dependencies
# - All shared library dependencies
```

**Expected output:**
```
added 2000+ packages in 2m
```

**Troubleshooting:**
- If you see permission errors, don't use `sudo npm install`
- Instead, fix npm permissions: https://docs.npmjs.com/resolving-eacces-permissions-errors
- If installation fails, try:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## Step 3: Environment Configuration

### Backend Configuration

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file:**
   ```bash
   # Use your favorite editor
   nano .env
   # or
   code .env
   ```

3. **Update critical variables:**
   ```env
   # Database (leave as-is for local Docker setup)
   DATABASE_URL=postgresql://teamboard_user:teamboard_pass@localhost:5432/teamboard_dev

   # JWT Secret (IMPORTANT: Change this!)
   JWT_SECRET=your-unique-secret-key-here

   # CORS (allow frontend)
   CORS_ORIGIN=http://localhost:4200
   ```

4. **Generate a secure JWT secret:**
   ```bash
   # On Linux/Mac
   openssl rand -base64 32

   # Or use Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

   # Copy the output and paste it as JWT_SECRET in .env
   ```

### Frontend Configuration

Create `apps/web/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  appName: 'TeamBoard',
};
```

Create `apps/web/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.teamboard.com', // Update with your production API URL
  appName: 'TeamBoard',
};
```

---

## Step 4: Start PostgreSQL Database

### Option 1: Using Docker Compose (Recommended)

1. **Start PostgreSQL container:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Verify container is running:**
   ```bash
   docker-compose ps

   # You should see:
   # NAME                COMMAND                  STATUS
   # teamboard-postgres  "docker-entrypoint.s…"   Up
   ```

3. **Check logs (optional):**
   ```bash
   docker-compose logs postgres
   ```

4. **Connect to database (verify):**
   ```bash
   docker exec -it teamboard-postgres psql -U teamboard_user -d teamboard_dev

   # Inside psql:
   \l        # List databases
   \q        # Quit
   ```

### Option 2: Local PostgreSQL Installation

If you prefer to install PostgreSQL locally instead of using Docker:

1. **Install PostgreSQL:**
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15

   # Ubuntu/Debian
   sudo apt-get install postgresql-15
   sudo systemctl start postgresql
   ```

2. **Create database and user:**
   ```bash
   sudo -u postgres psql

   # In PostgreSQL prompt:
   CREATE USER teamboard_user WITH PASSWORD 'teamboard_pass';
   CREATE DATABASE teamboard_dev OWNER teamboard_user;
   GRANT ALL PRIVILEGES ON DATABASE teamboard_dev TO teamboard_user;
   \q
   ```

3. **Update `.env`:**
   ```env
   DATABASE_URL=postgresql://teamboard_user:teamboard_pass@localhost:5432/teamboard_dev
   ```

---

## Step 5: Database Setup

### Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# You should see:
# ✔ Applying migration `20250118_init`
# ✔ Generated Prisma Client
```

### Seed Database (Optional)

```bash
# Seed with sample data for development
npx prisma db seed

# This will create:
# - 1 organization (Acme Corp)
# - 1 admin user (admin@acme.com / password123)
# - 2 teams (Engineering, Marketing)
# - Sample boards, lists, and cards
```

### Verify Database Schema

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Opens in browser at http://localhost:5555
# You can view and edit data visually
```

---

## Step 6: Start Development Servers

### Option 1: Run Both Apps Simultaneously

**In separate terminals:**

**Terminal 1 - Backend API:**
```bash
cd team-board
nx serve api

# Expected output:
# ✔ Nx server ready on http://localhost:3000
# ✔ Swagger docs: http://localhost:3000/api
```

**Terminal 2 - Frontend Web:**
```bash
cd team-board
nx serve web

# Expected output:
# ✔ Angular server ready on http://localhost:4200
```

### Option 2: Run Concurrently (Single Terminal)

```bash
# Install concurrently (if not already installed)
npm install -g concurrently

# Run both servers
npm run dev

# Or use Nx parallel execution:
nx run-many --target=serve --projects=api,web --parallel
```

---

## Step 7: Verify Installation

### Backend Health Check

1. **Open browser to:** http://localhost:3000/health
   - Expected: `{"status":"ok","database":"connected"}`

2. **Access Swagger API docs:** http://localhost:3000/api
   - You should see interactive API documentation

3. **Test authentication endpoint:**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@acme.com","password":"password123"}'

   # Expected response:
   # {"token":"eyJhbGciOiJIUzI1NiIs...","user":{...}}
   ```

### Frontend Verification

1. **Open browser to:** http://localhost:4200
   - You should see the TeamBoard login page

2. **Test login:**
   - Email: `admin@acme.com`
   - Password: `password123`
   - Should redirect to dashboard

---

## Step 8: IDE Configuration (VS Code)

### Recommended Extensions

Install these VS Code extensions for best experience:

1. **Angular Language Service** (`Angular.ng-template`)
2. **Nx Console** (`nrwl.angular-console`)
3. **Prisma** (`Prisma.prisma`)
4. **ESLint** (`dbaeumer.vscode-eslint`)
5. **Prettier** (`esbenp.prettier-vscode`)
6. **GitLens** (`eamodio.gitlens`)
7. **Docker** (`ms-azuretools.vscode-docker`)

### Workspace Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true
  }
}
```

### Launch Configuration

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "nx",
      "runtimeArgs": ["serve", "api", "--inspect"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

---

## Step 9: Run Tests

### Unit Tests

```bash
# Run all tests
nx run-many --target=test --all

# Run backend tests only
nx test api

# Run frontend tests only
nx test web

# Run tests with coverage
nx test api --coverage
```

### E2E Tests

```bash
# Run end-to-end tests
nx e2e web-e2e
```

---

## Step 10: Build for Production

### Build All Applications

```bash
# Build backend
nx build api --configuration=production

# Build frontend
nx build web --configuration=production

# Build all
nx run-many --target=build --all --configuration=production
```

**Output locations:**
- Backend: `dist/apps/api/`
- Frontend: `dist/apps/web/`

---

## Common Issues & Troubleshooting

### Issue 1: Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Issue 2: Database Connection Failed

**Error:** `Can't reach database server at localhost:5432`

**Solution:**
```bash
# Check if Docker container is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Issue 3: Prisma Migration Failed

**Error:** `Migration failed to apply`

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually connect and drop tables
docker exec -it teamboard-postgres psql -U teamboard_user -d teamboard_dev

# Drop all tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

# Then re-run migrations
npx prisma migrate dev
```

### Issue 4: Node Modules Issues

**Error:** Various module not found errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue 5: TypeScript Errors

**Error:** `Cannot find module` or type errors

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Press: Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)
# Type: "TypeScript: Restart TS Server"

# Or rebuild
nx reset
npm install
```

---

## Next Steps

Now that your development environment is set up:

1. **Explore the codebase:**
   - Review [Architecture Plan](Architecture_Plan.md)
   - Study [Database Schema](Database_Schema.md)
   - Understand [Data Flows](Data_Flow_Diagrams.md)

2. **Start developing:**
   - Create a new feature branch
   - Make changes
   - Run tests
   - Commit and push

3. **Review documentation:**
   - [Functional Requirements](TeamBoard%20Functional%20Requirements.md)
   - [Nx Monorepo Structure](Nx_Monorepo_Structure.md)

---

## Development Workflow

### Daily Development

```bash
# 1. Start database
docker-compose up -d postgres

# 2. Start dev servers (in separate terminals)
nx serve api
nx serve web

# 3. Make changes and test
# 4. Run tests before committing
nx affected:test

# 5. Lint code
nx affected:lint

# 6. Commit changes
git add .
git commit -m "feat: add new feature"
```

### Creating New Features

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Generate module/component
nx g @nx/nest:module my-module --project=api
nx g @angular/core:component my-component --project=web

# 3. Develop and test
nx test api
nx test web

# 4. Build
nx build api
nx build web

# 5. Commit and push
git push origin feature/my-feature
```

---

## Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: https://github.com/sayeed007/team-board/issues
- **Nx Docs**: https://nx.dev/
- **NestJS Docs**: https://docs.nestjs.com/
- **Angular Docs**: https://angular.io/docs

---

**Happy coding! 🚀**
