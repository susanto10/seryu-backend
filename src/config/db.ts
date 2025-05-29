import knex, { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const knexConfig: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 2,
    max: 10,
  },
};

const db = knex(knexConfig);

export default db;
