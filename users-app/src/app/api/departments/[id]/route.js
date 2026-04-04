import { NextResponse } from 'next/server';
const pool = require('../../../../models/db_pool')

export async function GET() {
    const [rows] = await pool.query("SELECT * FROM department");
    return NextResponse.json(rows);
}

export async function POST(req) {
    const body = await req.json();
    const { department_id, department_name } = body;

    await pool.query(
        "INSERT INTO department (department_id, department_name) VALUES (?, ?)",
        [department_id, department_name]
    );

    return NextResponse.json({ message: "เพิ่มสำเร็จ" })
}