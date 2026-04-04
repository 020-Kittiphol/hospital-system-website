import { NextResponse } from 'next/server';
import pool from '@/models/db_pool';
import md5 from 'md5';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return NextResponse.json({ error: "ไม่พบชื่อผู้ใช้นี้ในระบบ" }, { status: 401 });
        }

        const user = users[0];

        const hashedPassword = md5(password);
        const isMatch = (hashedPassword === user.password);

        if (!isMatch) {
            return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
        }

        delete user.password;
        
        return NextResponse.json({ message: "เข้าสู่ระบบสำเร็จ", data: user }, { status: 200 });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดของเซิร์ฟเวอร์" }, { status: 500 });
    }
}