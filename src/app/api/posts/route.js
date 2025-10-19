import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { getDBConnection } from "@/lib/db";


export async function GET() {
  const db = await getDBConnection();


  const [rows] = await db.execute(
    "SELECT posts.*, users.email, users.college FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC"
  );

  
  return NextResponse.json(rows);
}
