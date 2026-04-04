"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './bbb-2.css';

export default function DepartmentsPage() {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departments, setDepartments] = useState([]); 
    const [formData, setFormData] = useState({ id_code: '', date: '', name: '' });
    const [editId, setEditId] = useState(null); 

    // ใช้ชื่อ API ให้ตรงกับโฟลเดอร์ที่มีตัว s
    const apiUrl = '/api/departments';

    // 1. ดึงข้อมูล
    const fetchDepartments = async () => {
        try {
            const res = await fetch(apiUrl);
            if (res.ok) {
                const data = await res.json();
                setDepartments(data.map(item => ({
                    id: item.department_id,
                    id_code: item.department_id_code || item.department_id,
                    name: item.department_name,
                    date: item.department_date
                })));
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => { fetchDepartments(); }, []);

    // 2. บันทึกข้อมูล (เพิ่ม/แก้ไข)
    const saveData = async () => {
        if (!formData.name || !formData.date) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        const payload = {
            department_name: formData.name,
            department_date: formData.date,
            department_id_code: formData.id_code 
        };

        try {
            const method = editId ? 'PUT' : 'POST';
            const url = editId ? `${apiUrl}?id=${editId}` : apiUrl;

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(editId ? "แก้ไขสำเร็จ ✅" : "บันทึกสำเร็จ ✅");
                fetchDepartments();
                closeModal();
            } else {
                const errorData = await response.json();
                alert("เกิดข้อผิดพลาด: " + errorData.error);
            }
        } catch (error) {
            alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (เช็ค XAMPP หรือชื่อไฟล์ API)");
        }
    };

    // 3. ลบข้อมูล
    const handleDelete = async (id) => {
        if (confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?")) {
            try {
                const response = await fetch(`${apiUrl}?id=${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert("ลบสำเร็จ ✅");
                    fetchDepartments(); 
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    const handleEdit = (dept) => {
        setEditId(dept.id);
        const dateFormatted = dept.date ? new Date(dept.date).toISOString().slice(0, 16) : '';
        setFormData({ id_code: dept.id_code, date: dateFormatted, name: dept.name });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({ id_code: '', date: '', name: '' });
    };

    return (
        <div className="dept-page-container">
            <header className="dept-header">
                <h1>ระบบนัดแพทย์โรงพยาบาล</h1>
                <button onClick={() => router.push('/signin')}>Sign out</button>
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
                            <button className="dept-btn" style={{ backgroundColor: '#4Caf50' }} onClick={() => setIsModalOpen(true)}>
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
                                                        <button className="dept-btn" style={{ backgroundColor: '#ff9800' }} onClick={() => handleEdit(dept)}>แก้ไข</button>
                                                        <button className="dept-btn" style={{ backgroundColor: '#f44336' }} onClick={() => handleDelete(dept.id)}>ลบ</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>ไม่มีข้อมูล...</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '350px' }}>
                        <h3>{editId ? "แก้ไขแผนก" : "เพิ่มแผนก"}</h3>
                        <label>รหัสแผนก:</label>
                        <input type="text" className="dept-input" value={formData.id_code} onChange={e => setFormData({ ...formData, id_code: e.target.value })} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
                        <label>วันนัด:</label>
                        <input type="datetime-local" className="dept-input" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
                        <label>ชื่อแผนก:</label>
                        <input type="text" className="dept-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', marginBottom: '20px', padding: '8px' }} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="dept-btn" style={{ flex: 1, backgroundColor: '#3e9d8a' }} onClick={saveData}>บันทึก</button>
                            <button className="dept-btn" style={{ flex: 1, backgroundColor: '#9ca3af' }} onClick={closeModal}>ยกเลิก</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}