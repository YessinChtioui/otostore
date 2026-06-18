# OTO STORE 🚗

A full-stack, production-ready automotive accessories e-commerce platform for Tunisia.

## 🚀 Features

- **Multi-language (i18n)**: French (default), Arabic (RTL support), English
- **Payment Method**: Cash on Delivery (COD) only
- **Authentication**: JWT sessions with NextAuth v5
- **Roles**: Customer & Admin
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: TailwindCSS with custom OTO STORE brand colors
- **SEO**: Dynamic sitemaps, robots.txt, semantic HTML

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Auth.js (NextAuth)
- **State Management**: Zustand
- **Emails**: Nodemailer

## 📦 Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start Database (Docker)**
   ```bash
   docker-compose up -d db
   ```

3. **Setup Prisma**
   ```bash
   npm run db:push
   npm run db:seed
   npm run db:generate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🐳 Docker Deployment

The project includes a complete `docker-compose.yml` and `Dockerfile` for easy deployment on any VPS.

```bash
# Build and start all services (App + PostgreSQL)
docker-compose up -d --build
```

### Environment Variables (.env.local)
Ensure you set the following in production:
```env
DATABASE_URL="postgresql://otostore:secret@db:5432/otostore?schema=public"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-strong-secret"
ADMIN_EMAIL="admin@otostore.tn"
SMTP_HOST="your-smtp-host"
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
```

## 👥 Seed User
- **Admin**: `admin@otostore.tn` / `Admin123!`
