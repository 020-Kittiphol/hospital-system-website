"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './bbb-2.css';

export default function DepartmentsPage() {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departments, setDepartments] = useState([
        { id: 1, date: '2026-03-31T10:00', name: 'อายุรกรรม' },
        { id: 2, date: '2026-04-01T13:30', name: 'ศัลยกรรม' },
    ]);
    const [formData, setFormData] = useState({ date: '', name: '' });
    
    // --- ส่วนที่เพิ่มใหม่: เก็บ ID ของตัวที่กำลังจะแก้ไข ---
    const [editId, setEditId] = useState(null); 

    const openModal = () => setIsModalOpen(true);
    
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ date: '', name: '' }); 
        setEditId(null); // ล้างค่า ID ที่แก้ไข
    };

    // --- ส่วนที่เพิ่มใหม่: ฟังก์ชันเมื่อกดปุ่มแก้ไขในตาราง ---
    const handleEdit = (dept) => {
        setEditId(dept.id);
        setFormData({ date: dept.date, name: dept.name });
        openModal();
    };

    const saveData = () => {
        if (!formData.date || !formData.name) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        if (editId) {
            // --- กรณีแก้ไข (Update) ---
            const updatedDepartments = departments.map((dept) =>
                dept.id === editId ? { ...dept, ...formData } : dept
            );
            setDepartments(updatedDepartments);
            alert("แก้ไขข้อมูลสำเร็จ ✅");
        } else {
            // --- กรณีเพิ่มใหม่ (Create) ---
            const newEntry = { id: Date.now(), ...formData };
            setDepartments([...departments, newEntry]);
            alert("บันทึกข้อมูลสำเร็จ ✅");
        }
        
        closeModal();
    };

    return (
        <> 
            <div className="dept-page-container">
                <header className="dept-header">
                    <h1 style={{ margin: 0, fontSize: '24px' }}>ระบบนัดแพทย์โรงพยาบาล</h1>
                    <button 
                        onClick={() => router.push('/signin')}
                        style={{ padding: '8px 20px', backgroundColor: 'white', color: '#3e9d8a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Sign out
                    </button>
                </header>

                <div className="dept-body">
                    <aside className="dept-sidebar">
                        <Link href="/users">ข้อมูลผู้ใช้</Link>
                        <Link href="/appointment">ข้อมูลการนัดหมาย</Link>
                        <Link href="/departments" className="active">ข้อมูลแผนก</Link>
                        <Link href="/doctors">ข้อมูลแพทย์</Link>
                    </aside>

                    <main className="dept-content">
                        <div className="dept-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '25px' }}>
                                <h2 style={{ color: '#3e9d8a', margin: 0 }}>ข้อมูลแผนก</h2>
                                <button 
                                    className="dept-btn" 
                                    style={{ backgroundColor: '#4Caf50' }}
                                    onClick={openModal}
                                >
                                    + เพิ่มข้อมูลแผนก
                                </button>
                            </div>

                            <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
                                <table className="dept-table">
                                    <thead>
                                        <tr>
                                            <th>วันนัด</th>
                                            <th>ชื่อแผนก</th>
                                            <th style={{ textAlign: 'center' }}>จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departments.map((dept) => (
                                            <tr key={dept.id}>
                                                <td>{new Date(dept.date).toLocaleString('th-TH')}</td>
                                                <td>{dept.name}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                        <button 
                                                            className="dept-btn" 
                                                            style={{ backgroundColor: '#ff9800', padding: '6px 12px', fontSize: '13px' }}
                                                            onClick={() => handleEdit(dept)} // เรียกใช้ handleEdit
                                                        >
                                                            แก้ไข
                                                        </button>
                                                        <button 
                                                            className="dept-btn" 
                                                            style={{ backgroundColor: '#f44336', padding: '6px 12px', fontSize: '13px' }}
                                                            onClick={() => setDepartments(departments.filter(d => d.id !== dept.id))}
                                                        >
                                                            ลบ
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {isModalOpen && (
                <div style={{ display: 'flex', position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        {/* เปลี่ยนหัวข้อตามโหมด */}
                        <h3 style={{ marginBottom: '20px', color: '#3e9d8a', textAlign: 'center' }}>
                            {editId ? "แก้ไขข้อมูลแผนก" : "เพิ่มข้อมูลแผนก"}
                        </h3>
                        
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>วันนัด:</label>
                        <input 
                            type="datetime-local" 
                            style={{ marginBottom: '15px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                        
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อแผนก:</label>
                        <input 
                            type="text" 
                            placeholder="เช่น อายุรกรรม" 
                            style={{ marginBottom: '25px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                className="dept-btn" 
                                style={{ flex: 1, backgroundColor: '#3e9d8a' }} 
                                onClick={saveData}
                            >
                                {editId ? "บันทึกการแก้ไข" : "บันทึก"}
                            </button>
                            <button 
                                className="dept-btn" 
                                style={{ flex: 1, backgroundColor: '#9ca3af' }} 
                                onClick={closeModal}
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}