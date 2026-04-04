import { NextResponse } from "next/server";
// อย่าลืม import pool เข้ามาด้วยนะครับ ถ้ายังไม่มี (ไม่งั้นจะขึ้น Error: pool is not defined)
import pool from "../../../models/db_pool"; // (เปลี่ยน path ให้ตรงกับไฟล์ตั้งค่า Database ของคุณ)

export async function DELETE(request, context) {
  try {
    // 1. 🚨 จุดสำคัญที่ต้องแก้: ต้องใส่ await ก่อนเรียกใช้ context.params
    const params = await context.params;
    const id = params.id;

    console.log("ID ที่จะลบ:", id); // เอาไว้เช็คใน Terminal

    // 2. โค้ดสำหรับลบข้อมูลใน Database ของคุณ
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

// ... (โค้ด DELETE เดิมของคุณอยู่ด้านบน) ...

// ... (ฟังก์ชัน DELETE ของคุณยังอยู่เหมือนเดิมด้านบนนะครับ) ...

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const id = params.id;
    const { doctor_name, department_id, phone } = await request.json();

    if (!doctor_name) {
      return NextResponse.json({ error: "กรุณาระบุชื่อแพทย์" }, { status: 400 });
    }

    // แยกชื่อและนามสกุลจาก doctor_name ที่ส่งมา
    const nameParts = doctor_name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || "";

    // SQL Update ให้ตรงกับคอลัมน์ใน DB ของคุณ
    const [result] = await pool.query(
      'UPDATE doctor SET first_name = ?, last_name = ?, department_id = ?, tel_numdoc = ? WHERE doctor_id = ?',
      [first_name, last_name, department_id || null, phone || null, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "ไม่พบรหัสแพทย์นี้" }, { status: 404 });
    }

    return NextResponse.json({ message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "เซิร์ฟเวอร์ขัดข้อง" }, { status: 500 });
  }
}