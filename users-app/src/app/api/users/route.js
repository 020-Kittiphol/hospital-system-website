import { NextResponse } from 'next/server';
const pool = require('@/app/models/db_pool');

// 🌟 1. ฟังก์ชันดึงข้อมูลคนไข้ (GET) - ต้องพิมพ์ใหญ่เสมอ!
export async function GET() {
    try {
        // ใช้ Subquery ดึงอาการล่าสุดจากตาราง appointment มาโชว์
        const [rows] = await pool.query(
            `SELECT 
                u.user_id, u.first_name, u.last_name, u.age, u.gender, 
                (SELECT symptoms FROM appointment WHERE user_id = u.user_id ORDER BY app_date DESC LIMIT 1) AS symptoms
             FROM users u
             WHERE u.role_id = 2`
        );
        
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error("Error fetching patients:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
    }
}

// 🌟 2. ฟังก์ชันลบข้อมูลคนไข้ (DELETE)
export async function DELETE(request) {
    try {
        const body = await request.json();
        const { user_id } = body;

        if (!user_id) {
            return NextResponse.json({ error: "ไม่พบรหัสผู้ใช้ที่ต้องการลบ" }, { status: 400 });
        }

        // ลบข้อมูลการนัดหมายก่อน แล้วค่อยลบชื่อคนไข้
        await pool.query('DELETE FROM appointment WHERE user_id = ?', [user_id]); 
        await pool.query('DELETE FROM users WHERE user_id = ?', [user_id]); 

        return NextResponse.json({ message: "ลบข้อมูลเรียบร้อย" }, { status: 200 });

    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "ลบข้อมูลไม่สำเร็จ" }, { status: 500 });
    }
}