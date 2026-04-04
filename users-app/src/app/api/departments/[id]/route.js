import { NextResponse } from 'next/server';
const pool = require('@/app/models/db_pool');

export async function GET() {
    const [rows] = await pool.query("SELECT * FROM department ORDER BY department_id DESC");
    return NextResponse.json(rows);
}

export async function POST(req) {
    try {
        const body = await req.json();
        // รับค่าให้ตรงกับที่ Frontend ส่งมา
        const { department_name, department_date } = body;

        await pool.query(
            "INSERT INTO department (department_name, department_date) VALUES (?, ?)",
            [department_name, department_date]
        );

        return NextResponse.json({ message: "เพิ่มสำเร็จ" });
    } catch (error) {
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}