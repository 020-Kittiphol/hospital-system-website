import { NextResponse } from "next/server";

import pool from "../../../models/db_pool"; 

export async function DELETE(request, context) {
  try {
   
    const params = await context.params;
    const id = params.id;

    console.log("ID ที่จะลบ:", id); 

   
    const [result] = await pool.query(
      'DELETE FROM doctor WHERE doctor_id = ?', 
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "ไม่พบข้อมูลหมอที่จะลบ" }, { status: 404 });
    }

    return NextResponse.json({ message: "ลบสำเร็จ" });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" }, { status: 500 });
  }
}


export async function PUT(request, context) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();
    const { doctor_name, department_id } = body; // ไม่รับ phone แล้ว

    const nameParts = doctor_name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || "";

    // ตัด tel_num = ? ออกจากคำสั่ง SQL
    const [result] = await pool.query(
      'UPDATE doctor SET first_name = ?, last_name = ?, department_id = ? WHERE doctor_id = ?',
      [
        first_name, 
        last_name, 
        department_id || null, 
        id
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "ไม่พบรหัสแพทย์" }, { status: 404 });
    }

    return NextResponse.json({ message: "สำเร็จ" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}