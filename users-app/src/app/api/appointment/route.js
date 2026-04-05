"use client";
import React, { useState, useEffect } from 'react';

export default function DepartmentPage() {
    const [departments, setDepartments] = useState([]);

    // ดึงข้อมูลเริ่มต้น
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/department'); // ปรับตาม API จริงของคุณ
            const result = await res.json();
            if (result.success) setDepartments(result.data);
        };
        fetchData();
    }, []);

    // ฟังก์ชันลบแบบหายไปทันที
    const handleDelete = async (id) => {
        if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลบรรทัดนี้?")) {
            try {
                const res = await fetch(`/api/department?id=${id}`, { method: 'DELETE' });
                const result = await res.json();

                if (result.success) {
                    // --- หัวใจสำคัญ: กรองเอา ID ที่ลบออกไปจากหน้าจอทันที ---
                    setDepartments(prev => prev.filter(item => item.dept_id !== id));
                } else {
                    alert("ลบไม่สำเร็จ");
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="header">
                    <h2>ข้อมูลแผนก</h2>
                    <button className="btn-add">+ เพิ่มข้อมูลแผนก</button>
                </div>

                <table className="dept-table">
                    <thead>
                        <tr>
                            <th>วันนัด</th>
                            <th>ชื่อแผนก</th>
                            <th style={{ textAlign: 'right' }}>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((item) => (
                            <tr key={item.dept_id}>
                                <td>{item.app_date || "1/4/2569 13:30:00"}</td>
                                <td>{item.dept_name || "ศัลยกรรม"}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="btn-edit">แก้ไข</button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(item.dept_id)}
                                    >
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}