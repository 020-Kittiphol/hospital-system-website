"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BookingPage() {
    
    const [formData, setFormData] = useState({
        department_id: '',
        doctor_id: '',
        app_date: '',
        symptoms: ''
    });

    const [departments, setDepartments] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]); 
    const [filteredDoctors, setFilteredDoctors] = useState([]); 

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const deptRes = await fetch('/api/departments');
                const deptData = await deptRes.json();
                
                if (Array.isArray(deptData)) {
                    setDepartments(deptData);
                } else if (deptData && Array.isArray(deptData.data)) {
                    setDepartments(deptData.data);
                } else if (deptData && deptData.departments) {
                    setDepartments(deptData.departments);
                } else {
                    console.log("⚠️ รูปแบบข้อมูลแผนกแปลกๆ:", deptData);
                    setDepartments([]); 
                }
                
                const docRes = await fetch('/api/doctors');
                const docData = await docRes.json();
                
                if (Array.isArray(docData)) {
                    setAllDoctors(docData);
                } else if (docData && Array.isArray(docData.data)) {
                    setAllDoctors(docData.data);
                } else if (docData && docData.doctors) {
                    setAllDoctors(docData.doctors);
                } else {
                    console.log("⚠️ รูปแบบข้อมูลหมอแปลกๆ:", docData);
                    setAllDoctors([]); 
                }

            } catch (error) {
                console.error("❌ ดึงข้อมูลไม่สำเร็จ:", error);
            }
        };
        fetchDropdownData();
    }, []);

    const handleDepartmentChange = (e) => {
        const selectedDeptId = e.target.value;
        
        setFormData({ ...formData, department_id: selectedDeptId, doctor_id: '' });

        if (selectedDeptId) {
            const matchingDoctors = allDoctors.filter(doc => doc.department_id.toString() === selectedDeptId.toString());
            setFilteredDoctors(matchingDoctors);
        } else {
            setFilteredDoctors([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'department_id') {
            console.log("👉 1. แผนกที่เลือก ID คือ:", value);
            
            console.log("👉 2. รายชื่อหมอทั้งหมดในระบบ:", allDoctors);

            const matchedDoctors = allDoctors.filter(doc => {
                console.log(`🔍 กำลังเช็คหมอ: ${doc.first_name} | แผนกของหมอคือ: ${doc.department_id}`);
                
                if (!doc.department_id) return false; 
                return doc.department_id.toString() === value.toString();
            });

            console.log("✅ 3. หมอที่จับคู่สำเร็จ (พร้อมโชว์):", matchedDoctors);
            
            setFilteredDoctors(matchedDoctors);
            setFormData(prev => ({ ...prev, doctor_id: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("ส่งข้อมูลจองคิว:", formData);
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Sarabun', backgroundColor: '#eaf4f2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ color: '#2c7a6b' }}>ระบบนัดหมายแพทย์</h2>
            <p>สวัสดีคุณ ก้อง, กรุณาเลือกแผนก แพทย์ และวันที่ต้องการนัดหมาย</p>

            <div style={{ background: 'white', padding: '0', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#2c7a6b', color: 'white', padding: '15px 25px', fontSize: '18px', fontWeight: 'bold' }}>
                    กรอกข้อมูลการนัดหมาย
                </div>
                
                <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>แผนกที่ต้องการตรวจ</label>
                        <select 
                            name="department_id" 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }}
                            value={formData.department_id} 
                            onChange={handleDepartmentChange} 
                            required
                        >
                            <option value="">-- กรุณาเลือกแผนก --</option>
                            {departments.map(dept => (
                                <option key={dept.department_id} value={dept.department_id}>
                                    {dept.department_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>แพทย์ผู้เชี่ยวชาญ</label>
                        <select 
                            name="doctor_id" 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', backgroundColor: formData.department_id ? 'white' : '#f5f5f5' }}
                            value={formData.doctor_id} 
                            onChange={handleChange} 
                            disabled={!formData.department_id} 
                            required
                        >
                            <option value="">
                                {formData.department_id ? "-- กรุณาเลือกแพทย์ --" : "-- โปรดเลือกแผนกก่อน --"}
                            </option>
                            {filteredDoctors.map(doc => (
                                <option key={doc.doctor_id} value={doc.doctor_id}>
                                    นพ./พญ. {doc.first_name} {doc.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>วันที่ต้องการนัดหมาย</label>
                        <input 
                            type="date" 
                            name="app_date" 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box' }}
                            value={formData.app_date} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>อาการเบื้องต้น</label>
                        <textarea 
                            name="symptoms" 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical' }}
                            placeholder="พิมพ์อาการของคุณที่นี่..."
                            value={formData.symptoms} 
                            onChange={handleChange} 
                        ></textarea>
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#00897b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                        ยืนยันการนัดหมาย
                    </button>
                </form>
            </div>
        </div>
    );
}