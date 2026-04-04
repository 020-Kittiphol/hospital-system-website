"use client";

import './register.css';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
    const router = useRouter();
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPatients = async () => {
        try {
            const response = await fetch('/api/users', { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                console.log("ข้อมูลจาก API ส่งมาคืออออ:", data);
                setPatients(data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // 🌟 ฟังก์ชันสำหรับลบข้อมูล
    const handleDelete = async (userId) => {
        // มีหน้าต่างเด้งถามเพื่อความชัวร์ก่อนลบ
        if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้รหัส ${userId} ? ข้อมูลการนัดหมายจะหายไปด้วยนะ!`)) {
            return;
        }

        try {
            // ยิงไปที่ API ด้วย method DELETE
            const response = await fetch('/api/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });

            if (response.ok) {
                alert("ลบข้อมูลสำเร็จ!");
                fetchPatients(); // โหลดข้อมูลตารางใหม่ทันทีโดยไม่ต้องรีเฟรชหน้า
            } else {
                alert("ลบข้อมูลไม่สำเร็จ");
            }
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    // 🌟 ฟังก์ชันสำหรับแก้ไข (เดี๋ยวเรามาทำกันต่อครับ)
    const handleEdit = (patient) => {
        localStorage.setItem('edit_patient_data', JSON.stringify(patient));
        router.push('/users/edit'); // พาวาร์ปไปหน้าแก้ไข
    };
    
    return (
        <>
            <div className="modern-wrapper">
                <header className="modern-header">
                    <h1 style={{ margin: 0, fontSize: '24px' }}>ระบบนัดแพทย์โรงพยาบาล</h1>
                    <button style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer' }} onClick={() => router.push('/signin')}>Sign out</button>
                </header>

                <div className="modern-body">
                    <aside className="modern-sidebar">
                        <Link href="/users" className="active">ข้อมูลผู้ใช้</Link>
                        <Link href="/appointment">ข้อมูลการนัดหมาย</Link>
                        <Link href="/departments">ข้อมูลแผนก</Link>
                        <Link href="/doctors">ข้อมูลเเพทย์</Link>
                    </aside>

                    <main className="modern-content">
                        <div className="card-table">
                            <h2 style={{ color: '#2c7a6b', margin: 0, marginBottom: '20px' }}>ข้อมูลผู้ป่วย / อาการเบื้องต้น</h2>

                            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                <table className="beautiful-table">
                                    <thead>
                                        <tr>
                                            <th>รหัสคนไข้ (ID)</th>
                                            <th>ชื่อ - นามสกุล</th>
                                            <th>อายุ</th>
                                            <th>เพศ</th>
                                            <th style={{ width: '30%' }}>อาการที่แจ้ง</th>
                                            <th>จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr><td colSpan="6" style={{ padding: '30px' }}>กำลังโหลดข้อมูล... ⏳</td></tr>
                                        ) : patients.length > 0 ? (
                                            patients.map((patient, index) => (
                                                <tr key={patient.user_id}>

                                                    <td style={{ fontWeight: 'bold', color: '#3498db' }}>{index + 1}</td>
                                                    <td>{patient.first_name} {patient.last_name}</td>
                                                    <td>{patient.age ? `${patient.age} ปี` : '-'}</td>
                                                    <td>{patient.gender || '-'}</td>
                                                    <td style={{ textAlign: 'left', color: patient.symptoms ? '#333' : '#999' }}>
                                                        {patient.symptoms || 'ไม่ได้ระบุอาการ'}
                                                    </td>
                                                
                                                    <td>
                                                        <div className="action-btns">
                                                            <button className="btn-edit" onClick={() => handleEdit(patient)}>แก้ไข</button>
                                                            <button className="btn-delete" onClick={() => handleDelete(patient.user_id)}>ลบ</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="6" style={{ padding: '30px', color: '#999' }}>ไม่มีข้อมูลผู้ป่วยในระบบ</td></tr>
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