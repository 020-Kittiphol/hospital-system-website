import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

// GET
export async function GET() {
    const [rows] = await db.query("SELECT * FROM department");
    return NextResponse.json(rows);
}

// POST
export async function POST(req) {
    const body = await req.json();
    const { department_id, department_name } = body;

    await db.query(
        "INSERT INTO department (department_id, department_name) VALUES (?, ?)",
        [department_id, department_name]
    );

    return NextResponse.json({ message: "เพิ่มสำเร็จ" });
}