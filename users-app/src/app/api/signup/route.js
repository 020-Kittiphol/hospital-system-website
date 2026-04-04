import { NextResponse } from 'next/server';
const pool = require('@/app/models/db_pool');

import md5 from 'md5'; // 🌟 1. เปลี่ยนมา import md5

export async function POST(request) {
    try {
        const body = await request.json();
        
        const { username, password, first_name, last_name, age, citizen_id, gender, weight, height } = body;

        const [existingUsers] = await pool.query('SELECT username FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return NextResponse.json({ error: "Username นี้ถูกใช้งานแล้ว กรุณาใช้ชื่ออื่น" }, { status: 400 });
        }

        const hashedPassword = md5(password);

        const role_id = 2; 

        const [result] = await pool.query(
            `INSERT INTO users 
            (username, password, first_name, last_name, age, citizen_id, gender, weight, height, role_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [username, hashedPassword, first_name, last_name, age || 0, citizen_id, gender, weight || 0, height || 0, role_id]
        );

        return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ", userId: result.insertId }, { status: 201 });

    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }, { status: 500 });
    }
}