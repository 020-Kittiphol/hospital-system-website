import { NextResponse } from "next/server";
// แก้ Path ให้ถอยออกไป 2 ชั้นเพื่อให้เจอโฟลเดอร์ models
import pool from "../../models/db_pool"; 

export async function POST(request) {
  try {
    const body = await request.json();
    const { doctor_name, department_id } = body; 

    // แยกชื่อและนามสกุล
    const nameParts = doctor_name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || "";

    // SQL: ตัด tel_numdoc ออก และเช็คว่าไม่มีเครื่องหมาย ' เกินหน้า VALUES
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