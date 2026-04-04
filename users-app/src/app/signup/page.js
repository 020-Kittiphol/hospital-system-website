"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        username: '', password: '', first_name: '', last_name: '', 
        citizen_id: '', age: '', gender: 'ชาย', weight: '', height: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("ลงทะเบียนสำเร็จ! เข้าสู่ระบบได้เลยครับ 🎉");
                router.push('/signin');
            } else {
                const data = await response.json();
                alert(`เกิดข้อผิดพลาด: ${data.error}`);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
    };

    return (
        <>
            <div className="signup-wrapper">
                <div className="signup-card">
                    <h2 className="signup-title">ลงทะเบียนคนไข้ใหม่</h2>
                    <form onSubmit={handleSignup}>
                        
                        <div className="form-group">
                            <input type="text" name="username" className="form-input" placeholder="ชื่อผู้ใช้งาน (Username)" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <input type="password" name="password" className="form-input" placeholder="รหัสผ่าน (Password)" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="form-row">
                            <input type="text" name="first_name" className="form-input" placeholder="ชื่อจริง" value={formData.first_name} onChange={handleChange} required />
                            <input type="text" name="last_name" className="form-input" placeholder="นามสกุล" value={formData.last_name} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <input type="text" name="citizen_id" className="form-input" placeholder="เลขประจำตัวประชาชน 13 หลัก" value={formData.citizen_id} onChange={handleChange} maxLength="13" required />
                        </div>

                        <div className="form-row">
                            <input type="number" name="age" className="form-input" placeholder="อายุ" value={formData.age} onChange={handleChange} required />
                            <input type="number" name="weight" className="form-input" placeholder="น้ำหนัก" value={formData.weight} onChange={handleChange} required />
                            <input type="number" name="height" className="form-input" placeholder="ส่วนสูง" value={formData.height} onChange={handleChange} required />
                            <select name="gender" className="form-input" value={formData.gender} onChange={handleChange}>
                                <option value="ชาย">ชาย</option>
                                <option value="หญิง">หญิง</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-signup">ยืนยันการลงทะเบียน</button>
                        
                        <Link href="/signin" className="login-link">มีบัญชีอยู่แล้ว? เข้าสู่ระบบที่นี่</Link>
                    </form>
                </div>
            </div>
        </>
    );
}