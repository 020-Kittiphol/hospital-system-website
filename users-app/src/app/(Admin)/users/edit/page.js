"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditUserPage() {
    const router = useRouter();
    
    const [editData, setEditData] = useState({
        user_id: '', first_name: '', last_name: '', age: '', gender: 'ชาย'
    });

    useEffect(() => {
        const savedData = localStorage.getItem('edit_patient_data');
        if (savedData) {
            setEditData(JSON.parse(savedData));
        } else {
            alert('ไม่พบข้อมูลที่จะแก้ไข');
            router.push('/users'); 
        }
    }, [router]);

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });

            if (response.ok) {
                alert("แก้ไขข้อมูลสำเร็จ! ✨");
                localStorage.removeItem('edit_patient_data'); 
                router.push('/users'); 
            } else {
                alert("เกิดข้อผิดพลาดในการแก้ไข");
            }
        } catch (error) {
            console.error("Error updating:", error);
            alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
        }
    };

    const handleCancel = () => {
        localStorage.removeItem('edit_patient_data');
        router.push('/users'); 
    };

    return (
        <>
            <style>{`
                /* 🌟 เปลี่ยนชื่อคลาสใหม่หมด จะได้ไม่ตีกับหน้าหลัก */
                .edit-wrapper { display: flex; flex-direction: column; min-height: 100vh; background-color: #f4f8f7; font-family: 'Sarabun', sans-serif; margin: 0; }
                .edit-header { background: #3e9d8a; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 15px rgba(0,0,0,0.08); z-index: 10; }
                .edit-body { display: flex; flex: 1; }
                
                .edit-sidebar { width: 260px; background-color: #3e9d8a; flex-shrink: 0; box-shadow: 2px 0 10px rgba(0,0,0,0.05); z-index: 5; }
                .edit-sidebar a { display: block; padding: 16px 25px; color: rgba(255,255,255,0.85); text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); transition: all 0.3s; font-size: 16px; }
                .edit-sidebar a.active { background-color: white; color: #3e9d8a; font-weight: bold; border-left: 5px solid #f39c12; }
                
                .edit-content { flex: 1; padding: 40px; display: flex; justify-content: center; align-items: flex-start; overflow-x: auto; width: 100%; }
                
                .form-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.06); width: 100%; max-width: 600px; text-align: center; }
                .form-title { color: #2c7a6b; font-size: 24px; font-weight: bold; margin-bottom: 30px; }
                
                .form-group { margin-bottom: 20px; text-align: left; }
                .form-label { display: block; font-weight: bold; color: #333; margin-bottom: 8px; font-size: 16px; }
                .form-input { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-family: 'Sarabun'; box-sizing: border-box; font-size: 16px; outline: none; transition: border 0.3s; }
                .form-input:focus { border-color: #3e9d8a; }
                
                .btn-group { display: flex; gap: 15px; margin-top: 35px; }
                .btn-save { flex: 1; padding: 14px; background-color: #3e9d8a; color: white; border: none; border-radius: 8px; font-size: 18px; cursor: pointer; font-weight: bold; transition: 0.3s; }
                .btn-save:hover { background-color: #2c7a6b; }
                .btn-cancel { flex: 1; padding: 14px; background-color: #f44336; color: white; border: none; border-radius: 8px; font-size: 18px; cursor: pointer; font-weight: bold; transition: 0.3s; }
                .btn-cancel:hover { background-color: #d32f2f; }
            `}</style>

            <div className="edit-wrapper">
                <header className="edit-header">
                    <h1 style={{ margin: 0, fontSize: '24px' }}>ระบบนัดแพทย์โรงพยาบาล</h1>
                    <button style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer' }} onClick={() => router.push('/signin')}>Sign out</button>
                </header>

                <div className="edit-body">
                    <aside className="edit-sidebar">
                        <Link href="#" className="active">แก้ไขข้อมูลผู้ใช้</Link>
                    </aside>

                    <main className="edit-content">
                        <div className="form-card">
                            <div className="form-title">แก้ไขข้อมูลผู้ใช้ (ID: {editData.user_id})</div>
                            
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label className="form-label">ชื่อคนไข้:</label>
                                    <input type="text" name="first_name" className="form-input" value={editData.first_name} onChange={handleChange} required />
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label">นามสกุล:</label>
                                    <input type="text" name="last_name" className="form-input" value={editData.last_name} onChange={handleChange} required />
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label">อายุ:</label>
                                    <input type="number" name="age" className="form-input" value={editData.age} onChange={handleChange} required />
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label">เพศ:</label>
                                    <select name="gender" className="form-input" value={editData.gender} onChange={handleChange}>
                                        <option value="ชาย">ชาย</option>
                                        <option value="หญิง">หญิง</option>
                                    </select>
                                </div>

                                <div className="btn-group">
                                    <button type="submit" className="btn-save">ตกลง</button>
                                    <button type="button" className="btn-cancel" onClick={handleCancel}>ยกเลิก</button>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}