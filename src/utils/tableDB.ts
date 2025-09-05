import { Client } from "pg";

export const createTableUsers = async (client: Client) => {
  try {
    const query = `CREATE TABLE IF NOT EXISTS users ( id SERIAL PRIMARY KEY, username VARCHAR(150) UNIQUE NOT NULL, password TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;

    await client.query(query);
  } catch (error) {
    console.log("CREATE TABLE USER HAS ERROR : ", error);
  }
};
