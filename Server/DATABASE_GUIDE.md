# Database Interaction Guide

## Prerequisites

Make sure your `.env` file has the `DATABASE_URL` configured:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/afrolingo?schema=public"
```

## Available Commands

### 1. Generate Prisma Client

After any schema changes, run:

```bash
npm run db:generate
```

### 2. Create and Run Migrations

To create tables in your database:

```bash
npm run db:migrate
```

This will:

- Create a migration file
- Apply it to your database
- Automatically run `prisma generate`

### 3. Seed Database

Populate your database with initial data:

```bash
npm run db:seed
```

### 4. Open Prisma Studio

Visual database browser:

```bash
npm run db:studio
```

### 5. Reset Database

⚠️ WARNING: This deletes all data!

```bash
npm run db:reset
```

## Step-by-Step: First Time Setup

1. **Setup your database URL** in `.env`
2. **Create your first migration**:

   ```bash
   npm run db:migrate
   ```

   Name it something like "init" when prompted

3. **Seed your database**:

   ```bash
   npm run db:seed
   ```

4. **View your data**:
   ```bash
   npm run db:studio
   ```

## Using Prisma Client in Your Code

```typescript
import { prisma } from "./config/prisma";

// Create a user
const newUser = await prisma.user.create({
  data: {
    email: "user@example.com",
    name: "User Name",
  },
});

// Find all users
const users = await prisma.user.findMany();

// Find one user
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
});

// Update a user
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { name: "New Name" },
});

// Delete a user
await prisma.user.delete({
  where: { id: userId },
});
```

## Troubleshooting

- If you get "Cannot find module '@prisma/client'", run `npm run db:generate`
- If migrations fail, check your database connection in `.env`
- Use `npm run db:studio` to visually inspect your database
