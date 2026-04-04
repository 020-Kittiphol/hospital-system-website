import { NextResponse } from 'next/server';
const pool = require('@/app/models/db_pool');

export async function POST(request) {
    try {
        const body = await request.json();
        const { user_id, symptoms } = body;

        if (!user_id) {
            return NextResponse.json({ error: "ไม่พบ user_id" }, { status: 400 });
        }

        await pool.query(
            `UPDATE users SET symptoms = ? WHERE user_id = ?`,
            [symptoms, user_id]
        );

        return NextResponse.json({ message: "อัปเดตอาการสำเร็จ" }, { status: 200 });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }, { status: 500 });
    }
}