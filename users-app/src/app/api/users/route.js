import { NextResponse } from 'next/server';
const pool = require('@/app/models/db_pool');

// 🌟 1. ดึงข้อมูล (GET)
export async function GET() {
    try {
        const [rows] = await pool.query(
            `SELECT 
                u.user_id, u.first_name, u.last_name, u.age, u.gender, 
                (SELECT symptoms FROM appointment WHERE user_id = u.user_id ORDER BY app_date DESC LIMIT 1) AS symptoms
             FROM users u
             WHERE u.role_id = 2`
        );
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error("Error fetching patients:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
    }
}

// 🌟 2. ลบข้อมูล (DELETE)
export async function DELETE(request) {
    try {
        const body = await request.json();
        const { user_id } = body;

        if (!user_id) {
            return NextResponse.json({ error: "ไม่พบรหัสผู้ใช้ที่ต้องการลบ" }, { status: 400 });
        }

        await pool.query('DELETE FROM appointment WHERE user_id = ?', [user_id]); 
        await pool.query('DELETE FROM users WHERE user_id = ?', [user_id]); 

        return NextResponse.json({ message: "ลบข้อมูลเรียบร้อย" }, { status: 200 });

    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "ลบข้อมูลไม่สำเร็จ" }, { status: 500 });
    }
}

// 🌟 3. แก้ไขข้อมูล (PUT) - ตัวที่เจมลืมใส่ครับ! 😆
export async function PUT(request) {
    try {
        const body = await request.json();
        const { user_id, first_name, last_name, age, gender } = body;

        // เช็คว่าส่ง ID มาไหม
        if (!user_id) {
            return NextResponse.json({ error: "ไม่พบรหัสผู้ใช้" }, { status: 400 });
        }

        // อัปเดตข้อมูลลงฐานข้อมูล
        await pool.query(
            `UPDATE users SET first_name = ?, last_name = ?, age = ?, gender = ? WHERE user_id = ?`,
            [first_name, last_name, age || 0, gender, user_id]
        );

        return NextResponse.json({ message: "แก้ไขข้อมูลสำเร็จ" }, { status: 200 });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "แก้ไขข้อมูลไม่สำเร็จ" }, { status: 500 });
    }
}