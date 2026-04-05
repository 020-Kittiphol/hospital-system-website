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

<<<<<<< HEAD
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
=======
    const [result] = await pool.query(
      `INSERT INTO appointment 
      (user_id, doctor_id, department_id, app_date, symptoms) 
      VALUES (?, ?, ?, ?, ?)`,
      [user_id, doctor_id, department_id, app_date, symptoms || "ไม่มีอาการเบื้องต้น"]
    );

    return NextResponse.json(
      {
        message: "บันทึกการนัดหมายสำเร็จ",
        appointmentId: result.insertId,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Appointment POST Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึก" },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
        const query = `
            SELECT 
                a.app_id,
                a.app_date,
                a.symptoms,
                u.first_name AS patient_fname,
                u.last_name AS patient_lname,
                d.first_name AS doctor_fname,
                d.last_name AS doctor_lname,
                dep.department_name
            FROM appointment a
            LEFT JOIN users u ON a.user_id = u.user_id
            LEFT JOIN doctor d ON a.doctor_id = d.doctor_id
            LEFT JOIN department dep ON a.department_id = dep.department_id
            ORDER BY a.app_id ASC
        `;
        
        const [rows] = await pool.query(query);
        
        return NextResponse.json(rows, { status: 200 });

    } catch (error) {
        console.error("Appointment GET Error:", error);
        return NextResponse.json(
          { error: "ดึงข้อมูลการนัดหมายไม่สำเร็จ" }, 
          { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { app_id, app_date, symptoms } = body;

        if (!app_id) return NextResponse.json({ error: "ไม่พบรหัสคิว" }, { status: 400 });

        await pool.query(
            'UPDATE appointment SET app_date = ?, symptoms = ? WHERE app_id = ?',
            [app_date, symptoms, app_id]
        );

        return NextResponse.json({ message: "แก้ไขข้อมูลสำเร็จ" }, { status: 200 });
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "แก้ไขข้อมูลไม่สำเร็จ" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const body = await request.json();
        const { app_id } = body;

        if (!app_id) return NextResponse.json({ error: "ไม่พบรหัสคิว" }, { status: 400 });

        await pool.query('DELETE FROM appointment WHERE app_id = ?', [app_id]);

        return NextResponse.json({ message: "ยกเลิกคิวสำเร็จ" }, { status: 200 });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "ลบข้อมูลไม่สำเร็จ" }, { status: 500 });
    }
>>>>>>> c317317443682fb46d599902ef28e5a8084a7127
}