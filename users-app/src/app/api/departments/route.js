import { NextResponse } from 'next/server';
const pool = require('@/app/models/db_pool');

// GET: ดึงข้อมูลทั้งหมด
export async function GET() {
    try {
        const [rows] = await pool.query("SELECT * FROM department ORDER BY department_id ASC");
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: เพิ่มข้อมูลใหม่
export async function POST(req) {
    try {
        const body = await req.json();
        const { department_name, department_date, department_id_code } = body;
        await pool.query(
            "INSERT INTO department (department_name, department_date, department_id_code) VALUES (?, ?, ?)",
            [department_name, department_date, department_id_code]
        );
        return NextResponse.json({ message: "Success" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: แก้ไขข้อมูล
export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id'); // รับค่าจาก ?id=...
        const body = await req.json();
        const { department_name, department_date, department_id_code } = body;
        await pool.query(
            "UPDATE department SET department_name=?, department_date=?, department_id_code=? WHERE department_id=?",
            [department_name, department_date, department_id_code, id]
        );
        return NextResponse.json({ message: "Updated" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: ลบข้อมูล
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id'); 
        await pool.query("DELETE FROM department WHERE department_id=?", [id]);
        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}