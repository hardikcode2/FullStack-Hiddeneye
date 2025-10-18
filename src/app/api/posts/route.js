import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hardikSQL2#",
    database: "hiddeneye",
  });

  const [rows] = await connection.execute(
    "SELECT posts.*, users.email, users.college FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC"
  );

  await connection.end();
  return NextResponse.json(rows);
}
