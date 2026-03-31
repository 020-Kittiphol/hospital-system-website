"use client";

import React from 'react';
import RegisterForm from './components/users_form'; // เช็ค Path ให้ตรงกับที่เซฟไว้นะครับ
import './register.css'; // อย่าลืม Import ไฟล์ CSS นะครับ

export default function RegisterPage() {
    return (
        <div className="reg-wrapper">
            
            {/* ดึงกล่องการ์ดมาแสดงตรงนี้ */}
            <RegisterForm />
        </div>
    );
}