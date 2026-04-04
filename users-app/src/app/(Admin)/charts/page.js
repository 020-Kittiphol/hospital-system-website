"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';

// 🌟 ลงทะเบียน Component ของกราฟ (เพิ่ม Doughnut เข้ามาด้วย)
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function ChartsPage() {
    const router = useRouter();
    
    // 🌟 สร้าง State มารับข้อมูลให้ครบทุกตาราง
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 🌟 ฟังก์ชันดึงข้อมูลแบบปลอดภัย (ถ้า API ไหนยังไม่ทำ จะได้ไม่พัง)
        const safeFetch = async (url) => {
            try {
                const res = await fetch(url);
                return res.ok ? await res.json() : [];
            } catch {
                return [];
            }
        };

        const fetchAllData = async () => {
            // ดึงข้อมูล 4 เส้นพร้อมกันเพื่อความรวดเร็ว!
            const [patData, docData, deptData, appData] = await Promise.all([
                safeFetch('/api/users'),          // คนไข้
                safeFetch('/api/doctors'),        // หมอ
                safeFetch('/api/departments'),    // แผนก
                safeFetch('/api/appointment'),    // นัดหมาย (ถ้าเจมตั้งชื่อไฟล์ api/appointments ให้เติม s ด้วยนะครับ)
            ]);

            setPatients(patData);
            setDoctors(docData);
            setDepartments(deptData);
            setAppointments(appData);
            setIsLoading(false);
        };

        fetchAllData();
    }, []);

    // ==========================================
    // 📊 คำนวณข้อมูลสำหรับกล่องสรุปตัวเลข (Summary)
    // ==========================================
    const totalPatients = patients.length;
    const totalDoctors = doctors.length;
    const totalDepartments = departments.length;
    const totalAppointments = appointments.length;

    const avgAge = totalPatients > 0 
        ? Math.round(patients.reduce((sum, p) => sum + (parseInt(p.age) || 0), 0) / totalPatients) : 0;

    // ==========================================
    // 📊 เตรียมข้อมูลสำหรับกราฟ (Charts)
    // ==========================================
    
    // 1. กราฟวงกลม: สัดส่วนเพศคนไข้
    const genderData = {
        labels: ['ชาย', 'หญิง'],
        datasets: [{
            data: [
                patients.filter(p => p.gender === 'ชาย').length, 
                patients.filter(p => p.gender === 'หญิง').length
            ],
            backgroundColor: ['#3498db', '#e74c3c'],
            borderWidth: 0,
        }]
    };

    // 2. กราฟแท่ง: อายุคนไข้
    const ageData = {
        labels: patients.map(p => p.first_name || `ID:${p.user_id}`),
        datasets: [{
            label: 'อายุ (ปี)',
            data: patients.map(p => parseInt(p.age) || 0),
            backgroundColor: '#3e9d8a',
            borderRadius: 5,
        }]
    };

    // 3. กราฟโดนัท (Doughnut): จำนวนการนัดหมายแยกตามรหัสหมอ
    // (นับว่าหมอ ID ไหน โดนจองคิวไปกี่ครั้ง)
    const appByDoctor = appointments.reduce((acc, curr) => {
        const docId = curr.doctor_id || 'ไม่ระบุ';
        acc[docId] = (acc[docId] || 0) + 1;
        return acc;
    }, {});

    const appointmentData = {
        labels: Object.keys(appByDoctor).map(id => id !== 'ไม่ระบุ' ? `หมอ ID: ${id}` : 'ไม่ระบุ'),
        datasets: [{
            data: Object.values(appByDoctor),
            backgroundColor: ['#f1c40f', '#e67e22', '#e74c3c', '#9b59b6', '#34495e'],
            borderWidth: 0,
        }]
    };

    return (
        <>
            <style>{`
                
            `}</style>

            <div className="modern-wrapper">
                <header className="modern-header">
                    <h1 style={{ margin: 0, fontSize: '24px' }}>ระบบนัดแพทย์โรงพยาบาล</h1>
                    <button className="btn-signout" onClick={() => router.push('/signin')}>Sign out</button>
                </header>

                <div className="modern-body">
                    <aside className="modern-sidebar">
                        <Link href="/users">ข้อมูลผู้ใช้</Link>
                        <Link href="/appointment">ข้อมูลการนัดหมาย</Link>
                        <Link href="/departments">ข้อมูลแผนก</Link>
                        <Link href="/doctors">ข้อมูลเเพทย์</Link>
                        <Link href="/charts" className="active">สรุปข้อมูล chart</Link>
                    </aside>

                    <main className="modern-content">
                        <h2 style={{ color: '#2c7a6b', margin: '0 0 20px 0' }}>แดชบอร์ดสรุปข้อมูลโรงพยาบาล</h2>
                        
                        {isLoading ? (
                            <div style={{ textAlign: 'center', marginTop: '50px' }}>กำลังโหลดข้อมูลทั้งหมด... ⏳</div>
                        ) : (
                            <>
                                {/* ========================================== */}
                                {/* 🌟 กล่องสรุปตัวเลข (4 กล่องเรียงกัน) */}
                                {/* ========================================== */}
                                <div className="summary-container">
                                    <div className="summary-card" style={{ borderBottomColor: '#3e9d8a' }}>
                                        <div style={{ color: '#7f8c8d', fontSize: '16px' }}>คนไข้ทั้งหมด (คน)</div>
                                        <div className="summary-value" style={{ color: '#3e9d8a' }}>{totalPatients}</div>
                                    </div>
                                    <div className="summary-card" style={{ borderBottomColor: '#2980b9' }}>
                                        <div style={{ color: '#7f8c8d', fontSize: '16px' }}>แพทย์ทั้งหมด (คน)</div>
                                        <div className="summary-value" style={{ color: '#2980b9' }}>{totalDoctors}</div>
                                    </div>
                                    <div className="summary-card" style={{ borderBottomColor: '#8e44ad' }}>
                                        <div style={{ color: '#7f8c8d', fontSize: '16px' }}>แผนกทั้งหมด (แผนก)</div>
                                        <div className="summary-value" style={{ color: '#8e44ad' }}>{totalDepartments}</div>
                                    </div>
                                    <div className="summary-card" style={{ borderBottomColor: '#e67e22' }}>
                                        <div style={{ color: '#7f8c8d', fontSize: '16px' }}>คิวนัดหมาย (คิว)</div>
                                        <div className="summary-value" style={{ color: '#e67e22' }}>{totalAppointments}</div>
                                    </div>
                                </div>

                                {/* ========================================== */}
                                {/* 🌟 หมวดหมู่: ข้อมูลผู้ป่วย */}
                                {/* ========================================== */}
                                <h3 className="section-title">📊 ข้อมูลผู้ป่วย</h3>
                                <div className="chart-container">
                                    <div className="chart-box" style={{ flex: '0.4' }}>
                                        <h4 style={{ margin: '0 0 20px 0', color: '#333' }}>สัดส่วนเพศ</h4>
                                        <div style={{ width: '250px' }}>
                                            <Pie data={genderData} />
                                        </div>
                                    </div>
                                    <div className="chart-box" style={{ flex: '0.6' }}>
                                        <h4 style={{ margin: '0 0 20px 0', color: '#333' }}>อายุคนไข้แต่ละราย</h4>
                                        <div style={{ width: '100%', height: '280px' }}>
                                            <Bar data={ageData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </div>
                                </div>

                                {/* ========================================== */}
                                {/* 🌟 หมวดหมู่: การทำงานของแพทย์และนัดหมาย */}
                                {/* ========================================== */}
                                <h3 className="section-title">🏥 ข้อมูลนัดหมายแพทย์</h3>
                                <div className="chart-container">
                                    <div className="chart-box" style={{ flex: '1' }}>
                                        <h4 style={{ margin: '0 0 20px 0', color: '#333' }}>จำนวนคิวนัดหมาย แยกตาม ID แพทย์</h4>
                                        <div style={{ width: '300px', margin: '0 auto' }}>
                                            {totalAppointments > 0 ? (
                                                <Doughnut data={appointmentData} />
                                            ) : (
                                                <p style={{ textAlign: 'center', color: '#999' }}>ยังไม่มีข้อมูลการนัดหมาย</p>
                                            )}
                                        </div>
                                    </div>
                                    {/* พื้นที่ว่างเผื่อใส่กราฟแผนกในอนาคต */}
                                    <div className="chart-box" style={{ flex: '1', justifyContent: 'center', backgroundColor: '#fafafa', border: '1px dashed #ccc', boxShadow: 'none' }}>
                                        <p style={{ color: '#999' }}>เตรียมพื้นที่สำหรับกราฟแผนกในอนาคต</p>
                                    </div>
                                </div>
                                
                                {/* เว้นที่ด้านล่างนิดนึงให้เลื่อนลงมาสุดแล้วดูสวยงาม */}
                                <div style={{ height: '40px' }}></div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}