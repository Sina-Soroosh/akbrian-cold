import { Client } from "pg";
import { createTableUsers } from "./tableDB";

let globalClient: Client | null = null;

const connectToDB = async () => {
  try {
    globalClient = new Client({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
    });

    await globalClient.connect();

    await createTableUsers(globalClient);

    console.log("CONNECT TO DB SUCCESSFULLY");
  } catch (error) {
    console.log("ERROR TO CONNECT TO DB : ", error);
    globalClient = null;
  }
};

const getClient = async () => {
  if (!globalClient) {
    await connectToDB();
  }

  return globalClient;
};

export default getClient;
