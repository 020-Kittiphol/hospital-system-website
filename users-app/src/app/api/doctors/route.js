// ไฟล์: src/app/api/doctors/route.js
import { NextResponse } from 'next/server';
const pool = require('../../models/db_pool');

export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM doctor');
        
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { first_name, last_name, department_id, tel_numdoc } = body;

        const [result] = await pool.query(
            'INSERT INTO doctor (first_name, last_name, department_id, tel_numdoc) VALUES (?, ?, ?, ?)',
            [first_name, last_name, department_id, tel_numdoc]
        );

        return NextResponse.json({ message: "เพิ่มข้อมูลแพทย์สำเร็จ", id: result.insertId }, { status: 201 });
        
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}