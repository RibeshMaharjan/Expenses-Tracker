import 'dotenv/config';
import pg from "pg";

const pool = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABSE,
  password: process.env.PG_PASSWORD
});

export default { pool };