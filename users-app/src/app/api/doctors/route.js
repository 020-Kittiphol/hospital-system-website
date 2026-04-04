import { NextResponse } from "next/server";
import pool from "../../models/db_pool"; 

export async function POST(request) {
  try {
    const body = await request.json();
    const { doctor_name, department_id } = body; 

    const nameParts = doctor_name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || "";

    const [result] = await pool.query(
      'INSERT INTO doctor (first_name, last_name, department_id) VALUES (?, ?, ?)',
      [first_name, last_name, department_id || null]
    );

    return NextResponse.json({ 
      message: "เพิ่มข้อมูลแพทย์สำเร็จ!", 
      id: result.insertId 
    }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM doctor');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}