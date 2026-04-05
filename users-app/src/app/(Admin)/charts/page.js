"use client";

import './style.css';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function ChartsPage() {
    const router = useRouter();
    
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const safeFetch = async (url) => {
            try {
                const res = await fetch(url);
                return res.ok ? await res.json() : [];
            } catch {
                return [];
            }
        };

        const fetchAllData = async () => {
            const [patData, docData, deptData, appData] = await Promise.all([
                safeFetch('/api/users'),          
                safeFetch('/api/doctors'),        
                safeFetch('/api/departments'),    
                safeFetch('/api/appointment'),    
            ]);

            setPatients(patData);
            setDoctors(docData);
            setDepartments(deptData);
            setAppointments(appData);
            setIsLoading(false);
        };

        fetchAllData();
    }, []);

    const totalPatients = patients.length;
    const totalDoctors = doctors.length;
    const totalDepartments = departments.length;
    const totalAppointments = appointments.length;

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

    const ageData = {
        labels: patients.map(p => p.first_name || `ID:${p.user_id}`),
        datasets: [{
            label: 'อายุ (ปี)',
            data: patients.map(p => parseInt(p.age) || 0),
            backgroundColor: '#3e9d8a',
            borderRadius: 5,
        }]
    };

    const appByDoctor = appointments.reduce((acc, curr) => {
        const docName = curr.doctor_fname ? `นพ./พญ. ${curr.doctor_fname}` : 'ไม่ระบุ';
        acc[docName] = (acc[docName] || 0) + 1;
        return acc;
    }, {});

    const appointmentData = {
        labels: Object.keys(appByDoctor),
        datasets: [{
            data: Object.values(appByDoctor),
            backgroundColor: ['#f1c40f', '#e67e22', '#e74c3c', '#9b59b6', '#34495e', '#1abc9c'],
            borderWidth: 1,
        }]
    };

    const appByDept = appointments.reduce((acc, curr) => {
        const deptName = curr.department_name || 'ไม่ระบุ';
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
    }, {});

    const deptAppointmentData = {
        labels: Object.keys(appByDept),
        datasets: [{
            data: Object.values(appByDept),
            backgroundColor: ['#2ecc71', '#3498db', '#9b59b6', '#f39c12', '#d35400'],
            borderWidth: 1,
        }]
    };

    return (
        <>
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

                                <h3 className="section-title">🏥 ข้อมูลนัดหมายแพทย์</h3>
                                <div className="chart-container">
                                    <div className="chart-box" style={{ flex: '1' }}>
                                        <h4 style={{ margin: '0 0 20px 0', color: '#333' }}>จำนวนคิว แยกตามแพทย์</h4>
                                        <div style={{ width: '300px', margin: '0 auto' }}>
                                            {totalAppointments > 0 ? (
                                                <Doughnut data={appointmentData} />
                                            ) : (
                                                <p style={{ textAlign: 'center', color: '#999' }}>ยังไม่มีข้อมูลการนัดหมาย</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="chart-box" style={{ flex: '1' }}>
                                        <h4 style={{ margin: '0 0 20px 0', color: '#333' }}>จำนวนคิว แยกตามแผนก</h4>
                                        <div style={{ width: '300px', margin: '0 auto' }}>
                                            {totalAppointments > 0 ? (
                                                <Doughnut data={deptAppointmentData} />
                                            ) : (
                                                <p style={{ textAlign: 'center', color: '#999' }}>ยังไม่มีข้อมูลการนัดหมาย</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div style={{ height: '40px' }}></div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}