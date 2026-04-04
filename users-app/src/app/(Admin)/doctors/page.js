"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DoctorsPage() {
    const router = useRouter();
    
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('/api/doctors');
                if (response.ok) {
                    const data = await response.json();
                    setDoctors(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <>
            <div className="modern-wrapper">
                <header className="modern-header">
                    <h1 style={{ margin: 0, fontSize: '24px' }}>ระบบนัดแพทย์โรงพยาบาล</h1>
                    <button className="btn-modern btn-outline" onClick={() => router.push('/signin')}>Sign out</button>
                </header>

                <div className="modern-body">
                    <aside className="modern-sidebar">
                        <Link href="/users">ข้อมูลผู้ใช้</Link>
                        <Link href="/appointment">ข้อมูลการนัดหมาย</Link>
                        <Link href="/departments">ข้อมูลแผนก</Link>
                        <Link href="/doctors" className="active">ข้อมูลเเพทย์</Link>
                        <Link href="/charts">สรุปข้อมูล chart</Link>
                    </aside>

                    <main className="modern-content">
                        <div className="card-table">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ color: '#2c7a6b', margin: 0 }}>ข้อมูลเเพทย์</h2>
                                <div className="action-bar">
                                    <Link href="/doctors/adddoctors" className="btn-modern btn-green">+ เพิ่มข้อมูล</Link>
                                    <Link href="/doctors/deletedoctors" className="btn-modern btn-red">- ลบข้อมูล</Link>
                                    <Link href="/doctors/editdoctors" className="btn-modern btn-red">เเก้ไขข้อมูล</Link>
                                </div>
                            </div>

                            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                <table className="beautiful-table">
                                    <thead>
                                        <tr>
                                            <th>รหัสแพทย์ (ID)</th>
                                            <th>ชื่อหมอ</th>
                                            <th>รหัสเเผนก</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr><td colSpan="4" style={{ padding: '30px' }}>กำลังโหลดข้อมูลจากฐานข้อมูล... ⏳</td></tr>
                                        ) : doctors.length > 0 ? (
                                            
                                            doctors.map((doc, index) => (
                                                <tr key={doc.doctor_id || index}>
                                    
                                                    <td style={{ fontWeight: 'bold', color: '#e74c3c' }}>
                                                        {doc.doctor_id}
                                                    </td>
                                                    
                                                    <td>{doc.first_name} {doc.last_name}</td>
                                                    
                                                    <td>{doc.department_id}</td>
                                    
                                                    
                                                </tr>
                                            ))
                                            
                                        ) : (
                                            <tr><td colSpan="4" style={{ padding: '30px', color: '#999' }}>ไม่มีข้อมูลแพทย์ในระบบ</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
