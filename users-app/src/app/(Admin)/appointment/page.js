"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './bbb.css';

export default function AppointmentPage() {
    const router = useRouter();

    return (
            <div className="app-page-container">
                
                {/* ส่วนหัว */}
                <header className="app-header">
                    <h1 style={{ margin: 0, fontSize: '24px' }}>ระบบนัดแพทย์โรงพยาบาล</h1>
                    <button 
                        onClick={() => router.push('/signin')}
                        style={{ padding: '8px 20px', backgroundColor: 'white', color: '#3e9d8a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Sign out
                    </button>
                </header>

                {/* โครงสร้างซ้าย-ขวา */}
                <div className="app-body">
                    
                    {/* แถบเมนูซ้าย */}
                    <aside className="app-sidebar">
                        <Link href="/users">ข้อมูลผู้ใช้</Link>
                        <Link href="/appointment" className="active">ข้อมูลการนัดหมาย</Link>
                        <Link href="/departments">ข้อมูลแผนก</Link>
                        <Link href="/doctors">ข้อมูลแพทย์</Link>
                    </aside>

                    {/* เนื้อหาตรงกลาง */}
                    <main className="app-content">
                        <div className="app-card">
                            
                            {/* หัวข้อและปุ่ม */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '25px' }}>
                                <h2 style={{ color: '#3e9d8a', margin: 0 }}>ข้อมูลการนัดหมาย</h2>
                                
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {/* 💡 เช็ค URL ตรง router.push ให้ตรงกับโฟลเดอร์ของเจมด้วยนะครับ */}
                                    <button 
                                        className="app-btn" 
                                        style={{ backgroundColor: '#ff9800' }}
                                        onClick={() => router.push('/appointment/editappointment')}
                                    >
                                        แก้ไข
                                    </button>
                                    <button 
                                        className="app-btn" 
                                        style={{ backgroundColor: '#f44336' }}
                                        onClick={() => router.push('/appointment/cancel')}
                                    >
                                        ยกเลิก
                                    </button>
                                </div>
                            </div>

                            {/* ตารางข้อมูล */}
                            <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
                                <table className="app-table">
                                    <thead>
                                        <tr>
                                            <th>ชื่อคนไข้</th>
                                            <th>นามสกุลคนไข้</th>
                                            <th>ชื่อแพทย์</th>
                                            <th>นามสกุลแพทย์</th>
                                            <th>แผนกของแพทย์</th>
                                            <th>วัน/เดือน/ปี</th>
                                            <th>เวลา</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>นาย สมชาย ใจดี</td>
                                            <td>นพ. รักษา เก่งมาก</td>
                                            <td>อายุรกรรม</td>
                                            <td>01/04/2026</td>
                                            <td>10:30 น.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
    );
}