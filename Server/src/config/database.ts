import { Pool } from "pg";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const connectDB = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT version()");
    console.log("PostgreSQL connected successfully");
    console.log(`Database version: ${result.rows[0].version}`);
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    // In development, continue without DB. In production, you might want to exit
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      console.warn(
        "Continuing without database connection in development mode"
      );
    }
  } finally {
    client.release();
  }
};

// Handle pool errors
pool.on("error", (err: Error) => {
  console.error("PostgreSQL pool error:", err);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await pool.end();
  console.log("PostgreSQL pool closed through app termination");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await pool.end();
  console.log("PostgreSQL pool closed through app termination");
  process.exit(0);
});
