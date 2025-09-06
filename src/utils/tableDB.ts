import { Client } from "pg";

export const createTableUsers = async (client: Client) => {
  try {
    const query = `CREATE TABLE IF NOT EXISTS users ( id SERIAL PRIMARY KEY, username VARCHAR(150) UNIQUE NOT NULL, password TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;

    await client.query(query);
  } catch (error) {
    console.log("CREATE TABLE USER HAS ERROR : ", error);
  }
};

export const createTableFilledBasketsColdStorage = async (client: Client) => {
  try {
    const query = `
    CREATE TABLE IF NOT EXISTS filledBasketsColdStorage (
    id SERIAL PRIMARY KEY,           
    firstName VARCHAR(50) NOT NULL,           
    lastName VARCHAR(50) NOT NULL,            
    nationalID CHAR(10) NOT NULL,      
    mobileNumber VARCHAR(15) NOT NULL,        
    productName TEXT NOT NULL,        
    weight DECIMAL(10,2) NOT NULL,            
    basketNumbers TEXT[] NOT NULL,            
    occupied BOOLEAN NOT NULL DEFAULT TRUE,   
    entryDate TIMESTAMP NOT NULL,             
    exitDate TIMESTAMP NULL                   
    );
    `;

    await client.query(query);
  } catch (error) {
    console.log("CREATE TABLE FilledBasketsColdStorage HAS ERROR : ", error);
  }
};
