import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: "postgresql://neondb_owner:npg_G0Ra7FZPxLhW@ep-summer-river-adr25leo-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require",
  },
});
