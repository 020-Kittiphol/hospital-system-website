"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './bbb-2.css';

export default function DepartmentsPage() {
    const router = useRouter();

    // --- States ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departments, setDepartments] = useState([]); // เก็บข้อมูลจาก DB
    const [formData, setFormData] = useState({ date: '', name: '' });
    const [editId, setEditId] = useState(null); // เก็บ ID เมื่อต้องการแก้ไข

    // --- 1. ฟังก์ชันดึงข้อมูลจาก API (GET) ---
    const fetchDepartments = async () => {
        try {
            const res = await fetch('/api/department');
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            
            // แปลงข้อมูลจาก DB ให้เข้ากับตัวแปรที่ใช้ในตาราง
            const formattedData = data.map(item => ({
                id: item.department_id,
                name: item.department_name,
                date: item.department_date
            }));
            
            setDepartments(formattedData);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // โหลดข้อมูลทันทีที่เปิดหน้าเว็บ
    useEffect(() => {
        fetchDepartments();
    }, []);

    // --- 2. ฟังก์ชันจัดการ Modal ---
    const openModal = () => setIsModalOpen(true);
    
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ date: '', name: '' }); 
        setEditId(null);
    };

    // --- 3. ฟังก์ชันเมื่อกดปุ่ม "แก้ไข" ในตาราง ---
    const handleEdit = (dept) => {
        setEditId(dept.id);
        // แปลงรูปแบบวันที่จาก DB (ISO) ให้เข้ากับ input type="datetime-local"
        const dateForInput = dept.date ? new Date(dept.date).toISOString().slice(0, 16) : '';
        setFormData({ date: dateForInput, name: dept.name });
        openModal();
    };

    // --- 4. ฟังก์ชันบันทึกข้อมูล (เพิ่มใหม่/แก้ไข) ---
    const saveData = async () => {
        if (!formData.date || !formData.name) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        const payload = {
            department_name: formData.name,
            department_date: formData.date
        };

        try {
            const method = editId ? 'PUT' : 'POST';
            const url = editId ? `/api/department/${editId}` : '/api/department';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(editId ? "แก้ไขข้อมูลสำเร็จ ✅" : "บันทึกข้อมูลสำเร็จ ✅");
                fetchDepartments(); // โหลดข้อมูลใหม่จากฐานข้อมูล
                closeModal();
            } else {
                alert("เกิดข้อผิดพลาดในการบันทึก");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
        }
    };

    // --- 5. ฟังก์ชันลบข้อมูล ---
    const handleDelete = async (id) => {
        if (confirm("คุณแน่ใจหรือไม่ที่จะลบแผนกนี้?")) {
            try {
                const response = await fetch(`/api/department/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert("ลบข้อมูลสำเร็จ ✅");
                    fetchDepartments(); // อัปเดตตารางใหม่
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
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
                                <button className="dept-btn" style={{ backgroundColor: '#4Caf50' }} onClick={openModal}>
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
                                        {departments.length > 0 ? (
                                            departments.map((dept) => (
                                                <tr key={dept.id}>
                                                    <td>{dept.date ? new Date(dept.date).toLocaleString('th-TH') : '-'}</td>
                                                    <td>{dept.name}</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                            <button 
                                                                className="dept-btn" 
                                                                style={{ backgroundColor: '#ff9800', padding: '6px 12px', fontSize: '13px' }}
                                                                onClick={() => handleEdit(dept)}
                                                            >
                                                                แก้ไข
                                                            </button>
                                                            <button 
                                                                className="dept-btn" 
                                                                style={{ backgroundColor: '#f44336', padding: '6px 12px', fontSize: '13px' }}
                                                                onClick={() => handleDelete(dept.id)}
                                                            >
                                                                ลบ
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                                    กำลังโหลดข้อมูล หรือไม่พบข้อมูลในระบบ...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div style={{ display: 'flex', position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
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
                            <button className="dept-btn" style={{ flex: 1, backgroundColor: '#3e9d8a' }} onClick={saveData}>
                                {editId ? "บันทึกการแก้ไข" : "บันทึก"}
                            </button>
                            <button className="dept-btn" style={{ flex: 1, backgroundColor: '#9ca3af' }} onClick={closeModal}>
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}