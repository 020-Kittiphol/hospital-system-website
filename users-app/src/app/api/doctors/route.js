// ไฟล์: src/app/api/doctors/route.js
import { NextResponse } from 'next/server';
const pool = require('../../models/db_pool');

// ฟังก์ชัน GET สำหรับดึงข้อมูลหมอทั้งหมด
export async function GET() {
    try {
        // เขียนคำสั่ง SQL ตรงนี้
        const [rows] = await pool.query('SELECT * FROM doctor');
        
        // ส่งข้อมูลกลับไปให้หน้าเว็บในรูปแบบ JSON
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        // 1. รับข้อมูลที่ส่งมาจากหน้าเว็บ
        const body = await request.json();
        const { first_name, last_name, department_id, tel_numdoc } = body;

        // 2. สั่ง MySQL ให้ Insert ข้อมูลลงตาราง doctors
        // (ตรวจสอบชื่อคอลัมน์ใน phpMyAdmin ของเจมให้ตรงกับด้านล่างนี้นะครับ)
        const [result] = await pool.query(
            'INSERT INTO doctor (first_name, last_name, department_id, tel_numdoc) VALUES (?, ?, ?, ?)',
            [first_name, last_name, department_id, tel_numdoc]
        );

        // 3. ตอบกลับว่าบันทึกสำเร็จ
        return NextResponse.json({ message: "เพิ่มข้อมูลแพทย์สำเร็จ", id: result.insertId }, { status: 201 });
        
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}