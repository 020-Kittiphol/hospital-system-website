import { NextResponse } from 'next/server';
const pool = require('@/app/models/db_pool');

export async function DELETE(req, { params }) {
    await pool.query(
        "DELETE FROM department WHERE department_id=?",
        [params.id]
    );

    return NextResponse.json({ message: "ลบสำเร็จ" });
}

export async function PUT(req, { params }) {
    const body = await req.json();

    await pool.query(
        "UPDATE department SET department_name=? WHERE department_id=?",
        [body.department_name, params.id]
    );

    return NextResponse.json({ message: "แก้ไขสำเร็จ" });
}