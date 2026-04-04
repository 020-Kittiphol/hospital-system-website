"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './style.css';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        age: '',
        citizen_id: '',
        gender: 'ชาย',
        weight: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
                router.push('/signin'); // สมัครเสร็จ เด้งไปหน้า Login
            } else {
                const data = await response.json();
                alert(`เกิดข้อผิดพลาด: ${data.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("ระบบมีปัญหา ไม่สามารถลงทะเบียนได้");
        }
    };

    return (
        <>
            <div className="signup-wrapper">
                <div className="signup-card">
                    <h2 className="signup-title">ลงทะเบียนคนไข้ใหม่</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="text" name="username" className="form-input" placeholder="Username (สำหรับเข้าสู่ระบบ)" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <input type="password" name="password" className="form-input" placeholder="Password (รหัสผ่าน)" onChange={handleChange} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <input type="text" name="first_name" className="form-input" placeholder="ชื่อจริง" onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <input type="text" name="last_name" className="form-input" placeholder="นามสกุล" onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <input type="text" name="citizen_id" className="form-input" placeholder="เลขบัตรประจำตัวประชาชน 13 หลัก" onChange={handleChange} />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <input type="number" name="age" className="form-input" placeholder="อายุ (ปี)" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <input type="number" name="weight" className="form-input" placeholder="น้ำหนัก (กก.)" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <select name="gender" className="form-input" onChange={handleChange}>
                                    <option value="ชาย">ชาย</option>
                                    <option value="หญิง">หญิง</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn-submit">ยืนยันการลงทะเบียน</button>
                    </form>
                    
                    <Link href="/signin" className="login-link">มีบัญชีอยู่แล้ว? เข้าสู่ระบบที่นี่</Link>
                </div>
            </div>
        </>
    );
}