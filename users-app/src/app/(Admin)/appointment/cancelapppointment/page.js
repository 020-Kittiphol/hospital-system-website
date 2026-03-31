"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './bbb.css';

export default function CancelAppointmentPage() {
    const router = useRouter();

    const handleCancelAppointment = (e) => {
        e.preventDefault();

        const isConfirm = window.confirm("คุณแน่ใจหรือไม่ที่จะยกเลิกการนัดหมายของคนไข้ท่านนี้?");
        
        if (isConfirm) {
            alert("ยกเลิกการนัดหมายเรียบร้อยแล้ว 🗑️");
            router.push("/appointment");
        }
    };

    const handleGoBack = () => {
        router.push("/appointments");
    };

    return (
        <div className="admin-wrapper">
            
            <header className="main-header">
                <h1>ระบบนัดแพทย์โรงพยาบาล</h1>
            </header>

            <div className="container">
                <aside className="sidebar">
                    <nav>
                        <Link href="/appointments" className="nav-item active">
                            ยกเลิกข้อมูลการนัดหมาย
                        </Link>
                    </nav>
                </aside>

                <main className="content">
                    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '30px' }}>
                        
                        <h2 style={{ textAlign: 'center', color: '#e53935', marginBottom: '25px' }}>
                            ยกเลิกข้อมูลการนัดหมาย
                        </h2>
                        
                        <form onSubmit={handleCancelAppointment}>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>ชื่อ-นามสกุลคนไข้:</label>
                                <input type="text" name="first_name" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }} readOnly defaultValue="นาย สมชาย ใจดี" />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>รายชื่อแพทย์:</label>
                                <input type="text" name="name_name" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }} readOnly defaultValue="นพ. รักษา เก่งมาก" />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>แผนกแพทย์:</label>
                                <input type="text" name="panak_name" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }} readOnly defaultValue="อายุรกรรม" />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>วัน/เดือน/ปี:</label>
                                <input type="date" name="date" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }} readOnly defaultValue="2026-04-01" />
                            </div>

                            <div className="form-group" style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>เวลา:</label>
                                <input type="time" name="time" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }} readOnly defaultValue="10:30" />
                            </div>

                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                <button 
                                    type="submit" 
                                    style={{ flex: 1, padding: '12px', backgroundColor: '#e53935', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                                >
                                    ยืนยันการยกเลิก
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleGoBack}
                                    style={{ flex: 1, padding: '12px', backgroundColor: '#9ca3af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                                >
                                    กลับไปหน้าเดิม
                                </button>
                            </div>

                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}