"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddDoctorPage() {
    const router = useRouter();
    
    const handleAddDoctor = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/doctors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("บันทึกข้อมูลแพทย์ลงฐานข้อมูลเรียบร้อยแล้ว ✅");
                router.push("/doctors");
            } else {
                const errorData = await response.json();
                alert("เกิดข้อผิดพลาด: " + errorData.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้");
        }
    };

    return (
        <>
            <style>{`
                .modern-wrapper { display: flex; flex-direction: column; min-height: 100vh; background-color: #f4f8f7; font-family: 'Sarabun', sans-serif; margin: 0; }
                .modern-header { background: #3e9d8a; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 15px rgba(0,0,0,0.08); z-index: 10; }
                .modern-body { display: flex; flex: 1; }
                .modern-sidebar { width: 260px; background-color: #3e9d8a; flex-shrink: 0; box-shadow: 2px 0 10px rgba(0,0,0,0.05); }
                .modern-sidebar a { display: block; padding: 16px 25px; color: rgba(255,255,255,0.85); text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); transition: all 0.3s; font-size: 16px; }
                .modern-sidebar a:hover { background-color: rgba(255,255,255,0.1); color: white; }
                .modern-sidebar a.active { background-color: white; color: #3e9d8a; font-weight: bold; border-left: 5px solid #f39c12; }
                
                .modern-content { flex: 1; padding: 40px; display: flex; flex-direction: column; align-items: center; overflow-x: auto; }
                .card-form { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.04); width: 100%; max-width: 500px; margin-top: 20px; }
                
                .form-group { margin-bottom: 20px; }
                .form-label { display: block; margin-bottom: 8px; font-weight: 600; color: #444; font-size: 15px; }
                .form-input { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-family: 'Sarabun'; transition: all 0.3s; font-size: 15px; background-color: #fafafa; box-sizing: border-box; }
                .form-input:focus { border-color: #3e9d8a; box-shadow: 0 0 0 3px rgba(62, 157, 138, 0.15); outline: none; background-color: white; }
                
                .btn-modern { padding: 12px 20px; border-radius: 8px; border: none; font-weight: bold; font-family: 'Sarabun'; cursor: pointer; transition: all 0.2s; color: white; text-decoration: none; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); width: 100%; display: block; text-align: center; }
                .btn-modern:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
                .btn-green { background-color: #3e9d8a; }
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
                            <h2 style={{ color: '#2c7a6b', margin: '0 0 25px 0', textAlign: 'center', fontSize: '24px' }}>เพิ่มข้อมูลเเพทย์</h2>
                            
                            <form onSubmit={handleAddDoctor}>
                                <div className="form-group">
                                    <label className="form-label">ชื่อหมอ</label>
                                    <input type="text" name="first_name" className="form-input" placeholder="เช่น ใจดี" required />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">นามสกุลหมอ</label>
                                    <input type="text" name="last_name" className="form-input" placeholder="เช่น รักษาเก่ง" required />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">รหัสเเผนก</label>
                                    <input type="text" name="department_id" className="form-input" placeholder="เช่น D001" required />
                                </div>

                               

                                <button type="submit" className="btn-modern btn-green">บันทึกข้อมูลหมอ</button>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
