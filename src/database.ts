import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

export const connection = new Pool({
  connectionString: process.env.DATABASE_URL
});