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
            <style>{`
                .modern-wrapper { display: flex; flex-direction: column; min-height: 100vh; background-color: #f4f8f7; font-family: 'Sarabun', sans-serif; margin: 0; }
                .modern-header { background: #3e9d8a; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 15px rgba(0,0,0,0.08); z-index: 10; }
                .modern-body { display: flex; flex: 1; }
                .modern-sidebar { width: 260px; background-color: #3e9d8a; flex-shrink: 0; box-shadow: 2px 0 10px rgba(0,0,0,0.05); z-index: 5; }
                .modern-sidebar a { display: block; padding: 16px 25px; color: rgba(255,255,255,0.85); text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); transition: all 0.3s; font-size: 16px; }
                .modern-sidebar a:hover { background-color: rgba(255,255,255,0.1); color: white; }
                .modern-sidebar a.active { background-color: white; color: #3e9d8a; font-weight: bold; border-left: 5px solid #f39c12; }
                
                .modern-content { flex: 1; padding: 40px; display: flex; flex-direction: column; align-items: center; overflow-x: auto; width: 100%; }
                .card-table { background: white; padding: 35px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.04); width: 100%; max-width: 1000px; }
                
                .action-bar { display: flex; gap: 12px; flex-wrap: wrap; }
                .btn-modern { padding: 10px 20px; border-radius: 8px; border: none; font-weight: bold; font-family: 'Sarabun'; cursor: pointer; transition: all 0.2s; color: white; text-decoration: none; font-size: 14px; }
                .btn-green { background-color: #3e9d8a; } 
                .btn-red { background-color: #e74c3c; } 
                .btn-outline { background-color: white; color: #3e9d8a; border: 1px solid #ddd; }
                
                .beautiful-table { width: 100%; border-collapse: collapse; min-width: 600px; margin-top: 20px; }
                .beautiful-table th { background-color: #eaf4f2; color: #2c7a6b; padding: 15px; text-align: center; font-size: 16px; }
                .beautiful-table td { padding: 15px; text-align: center; border-bottom: 1px solid #f5f5f5; font-size: 15px; }
                .beautiful-table tbody tr:hover { background-color: #fafcfb; }
            `}</style>

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
                                            <th>เบอร์โทร</th>
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
                                                
                                                    <td>{doc.tel_numdoc ? doc.tel_numdoc : "-"}</td>
                                                    
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
