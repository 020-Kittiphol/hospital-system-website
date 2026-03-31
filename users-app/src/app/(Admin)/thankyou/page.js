"use client"

import './register.css';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
    const router = useRouter();

    return (
        <div className="my-reg-bg" style={{ textAlign: 'center', paddingTop: '100px', fontFamily: 'sans-serif' }}>
            
            <h1>✅ ลงทะเบียนสำเร็จ</h1>
            <br></br>
            <p>ขอบคุณสำหรับการกรอกข้อมูล</p>

            <div className="my-reg-btn" button onClick={() => router.push("/home")}>
                กลับหน้าหลัก
            </div>
        </div>
    );
}