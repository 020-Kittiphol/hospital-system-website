import { NextResponse } from 'next/server';
const pool = require('@/app/models/db_pool');

export async function POST(request) {
    try {
        const body = await request.json();
        const { user_id, doctor_id, department_id, appointment_date, symptoms } = body;

        if (!user_id || !doctor_id || !department_id || !appointment_date) {
            return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
        }

        const [result] = await pool.query(
            `INSERT INTO appointments (user_id, doctor_id, department_id, appointment_date, symptoms)
             VALUES (?, ?, ?, ?, ?)`,
            [user_id, doctor_id, department_id, appointment_date, symptoms || '']
        );

        return NextResponse.json({ message: "บันทึกการนัดหมายสำเร็จ", appointmentId: result.insertId }, { status: 201 });

    } catch (error) {
        console.error("Appointment Error:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกการนัดหมาย" }, { status: 500 });
    }
}