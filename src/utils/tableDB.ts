import { Client } from "pg";

export const createTableUsers = async (client: Client) => {
  try {
    const query = `CREATE TABLE IF NOT EXISTS users ( id SERIAL PRIMARY KEY, username VARCHAR(150) UNIQUE NOT NULL, password TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;

    await client.query(query);
  } catch (error) {
    console.log("CREATE TABLE USER HAS ERROR : ", error);
  }
};

export const createTableCustomers = async (client: Client) => {
  try {
    const query = `
    CREATE TABLE IF NOT EXISTS Customers (
        CustomerID SERIAL PRIMARY KEY,
        FirstName VARCHAR(50) NOT NULL,
        LastName VARCHAR(50) NOT NULL,
        NationalCode VARCHAR(10) NOT NULL,
        Phone VARCHAR(20),
        ProductName VARCHAR(100) NOT NULL,
        CONSTRAINT unique_customer_product UNIQUE (NationalCode, ProductName) 
    );
    `;

    await client.query(query);
  } catch (error) {
    console.log("CREATE TABLE Customers HAS ERROR : ", error);
  }
};

export const createTableTransactions = async (client: Client) => {
  try {
    const query = `
    CREATE TABLE IF NOT EXISTS Transactions (
        TransactionID SERIAL PRIMARY KEY,
        CustomerID INT NOT NULL REFERENCES Customers(CustomerID) ON DELETE CASCADE,
        TransactionType VARCHAR(3) NOT NULL CHECK (TransactionType IN ('IN', 'OUT')),
        TransactionDate TIMESTAMP NOT NULL DEFAULT NOW(),
        Weight DECIMAL(10,2) NOT NULL,
        Hall CHAR(1) NOT NULL CHECK (Hall IN ('A','B','C','D','E','F','G','H'))
    );
    `;

    await client.query(query);
  } catch (error) {
    console.log("CREATE TABLE Transactions HAS ERROR : ", error);
  }
};

export const createTableTransactionBaskets = async (client: Client) => {
  try {
    const query = `
    CREATE TABLE IF NOT EXISTS TransactionBaskets (
        TransactionBasketID SERIAL PRIMARY KEY,
        TransactionID INT NOT NULL REFERENCES Transactions(TransactionID) ON DELETE CASCADE,
        BasketCode VARCHAR(20) NOT NULL
    );
    `;

    await client.query(query);
  } catch (error) {
    console.log("CREATE TABLE TransactionBaskets HAS ERROR : ", error);
  }
};
