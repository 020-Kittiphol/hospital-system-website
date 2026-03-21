"use client"

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        setFirstName(localStorage.getItem("first_name") || "");
    }, []);

    const onSignOut = () => {
        localStorage.setItem("access_token", "notoken");
        router.push("/signin");
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-primary px-3">
                <span className="navbar-brand">Hospital System</span>
                <div className="d-flex align-items-center gap-3">
                    <span className="text-white">สวัสดี, {firstName}</span>
                    <button className="btn btn-outline-light btn-sm" onClick={onSignOut}>
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Content */}
            <div className="container mt-4">
                <h4>Admin Dashboard</h4>
                <div className="row mt-3">
                    <div className="col-md-4">
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-body">
                                <h5 className="card-title">จัดการผู้ใช้</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-white bg-success mb-3">
                            <div className="card-body">
                                <h5 className="card-title">จัดการแพทย์</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-white bg-warning mb-3">
                            <div className="card-body">
                                <h5 className="card-title">จัดการนัดหมาย</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}