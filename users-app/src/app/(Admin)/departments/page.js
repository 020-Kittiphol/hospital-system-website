"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './bbb-2.css';

export default function DepartmentsPage() {
    const router = useRouter();

    // --- 1. States สำหรับจัดการข้อมูล ---
    const [departments, setDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null); // เก็บ ID เมื่อเข้าโหมดแก้ไข
    const [formData, setFormData] = useState({ 
        id_code: '', 
        date: '', 
        name: '' 
    });

    // URL ของ API (ต้องมี s ตามชื่อโฟลเดอร์ของคุณ)
    const apiUrl = '/api/departments';

    // --- 2. ฟังก์ชันดึงข้อมูล (GET) ---
    const fetchDepartments = async () => {
        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error('เรียกข้อมูลไม่สำเร็จ');
            const data = await res.json();
            
            // Map ข้อมูลให้ตรงกับชื่อตัวแปรที่ใช้ในตาราง
            const formattedData = data.map(item => ({
                id: item.department_id,
                id_code: item.department_id_code || item.department_id,
                name: item.department_name,
                date: item.department_date
            }));
            setDepartments(formattedData);
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    // --- 3. ฟังก์ชันบันทึกข้อมูล (POST สำหรับเพิ่ม / PUT สำหรับแก้ไข) ---
    const saveData = async () => {
        if (!formData.name || !formData.date) {
            alert("กรุณากรอกชื่อแผนกและวันนัดให้ครบถ้วน");
            return;
        }

        const payload = {
            department_name: formData.name,
            department_date: formData.date,
            department_id_code: formData.id_code 
        };

        try {
            // ส่ง ID ผ่าน Query String (?id=...) เมื่อเป็นการแก้ไข
            const method = editId ? 'PUT' : 'POST';
            const url = editId ? `${apiUrl}?id=${editId}` : apiUrl;

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(editId ? "แก้ไขข้อมูลสำเร็จ ✅" : "บันทึกข้อมูลสำเร็จ ✅");
                fetchDepartments(); // ดึงข้อมูลใหม่มาโชว์ในตาราง
                closeModal();       // ปิด Modal และเคลียร์ค่าในฟอร์ม
            } else {
                const err = await response.json();
                alert("เกิดข้อผิดพลาด: " + (err.error || "บันทึกไม่สำเร็จ"));
            }
        } catch (error) {
            alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ (เช็ค XAMPP หรือชื่อโฟลเดอร์ API)");
        }
    };

    // --- 4. ฟังก์ชันลบข้อมูล (DELETE) ---
    const handleDelete = async (id) => {
        if (confirm("คุณแน่ใจหรือไม่ที่จะลบแผนกนี้?")) {
            try {
                // ส่ง ID ผ่าน Query String (?id=...)
                const response = await fetch(`${apiUrl}?id=${id}`, { 
                    method: 'DELETE' 
                });

                if (response.ok) {
                    alert("ลบข้อมูลสำเร็จ ✅");
                    fetchDepartments(); 
                } else {
                    alert("ลบไม่สำเร็จ");
                }
            } catch (error) {
                console.error("Delete Error:", error);
            }
        }
    };

    // --- 5. จัดการ Modal และการเตรียมข้อมูลแก้ไข ---
    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({ id_code: '', date: '', name: '' });
    };

    const handleEdit = (dept) => {
        setEditId(dept.id);
        // แปลงรูปแบบวันที่เพื่อให้ input type="datetime-local" แสดงผลได้
        const dateFormatted = dept.date ? new Date(dept.date).toISOString().slice(0, 16) : '';
        setFormData({ 
            id_code: dept.id_code, 
            name: dept.name, 
            date: dateFormatted 
        });
        openModal();
    };

    return (
        <div className="dept-page-container">
            <header className="dept-header">
                <h1 style={{ margin: 0, fontSize: '24px' }}>ระบบนัดแพทย์โรงพยาบาล</h1>
                <button 
                    onClick={() => router.push('/signin')}
                    className="signout-btn"
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                            <h2 style={{ color: '#3e9d8a', margin: 0 }}>ข้อมูลแผนก</h2>
                            <button className="dept-btn" style={{ backgroundColor: '#4Caf50' }} onClick={openModal}>
                                + เพิ่มข้อมูลแผนก
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table className="dept-table">
                                <thead>
                                    <tr>
                                        <th>รหัสแผนก</th>
                                        <th>วันนัด</th>
                                        <th>ชื่อแผนก</th>
                                        <th style={{ textAlign: 'center' }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.length > 0 ? (
                                        departments.map((dept) => (
                                            <tr key={dept.id}>
                                                <td style={{ fontWeight: 'bold', color: '#3e9d8a' }}>{dept.id_code}</td>
                                                <td>{new Date(dept.date).toLocaleString('th-TH')}</td>
                                                <td>{dept.name}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                        <button 
                                                            className="dept-btn" 
                                                            style={{ backgroundColor: '#ff9800' }}
                                                            onClick={() => handleEdit(dept)}
                                                        >
                                                            แก้ไข
                                                        </button>
                                                        <button 
                                                            className="dept-btn" 
                                                            style={{ backgroundColor: '#f44336' }}
                                                            onClick={() => handleDelete(dept.id)}
                                                        >
                                                            ลบ
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>ไม่พบข้อมูลแผนก...</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- Modal Popup --- */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '380px' }}>
                        <h3 style={{ marginBottom: '20px', color: '#3e9d8a', textAlign: 'center' }}>
                            {editId ? "แก้ไขข้อมูลแผนก" : "เพิ่มข้อมูลแผนก"}
                        </h3>
                        
                        <label style={{ display: 'block', marginBottom: '5px' }}>รหัสแผนก:</label>
                        <input 
                            type="text" 
                            className="dept-input"
                            value={formData.id_code}
                            onChange={(e) => setFormData({ ...formData, id_code: e.target.value })}
                            style={{ width: '100%', marginBottom: '15px', padding: '8px' }}
                        />

                        <label style={{ display: 'block', marginBottom: '5px' }}>วันนัด:</label>
                        <input 
                            type="datetime-local" 
                            className="dept-input"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            style={{ width: '100%', marginBottom: '15px', padding: '8px' }}
                        />
                        
                        <label style={{ display: 'block', marginBottom: '5px' }}>ชื่อแผนก:</label>
                        <input 
                            type="text" 
                            className="dept-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', marginBottom: '25px', padding: '8px' }}
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
        </div>
    );
}