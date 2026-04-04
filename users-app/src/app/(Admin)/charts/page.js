"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 🌟 Import เครื่องมือสร้างกราฟจาก Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// 🌟 ลงทะเบียน Component ของกราฟ
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function ChartsPage() {
    const router = useRouter();
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 🌟 ดึงข้อมูลจาก API เดียวกับหน้าตาราง
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('/api/users');
                if (response.ok) {
                    const data = await response.json();
                    setPatients(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // 🌟 คำนวณข้อมูลสถิติ
    const totalPatients = patients.length;
    const avgAge = totalPatients > 0 
        ? Math.round(patients.reduce((sum, p) => sum + (parseInt(p.age) || 0), 0) / totalPatients) 
        : 0;
    
    const maleCount = patients.filter(p => p.gender === 'ชาย').length;
    const femaleCount = patients.filter(p => p.gender === 'หญิง').length;

    // 🌟 เตรียมข้อมูลกราฟวงกลม (เพศ)
    const genderData = {
        labels: ['ชาย', 'หญิง'],
        datasets: [{
            data: [maleCount, femaleCount],
            backgroundColor: ['#3498db', '#e74c3c'], // สีฟ้าและสีแดง
            hoverBackgroundColor: ['#2980b9', '#c0392b'],
            borderWidth: 0,
        }]
    };

    // 🌟 เตรียมข้อมูลกราฟแท่ง (อายุ)
    const ageData = {
        labels: patients.map(p => p.first_name), // ชื่อคนไข้แกน X
        datasets: [{
            label: 'อายุ (ปี)',
            data: patients.map(p => parseInt(p.age) || 0), // อายุแกน Y
            backgroundColor: '#3e9d8a',
            borderRadius: 5,
        }]
    };

    return (
        <>
            <style>{`
                .modern-wrapper { display: flex; flex-direction: column; min-height: 100vh; background-color: #f4f8f7; font-family: 'Sarabun', sans-serif; margin: 0; }
                .modern-header { background: #3e9d8a; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 15px rgba(0,0,0,0.08); z-index: 10; }
                .modern-body { display: flex; flex: 1; }
                .modern-sidebar { width: 260px; background-color: #3e9d8a; flex-shrink: 0; box-shadow: 2px 0 10px rgba(0,0,0,0.05); z-index: 5; }
                .modern-sidebar a { display: block; padding: 16px 25px; color: rgba(255,255,255,0.85); text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); transition: all 0.3s; font-size: 16px; }
                .modern-sidebar a:hover, .modern-sidebar a.active { background-color: white; color: #3e9d8a; font-weight: bold; border-left: 5px solid #f39c12; }
                
                .modern-content { flex: 1; padding: 40px; overflow-y: auto; width: 100%; }
                
                .btn-signout { padding: 8px 15px; border-radius: 5px; border: none; cursor: pointer; color: #333; font-weight: bold; }
                
                /* สไตล์กล่องสรุปข้อมูล */
                .summary-container { display: flex; gap: 20px; margin-bottom: 30px; }
                .summary-card { flex: 1; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align: center; border-bottom: 4px solid #3e9d8a; }
                .summary-value { font-size: 36px; font-weight: bold; color: #2c7a6b; margin: 10px 0 0 0; }
                
                /* สไตล์กล่องกราฟ */
                .chart-container { display: flex; gap: 20px; flex-wrap: wrap; }
                .chart-box { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); flex: 1; min-width: 300px; display: flex; flex-direction: column; align-items: center; }
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
                        {/* 🌟 หน้า Chart ต้องเป็น Active */}
                        <Link href="/charts" className="active">สรุปข้อมูล chart</Link>
                    </aside>

                    <main className="modern-content">
                        <h2 style={{ color: '#2c7a6b', margin: '0 0 20px 0' }}>แดชบอร์ดสรุปข้อมูลผู้ป่วย</h2>
                        
                        {isLoading ? (
                            <div style={{ textAlign: 'center', marginTop: '50px' }}>กำลังโหลดข้อมูลกราฟ... ⏳</div>
                        ) : (
                            <>
                                {/* 🌟 แถวที่ 1: กล่องสรุปตัวเลข */}
                                <div className="summary-container">
                                    <div className="summary-card">
                                        <div style={{ color: '#7f8c8d', fontSize: '16px' }}>จำนวนคนไข้ทั้งหมด (คน)</div>
                                        <div className="summary-value">{totalPatients}</div>
                                    </div>
                                    <div className="summary-card">
                                        <div style={{ color: '#7f8c8d', fontSize: '16px' }}>อายุเฉลี่ยคนไข้ (ปี)</div>
                                        <div className="summary-value">{avgAge}</div>
                                    </div>
                                </div>

                                {/* 🌟 แถวที่ 2: กล่องกราฟ */}
                                <div className="chart-container">
                                    {/* กล่องซ้าย: กราฟวงกลม */}
                                    <div className="chart-box" style={{ flex: '0.4' }}>
                                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>สัดส่วนเพศ</h3>
                                        {totalPatients > 0 ? (
                                            <div style={{ width: '250px' }}>
                                                <Pie data={genderData} />
                                            </div>
                                        ) : (
                                            <p>ยังไม่มีข้อมูล</p>
                                        )}
                                    </div>

                                    {/* กล่องขวา: กราฟแท่ง */}
                                    <div className="chart-box" style={{ flex: '0.6' }}>
                                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>อายุคนไข้แต่ละราย</h3>
                                        {totalPatients > 0 ? (
                                            <div style={{ width: '100%', height: '300px' }}>
                                                <Bar 
                                                    data={ageData} 
                                                    options={{ maintainAspectRatio: false }}
                                                />
                                            </div>
                                        ) : (
                                            <p>ยังไม่มีข้อมูล</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}