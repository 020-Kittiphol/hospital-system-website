"use client";

import './style.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientDashboard() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    
    // 🌟 State สำหรับเก็บข้อมูลจาก API
    const [departments, setDepartments] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]);
    
    // 🌟 State สำหรับเก็บข้อมูลที่โดนกรองแล้ว (รอเอาไปโชว์ในกล่อง)
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);

    // 🌟 State สำหรับเก็บข้อมูลที่คนไข้พิมพ์/เลือก
    const [formData, setFormData] = useState({
        department_id: '',
        doctor_id: '',
        app_date: '', // <== เพิ่มช่องเก็บวันที่นัดหมายกลับมาแล้ว!
        symptoms: ''
    });

    // ==========================================
    // 1. ดึงข้อมูลแผนกและหมอตอนเปิดหน้าเว็บ
    // ==========================================
    useEffect(() => {
        const name = localStorage.getItem('first_name');
        if (name) setFirstName(name);
        else router.push('/signin');

        const fetchBookingData = async () => {
            try {
                // ยิงไปขอข้อมูล 2 ที่พร้อมกัน (วิธีที่ชัวร์ที่สุด)
                const [deptRes, docRes] = await Promise.all([
                    fetch('/api/departments'),
                    fetch('/api/doctors')
                ]);

                if (deptRes.ok) {
                    const deptData = await deptRes.json();
                    setDepartments(Array.isArray(deptData) ? deptData : (deptData.data || []));
                }

                if (docRes.ok) {
                    const docData = await docRes.json();
                    setAllDoctors(Array.isArray(docData) ? docData : (docData.data || []));
                }

            } catch (error) {
                console.error("โหลดข้อมูลไม่สำเร็จ:", error);
            }
        };
        fetchBookingData();
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/signin');
    };

    // ==========================================
    // 2. ระบบ Cascading (กรองหมอ และ วันเวลา ตามแผนก)
    // ==========================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'department_id') {
            // 2.1 กรองรายชื่อหมอให้ตรงกับแผนก
            const matchedDoctors = allDoctors.filter(doc => doc.department_id.toString() === value);
            setFilteredDoctors(matchedDoctors);
            
            // 2.2 กรองวัน/เวลา ดึงมาเฉพาะคิวที่แผนกนี้เปิดรับ
            const matchedDates = departments.filter(d => 
                d.department_id.toString() === value && d.department_date
            );
            setAvailableDates(matchedDates);
            
            // 2.3 ล้างค่าช่องหมอและช่องเวลาทิ้ง บังคับให้คนไข้เลือกใหม่
            setFormData(prev => ({ ...prev, doctor_id: '', app_date: '' }));
        }
    };

    // ==========================================
    // 3. ส่งข้อมูลจองคิวไปให้ API หลังบ้าน
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // เช็คว่ากรอกครบไหม (เพิ่ม app_date เข้าไปเช็คด้วย)
        if (!formData.department_id || !formData.doctor_id || !formData.app_date) {
            alert("กรุณาเลือกแผนก แพทย์ และวันเวลา ให้ครบถ้วนครับ");
            return;
        }

        const userId = localStorage.getItem('user_id'); 

        if (!userId) {
            alert("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
            router.push('/signin');
            return;
        }

        try {
            // 🌟 แก้ชื่อ API เป็น appointment (ไม่มี s) ให้ตรงกับโฟลเดอร์ของเจมเป๊ะๆ
            const response = await fetch('/api/appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, user_id: userId })
            });

            if (response.ok) {
                alert("จองคิวสำเร็จ! รอการยืนยันจากโรงพยาบาลครับ 🏥");
                
                // ล้างฟอร์มให้ว่างเพื่อรับคิวต่อไป
                setFormData({
                    department_id: '',
                    doctor_id: '',
                    app_date: '',
                    symptoms: ''
                });
                setFilteredDoctors([]);
                setAvailableDates([]);
                
            } else {
                const data = await response.json();
                alert(`เกิดข้อผิดพลาด: ${data.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
    };

    // ==========================================
    // 4. จัดการรายชื่อแผนกไม่ให้แสดงซ้ำกัน
    // ==========================================
    const uniqueDepartments = Array.from(new Map(departments.map(item => [item.department_id, item])).values());

    return (
        <>
            <div className="dashboard-wrapper">
                <div className="welcome-banner">
                    <button className="btn-signout" onClick={handleLogout}>Sign out</button>
                    <h1 className="welcome-text">WELCOME</h1>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
                    <h2>ระบบนัดหมายแพทย์</h2>
                    <p>สวัสดีคุณ {firstName}, กรุณาเลือกแผนก แพทย์ และเวลาที่ต้องการนัดหมาย</p>
                </div>

                <div className="form-container">
                    <div className="form-card">
                        <div className="form-header">กรอกข้อมูลการนัดหมาย</div>
                        <div className="form-body">
                            
                            {/* 🌟 กล่องที่ 1: เลือกแผนก (ตัดชื่อซ้ำออกแล้ว) */}
                            <div className="form-group">
                                <label className="form-label">แผนกที่ต้องการตรวจ</label>
                                <select name="department_id" className="form-input" value={formData.department_id} onChange={handleChange} required>
                                    <option value="">-- กรุณาเลือกแผนก --</option>
                                    {uniqueDepartments.map((dept) => (
                                        <option key={dept.department_id} value={dept.department_id}>
                                            {dept.department_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 🌟 กล่องที่ 2: เลือกหมอ */}
                            <div className="form-group">
                                <label className="form-label">แพทย์ผู้เชี่ยวชาญ</label>
                                <select name="doctor_id" className="form-input" value={formData.doctor_id} onChange={handleChange} disabled={!formData.department_id} required>
                                    <option value="">
                                        {formData.department_id ? "-- กรุณาเลือกแพทย์ --" : "-- โปรดเลือกแผนกก่อน --"}
                                    </option>
                                    {filteredDoctors.map((doc) => (
                                        <option key={doc.doctor_id} value={doc.doctor_id}>
                                            นพ./พญ. {doc.doctor_name || doc.first_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 🌟 กล่องที่ 3: เลือกวัน/เวลาที่แผนกนั้นเปิดรับ */}
                            <div className="form-group">
                                <label className="form-label">วันและเวลาที่เปิดรับนัด</label>
                                <select name="app_date" className="form-input" value={formData.app_date} onChange={handleChange} disabled={!formData.department_id} required>
                                    <option value="">
                                        {formData.department_id ? "-- กรุณาเลือกวันและเวลา --" : "-- โปรดเลือกแผนกก่อน --"}
                                    </option>
                                    {availableDates.map((dateObj, index) => (
                                        <option key={index} value={dateObj.department_date}>
                                            {/* โชว์วันที่แบบภาษาไทยสวยๆ */}
                                            {new Date(dateObj.department_date).toLocaleString('th-TH', { 
                                                year: 'numeric', month: 'long', day: 'numeric', 
                                                hour: '2-digit', minute: '2-digit' 
                                            })} น.
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 🌟 กล่องที่ 4: อาการเบื้องต้น */}
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