import { NextResponse } from 'next/server';
const pool = require('@/app/models/db_pool');

export async function GET() {
    try {
        const [rows] = await pool.query(
            `SELECT user_id, first_name, last_name, age, gender
             FROM users
             WHERE role_id = 2`
        );
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error("Error fetching patients:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
    }
}

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

export async function PUT(request) {
    try {
        const body = await request.json();
        const { user_id, first_name, last_name, age, gender } = body;

        if (!user_id) {
            return NextResponse.json({ error: "ไม่พบรหัสผู้ใช้" }, { status: 400 });
        }

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