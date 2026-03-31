"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './style.css';

export default function EditDoctorPage() {
    const router = useRouter();

    // ฟังก์ชันจัดการเมื่อกดปุ่ม "แก้ไขข้อมูลแพทย์"
    const handleEditDoctor = (e) => {
        e.preventDefault(); // กันการรีเฟรชหน้าเว็บ
        
        // จำลองการแจ้งเตือน
        alert("แก้ไขข้อมูลแพทย์เรียบร้อยแล้ว ✅");
        
        // กลับไปยังหน้ารายชื่อแพทย์
        router.push("/doctors");
    };

    return (
        <div>
            {/* ส่วนหัวของระบบ */}
            <header className="main-header">
                <h1>ระบบนัดเเพทย์โรงพยาบาล</h1>
            </header>
           
            <div className="container">
                {/* เมนูด้านซ้าย */}
                <aside className="sidebar">
                    <nav>
                        <Link href="/doctors" className="nav-item active">
                            ข้อมูลเเพทย์
                        </Link>
                    </nav>
                </aside>

                {/* เนื้อหาการแก้ไขข้อมูล */}
                <main className="content">
                    <div className="card">
                        <h2 style={{ color: '#3e9d8a', marginBottom: '20px' }}>เเก้ไขข้อมูลเเพทย์</h2>
                        
                        <form onSubmit={handleEditDoctor}>
                            <div className="form-group">
                                <label>ชื่อหมอ:</label>
                                <input type="text" name="first_name" className="form-control" />
                            </div>
                            <br />

                            <div className="form-group">
                                <label>นามสกุลหมอ:</label>
                                <input type="text" name="last_name" className="form-control" />
                            </div>
                            <br />

                            <div className="form-group">
                                <label>เเผนก:</label>
                                <input type="text" name="department_id" className="form-control" />
                            </div>
                            <br />

                            <div className="form-group">
                                <label>เบอร์โทร:</label>
                                <input type="number" name="Phone" className="form-control" />
                            </div>
                            <br />

                            <button 
                                type="submit" 
                                className="btn btn-edit w-100"
                                style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: 'bold' }}
                            >
                                เเก้ไขข้อมูลเเพทย์
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}