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
    const [editId, setEditId] = useState(null); // เก็บ ID เมื่อต้องการแก้ไข
    const [formData, setFormData] = useState({ 
        id_code: '', 
        date: '', 
        name: '' 
    });

    // URL ของ API (ต้องมีตัว s ตามชื่อโฟลเดอร์ของคุณ)
    const apiUrl = '/api/departments';

    // --- 2. ฟังก์ชันดึงข้อมูลจาก Database (GET) ---
    const fetchDepartments = async () => {
        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลได้');
            const data = await res.json();
            
            // Map ข้อมูลให้ตรงกับชื่อตัวแปรที่จะใช้ในตาราง
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
            alert("กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อแผนกและวันนัด)");
            return;
        }

        const payload = {
            department_name: formData.name,
            department_date: formData.date,
            department_id_code: formData.id_code 
        };

        try {
            // ตัดสินใจเลือก Method และ URL (ถ้าแก้ไขจะส่ง ?id=... ไปด้วย)
            const method = editId ? 'PUT' : 'POST';
            const url = editId ? `${apiUrl}?id=${editId}` : apiUrl;

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(editId ? "แก้ไขข้อมูลสำเร็จ ✅" : "บันทึกข้อมูลสำเร็จ ✅");
                fetchDepartments(); // โหลดข้อมูลในตารางใหม่
                closeModal();       // ปิด Modal และเคลียร์ค่า
            } else {
                const err = await response.json();
                alert("เกิดข้อผิดพลาด: " + (err.error || "บันทึกไม่สำเร็จ"));
            }
        } catch (error) {
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
    };

    // --- 4. ฟังก์ชันสำหรับปุ่มลบ (DELETE) ---
    const handleDelete = async (id) => {
        if (confirm("คุณแน่ใจหรือไม่ที่จะลบแผนกนี้?")) {
            try {
                const response = await fetch(`${apiUrl}?id=${id}`, { 
                    method: 'DELETE' 
                });

                if (response.ok) {
                    alert("ลบข้อมูลเรียบร้อย ✅");
                    fetchDepartments(); 
                } else {
                    alert("ลบข้อมูลไม่สำเร็จ");
                }
            } catch (error) {
                console.error("Delete Error:", error);
            }
        }
    };

    // --- 5. จัดการการเปิด-ปิด Modal และการแก้ไข ---
    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({ id_code: '', date: '', name: '' });
    };

    const handleEdit = (dept) => {
        setEditId(dept.id);
        // แปลงรูปแบบวันที่จาก Database (ISO) ให้เป็น format ที่ input datetime-local รับได้
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h2 style={{ color: '#3e9d8a', margin: 0 }}>ข้อมูลแผนก</h2>
                            <button className="dept-btn" style={{ backgroundColor: '#4Caf50' }} onClick={openModal}>
                                + เพิ่มข้อมูลแผนก
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
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
                                                <td>{dept.date ? new Date(dept.date).toLocaleString('th-TH') : '-'}</td>
                                                <td>{dept.name}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                        <button 
                                                            className="dept-btn" 
                                                            style={{ backgroundColor: '#ff9800', padding: '6px 12px' }}
                                                            onClick={() => handleEdit(dept)}
                                                        >
                                                            แก้ไข
                                                        </button>
                                                        <button 
                                                            className="dept-btn" 
                                                            style={{ backgroundColor: '#f44336', padding: '6px 12px' }}
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
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                                ไม่พบข้อมูลแผนก หรือกำลังโหลด...
                                            </td>
                                        </tr>
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
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '380px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginBottom: '20px', color: '#3e9d8a', textAlign: 'center' }}>
                            {editId ? "แก้ไขข้อมูลแผนก" : "เพิ่มข้อมูลแผนก"}
                        </h3>
                        
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รหัสแผนก:</label>
                        <input 
                            type="text" 
                            placeholder="เช่น D001"
                            style={{ marginBottom: '15px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            value={formData.id_code}
                            onChange={(e) => setFormData({ ...formData, id_code: e.target.value })}
                        />

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
                            placeholder="กรอกชื่อแผนก" 
                            style={{ marginBottom: '25px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="dept-btn" style={{ flex: 1, backgroundColor: '#3e9d8a' }} onClick={saveData}>
                                บันทึก
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