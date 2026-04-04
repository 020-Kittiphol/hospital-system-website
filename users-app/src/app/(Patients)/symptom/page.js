"use client";

import './style.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientDashboard() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    
    const [departments, setDepartments] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    const [formData, setFormData] = useState({
        department_id: '',
        doctor_id: '',
        app_date: '',
        symptoms: ''
    });

    useEffect(() => {
        const name = localStorage.getItem('first_name');
        if (name) setFirstName(name);
        else router.push('/signin');

        const fetchBookingData = async () => {
            try {
                const res = await fetch('/api/booking-data');
                if (res.ok) {
                    const data = await res.json();
                    setDepartments(data.departments);
                    setAllDoctors(data.doctors);
                }
            } catch (error) {
                console.error("โหลดข้อมูลแผนกไม่สำเร็จ:", error);
            }
        };
        fetchBookingData();
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/signin');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'department_id') {
            const matchedDoctors = allDoctors.filter(doc => doc.department_id.toString() === value);
            setFilteredDoctors(matchedDoctors);
            
            setFormData(prev => ({ ...prev, doctor_id: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.department_id || !formData.doctor_id || !formData.appointment_date) {
        alert("กรุณาเลือกแผนก แพทย์ และวันที่ให้ครบถ้วนครับ");
        return;
    }

        const userId = localStorage.getItem('user_id'); 

        if (!userId) {
            alert("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
            router.push('/signin');
            return;
        }

    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, user_id: userId })
        });
            if (response.ok) {
                alert("จองคิวสำเร็จ! รอการยืนยันจากโรงพยาบาลครับ 🏥");
                
                setFormData({
                    department_id: '',
                    doctor_id: '',
                    appointment_date: '',
                    symptoms: ''
                });
            } else {
                const data = await response.json();
                alert(`เกิดข้อผิดพลาด: ${data.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
    };

    return (
        <>
            <div className="dashboard-wrapper">
                <div className="welcome-banner">
                    <button className="btn-signout" onClick={handleLogout}>Sign out</button>
                    <h1 className="welcome-text">WELCOME</h1>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
                    <h2>ระบบนัดหมายแพทย์</h2>
                    <p>สวัสดีคุณ {firstName}, กรุณาเลือกแผนก แพทย์ และวันที่ต้องการนัดหมาย</p>
                </div>

                <div className="form-container">
                    <div className="form-card">
                        <div className="form-header">กรอกข้อมูลการนัดหมาย</div>
                        <div className="form-body">
                            
                            <div className="form-group">
                                <label className="form-label">แผนกที่ต้องการตรวจ</label>
                                <select name="department_id" className="form-input" value={formData.department_id} onChange={handleChange} required>
                                    <option value="">-- กรุณาเลือกแผนก --</option>
                                    {departments.map((dept) => (
                                        <option key={dept.department_id} value={dept.department_id}>
                                            {dept.department_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">แพทย์ผู้เชี่ยวชาญ</label>
                                <select name="doctor_id" className="form-input" value={formData.doctor_id} onChange={handleChange} disabled={!formData.department_id} required>
                                    <option value="">
                                        {formData.department_id ? "-- กรุณาเลือกแพทย์ --" : "-- โปรดเลือกแผนกก่อน --"}
                                    </option>
                                    {filteredDoctors.map((doc) => (
                                        <option key={doc.doctor_id} value={doc.doctor_id}>
                                            นายแพทย์/แพทย์หญิง {doc.doctor_name || doc.first_name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className="form-group">
                                <label className="form-label">วันที่ต้องการนัดหมาย</label>
                                <input type="date" name="appointment_date" className="form-input" value={formData.appointment_date} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">อาการเบื้องต้น</label>
                                <textarea name="symptoms" className="form-textarea" placeholder="พิมพ์อาการของคุณที่นี่..." value={formData.symptoms} onChange={handleChange}></textarea>
                            </div>

                            <button className="btn-submit" onClick={handleSubmit}>ยืนยันการนัดหมาย</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}