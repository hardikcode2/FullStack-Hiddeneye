import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hardikSQL2#",
  database: "hiddeneye",
});
