import { neon } from "@neondatabase/serverless";

import dotenv from "dotenv";

dotenv.config();

export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    console.log("Connecting to database...");
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
}
