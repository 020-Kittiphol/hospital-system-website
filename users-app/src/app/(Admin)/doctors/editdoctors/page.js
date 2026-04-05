"use client";

import { useState } from "react";
import styles from './style.module.css';

export default function EditDoctorPage() {
  const [id, setId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!id || !doctorName) {
      alert("กรุณาระบุรหัสแพทย์และชื่อ-นามสกุล");
      return;
    }

    try {
const res = await fetch(`/api/doctors/${id}`, {
          method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          doctor_name: doctorName, 
          department_id: departmentId 
        }),
      });

      if (res.ok) {
        alert("บันทึกข้อมูลแพทย์สำเร็จ!");
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก: โปรดตรวจสอบรหัสแพทย์");
      }
    } catch (error) {
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>ระบบนัดแพทย์โรงพยาบาล</h2>
        <button className={styles.signOutBtn}>Sign out</button>
      </header>

      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarItem}>แก้ไขข้อมูลแพทย์</div>
        </aside>

        <main className={styles.formArea}>
          <div className={styles.card}>
            <h2 className={styles.formTitle}>แก้ไขข้อมูลแพทย์</h2>
            <form onSubmit={handleUpdate}>
              <div className={styles.formGroup}>
                <label className={styles.label}>รหัสแพทย์ (ID):</label>
                <input type="text" className={styles.input} value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>ชื่อ-นามสกุล:</label>
                <input type="text" className={styles.input} value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>รหัสแผนก:</label>
                <input type="text" className={styles.input} value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} />
              </div>
              {/* ลบช่องเบอร์โทรศัพท์ออกแล้ว */}
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.btnSubmit}>ตกลง</button>
                <button type="button" className={styles.btnCancel} onClick={() => window.history.back()}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
