"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DeleteDoctorPage() {
    const router = useRouter();
    const [doctorId, setDoctorId] = useState('');

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!doctorId) {
            alert("กรุณากรอกรหัสแพทย์ที่ต้องการลบ");
            return;
        }

        const isConfirm = confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบแพทย์รหัส: ${doctorId} ?`);
        if (!isConfirm) return;

        try {
            // ยิง API ไปที่โฟลเดอร์ [id] ที่เราสร้างไว้
            const response = await fetch(`/api/doctors/${doctorId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("ลบข้อมูลสำเร็จแล้ว 🗑️");
                router.push('/doctors'); // ลบเสร็จ เด้งกลับไปหน้าตาราง
            } else {
                const data = await response.json();
                alert(`ลบไม่สำเร็จ: ${data.error || 'ไม่พบข้อมูล'}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("ระบบมีปัญหา ไม่สามารถลบได้");
        }
    };

    return (
        <>
            <style>{`
                .modern-wrapper { display: flex; flex-direction: column; min-height: 100vh; background-color: #f4f8f7; font-family: 'Sarabun', sans-serif; margin: 0; }
                .modern-header { background: #3e9d8a; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 15px rgba(0,0,0,0.08); z-index: 10; }
                .modern-body { display: flex; flex: 1; }
                .modern-sidebar { width: 260px; background-color: #3e9d8a; flex-shrink: 0; }
                .modern-sidebar a { display: block; padding: 16px 25px; color: rgba(255,255,255,0.85); text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .modern-sidebar a.active { background-color: white; color: #3e9d8a; font-weight: bold; border-left: 5px solid #f39c12; }
                
                .modern-content { flex: 1; padding: 40px; display: flex; flex-direction: column; align-items: center; }
                .card-form { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.04); width: 100%; max-width: 500px; margin-top: 20px; }
                
                .form-input { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-family: 'Sarabun'; margin-top: 10px; margin-bottom: 25px; box-sizing: border-box; }
                .btn-red { background-color: #e74c3c; padding: 12px 20px; border-radius: 8px; border: none; font-weight: bold; color: white; width: 100%; cursor: pointer; font-size: 16px; }
            `}</style>

            <div className="modern-wrapper">
                <header className="modern-header">
                    <h1 style={{ margin: 0, fontSize: '24px' }}>ระบบนัดแพทย์โรงพยาบาล</h1>
                </header>

                <div className="modern-body">
                    <aside className="modern-sidebar">
                        <Link href="/doctors" className="active">ข้อมูลเเพทย์</Link>
                    </aside>

                    <main className="modern-content">
                        <div className="card-form">
                            <h2 style={{ color: '#e74c3c', marginTop: 0 }}>ลบข้อมูลแพทย์</h2>
                            
                            <form onSubmit={handleDelete}>
                                <label style={{ fontWeight: 'bold' }}>รหัสแพทย์ (ดูจากหน้าตาราง):</label>
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    placeholder="ใส่ตัวเลข ID ที่ต้องการลบ" 
                                    value={doctorId}
                                    onChange={(e) => setDoctorId(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn-red">ยืนยันการลบข้อมูล</button>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}