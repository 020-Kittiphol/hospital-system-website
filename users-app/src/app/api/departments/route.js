import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

// DELETE
export async function DELETE(req, { params }) {
    await db.query(
        "DELETE FROM department WHERE department_id=?",
        [params.id]
    );

    return NextResponse.json({ message: "ลบสำเร็จ" });
}

// PUT
export async function PUT(req, { params }) {
    const body = await req.json();

    await db.query(
        "UPDATE department SET department_name=? WHERE department_id=?",
        [body.department_name, params.id]
    );

    return NextResponse.json({ message: "แก้ไขสำเร็จ" });
}