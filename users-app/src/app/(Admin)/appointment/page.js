"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './bbb.css';

export default function AdminAppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [editingApp, setEditingApp] = useState(null);

    const getLocalDatetime = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const fetchAppointments = async () => {
        try {
            const response = await fetch('/api/appointment');
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleDelete = async (app_id) => {
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคิวนัดหมายนี้?")) return;

        try {
            const res = await fetch('/api/appointment', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ app_id })
            });

            if (res.ok) {
                alert("ยกเลิกคิวสำเร็จ!");
                setAppointments(appointments.filter(app => app.app_id !== app_id));
            } else {
                alert("เกิดข้อผิดพลาดในการยกเลิกคิว");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const res = await fetch('/api/appointment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    app_id: editingApp.app_id,
                    app_date: editingApp.app_date,
                    symptoms: editingApp.symptoms
                })
            });

            if (res.ok) {
                alert("บันทึกการแก้ไขสำเร็จ!");
                setEditingApp(null);
                fetchAppointments();
            } else {
                alert("เกิดข้อผิดพลาดในการบันทึก");
            }
        } catch (error) {
            console.error("Edit error:", error);
        }
    };

    return (
        <>
            <div className="modern-wrapper">
                <header className="modern-header">
                    <h1 style={{ margin: 0, fontSize: '24px' }}>ระบบนัดแพทย์โรงพยาบาล</h1>
                    <button className="btn-signout" onClick={() => router.push('/signin')}>Sign out</button>
                </header>

                <div className="modern-body">
                    <aside className="modern-sidebar">
                        <Link href="/users">ข้อมูลผู้ใช้</Link>
                        <Link href="/appointment" className="active">ข้อมูลการนัดหมาย</Link>
                        <Link href="/departments">ข้อมูลแผนก</Link>
                        <Link href="/doctors">ข้อมูลเเพทย์</Link>
                        <Link href="/charts">สรุปข้อมูล chart</Link>
                    </aside>

                    <main className="modern-content">
                        <div className="table-container">
                            <h2 style={{ color: '#2c7a6b', margin: 0, marginBottom: '20px' }}>ข้อมูลการนัดหมาย</h2>
                            
                            {isLoading ? (
                                <p style={{ textAlign: 'center' }}>กำลังโหลดข้อมูล...</p>
                            ) : appointments.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#888' }}>ยังไม่มีข้อมูลการนัดหมายในระบบ</p>
                            ) : (
                                <table className="styled-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>ชื่อคนไข้</th>
                                            <th>แพทย์</th>
                                            <th>แผนก</th>
                                            <th>วัน/เวลา ที่นัดหมาย</th>
                                            <th>อาการเบื้องต้น</th>
                                            <th>จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((app) => (
                                            <tr key={app.app_id}>
                                                <td>{app.app_id}</td>
                                                <td>{app.patient_fname} {app.patient_lname}</td>
                                                <td>นพ./พญ. {app.doctor_fname}</td>
                                                <td>{app.department_name}</td>
                                                <td>
                                                    {new Date(app.app_date).toLocaleString('th-TH', { 
                                                        dateStyle: 'medium', timeStyle: 'short' 
                                                    })} น.
                                                </td>
                                                <td style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {app.symptoms || "-"}
                                                </td>
                                                <td>
                                                    <button className="btn-edit" onClick={() => setEditingApp(app)}>แก้ไข</button>
                                                    <button className="btn-delete" onClick={() => handleDelete(app.app_id)}>ยกเลิก</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {editingApp && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3 style={{ marginTop: 0, color: '#3e9d8a' }}>แก้ไขข้อมูลคิวที่ {editingApp.app_id}</h3>
                        
                        <label>วันและเวลาที่นัดหมาย</label>
                        <input 
                            type="datetime-local" 
                            className="modal-input" 
                            value={getLocalDatetime(editingApp.app_date)} 
                            onChange={(e) => setEditingApp({ ...editingApp, app_date: e.target.value })}
                        />ห

                        <label>อาการเบื้องต้น</label>
                        <textarea 
                            className="modal-input" 
                            rows="4"
                            value={editingApp.symptoms} 
                            onChange={(e) => setEditingApp({ ...editingApp, symptoms: e.target.value })}
                        ></textarea>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button style={{ padding: '8px 15px', border: 'none', background: '#ccc', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setEditingApp(null)}>ยกเลิก</button>
                            <button style={{ padding: '8px 15px', border: 'none', background: '#3e9d8a', color: 'white', borderRadius: '5px', cursor: 'pointer' }} onClick={handleSaveEdit}>บันทึกข้อมูล</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}