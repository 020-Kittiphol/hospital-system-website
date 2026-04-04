"use client"

import './style3.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // 🌟 1. เพิ่ม import Link ตรงนี้ครับ
import md5 from 'md5';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        localStorage.setItem("access_token", "notoken");
    }, []);

    const getAuthenKey = async () => {
        const response = await fetch("http://localhost:8080/api/authen_request", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                authen_request: md5(username)
            })
        });
        const d = await response.json();
        return d;
    }

    const getAccessKey = async (authenKey) => {
        const response = await fetch("http://localhost:8080/api/access_request", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                auth_signature: md5(username + "&" + md5(password)),
                auth_key: authenKey.data
            })
        });
        const d = await response.json();
        return d;
    }

    const doSignIn = async () => {
        try {
            const authenKey = await getAuthenKey();
            const d = await getAccessKey(authenKey);

            if (d.isErr || !d.result) {
                setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
                return;
            }

            localStorage.setItem("access_token", d.data.access_token);
            localStorage.setItem("user_id", d.data.user_info.user_id);
            localStorage.setItem("username", d.data.user_info.username);
            localStorage.setItem("first_name", d.data.user_info.first_name);
            localStorage.setItem("last_name", d.data.user_info.last_name);
            localStorage.setItem("age", d.data.user_info.age);
            localStorage.setItem("nationality", d.data.user_info.nationality);
            localStorage.setItem("citizen_id", d.data.user_info.citizen_id);
            localStorage.setItem("gender", d.data.user_info.gender);
            localStorage.setItem("weight", d.data.user_info.weight);
            localStorage.setItem("height", d.data.user_info.height);
            localStorage.setItem("symptoms", d.data.user_info.symptoms);
            localStorage.setItem("role_id", d.data.user_info.role_id);

            // 💡 โค้ดเดิมของเจม: ถ้าเป็นแอดมิน (role=1) ให้ไปหน้า home
            if (parseInt(d.data.user_info.role_id) === 1) {
                router.push("./home");
            } 
            // 💡 ไอเดียเพิ่มเติม: ถ้าเจมทำหน้าสำหรับคนไข้ (role=2) เสร็จแล้ว ค่อยมาปลดล็อกโค้ดตรงนี้ได้ครับ
            else if (parseInt(d.data.user_info.role_id) === 2) {
                router.push("./symptom"); 
            }
            

        } catch(err) {
            console.log("error:", err);
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
        }
    }

    const login = (e) => {
        e.preventDefault();
        doSignIn();
    }

    return (
        <div className="login-body">
            <div className="login-box">
                <h2>Hospital Login</h2>

                <form onSubmit={login}>
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        onChange={(e) => setUsername(e.target.value)} />
                    <input
                        type="password"
                        placeholder="password"
                        required
                        onChange={(e) => setPassword(e.target.value)} />

                    <button type="submit">เข้าสู่ระบบ</button>
                </form>

                {error && <p className="error">{error}</p>}

                <div style={{ marginTop: '25px', textAlign: 'center' }}>
                    <Link 
                        href="/signup" 
                        style={{ color: '#00897b', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}
                    >
                        ยังไม่มีบัญชีผู้ป่วย? สมัครสมาชิกที่นี่
                    </Link>
                </div>
                
            </div>
        </div>
    );
}