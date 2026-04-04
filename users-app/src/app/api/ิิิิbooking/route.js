import { NextResponse } from 'next/server';
const pool = require('@/app/models/db_pool');

export async function GET() {
    try {
        const [departments] = await pool.query('SELECT * FROM department');
        const [doctors] = await pool.query('SELECT * FROM doctor');

        return NextResponse.json({ departments, doctors }, { status: 200 });

    } catch (error) {
        console.error("Error fetching booking data:", error);
        return NextResponse.json({ error: "ดึงข้อมูลไม่สำเร็จ" }, { status: 500 });
    }
}