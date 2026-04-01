"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './bbb.css';

export default function EditAppointmentPage() {
    const router = useRouter();

    const handleEditAppointment = (e) => {
        e.preventDefault();

        alert("แก้ไขข้อมูลการนัดหมายเรียบร้อยแล้ว ✅");

        router.push("/appointment");
    };

    const handleCancel = () => {
        router.push("/appointment"); 
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
                            แก้ไขข้อมูลการนัดหมาย
                        </Link>
                    </nav>
                </aside>

                <main className="content">
                    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '30px' }}>
                        
                        <h2 style={{ textAlign: 'center', color: '#3e9d8a', marginBottom: '25px' }}>
                            แก้ไขข้อมูลการนัดหมาย
                        </h2>
                        
                        <form onSubmit={handleEditAppointment}>
                            
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>ชื่อ-นามสกุลคนไข้:</label>
                                <input type="text" name="first_name" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>รายชื่อแพทย์:</label>
                                <input type="text" name="name_name" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>แผนกแพทย์:</label>
                                <input type="text" name="panak_name" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>วัน/เดือน/ปี:</label>
                                <input type="date" name="date" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />
                            </div>

                            <div className="form-group" style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>เวลา:</label>
                                <input type="time" name="time" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />
                            </div>

                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                <button 
                                    type="submit" 
                                    style={{ flex: 1, padding: '12px', backgroundColor: '#3e9d8a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                                >
                                    ตกลง
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleCancel}
                                    style={{ flex: 1, padding: '12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                                >
                                    ยกเลิก
                                </button>
                            </div>

                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
