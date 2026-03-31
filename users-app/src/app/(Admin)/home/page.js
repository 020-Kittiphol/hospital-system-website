"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './style2.css';

export default function HomePage() {
    const router = useRouter();

    return (
        <>
            <div className="home-wrapper">
                
                {/* ปุ่ม Sign Out */}
                <button className="home-signout" onClick={() => router.push('/signin')}>
                    Sign out
                </button>

                {/* แบนเนอร์ WELCOME */}
                <div className="home-hero">
                    <div className="home-hero-overlay"></div>
                    <h1>WELCOME</h1>
                </div>

                {/* เมนูด้านล่าง */}
                <div className="home-content">
                    <div className="home-title">หน้าแรก</div>
                    
                    <div className="home-cards-container">
                        {/* 💡 เปลี่ยน href ให้ตรงกับชื่อโฟลเดอร์ของเจมนะครับ */}
                        <Link href="/appointment" className="home-card">
                            นัดพบแพทย์
                        </Link>
                        
                        <Link href="/doctors" className="home-card">
                            ข้อมูลแพทย์
                        </Link>
                        
                        <Link href="/departments" className="home-card">
                            ข้อมูลแผนก
                        </Link>
                        
                        <Link href="/users" className="home-card">
                            ข้อมูลผู้ใช้
                        </Link>
                    </div>
                </div>

            </div>
        </>
    );
}