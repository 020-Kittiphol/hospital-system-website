"use client";
import { useState } from "react";

import styles from './style.module.css'; 

export default function DeleteDoctorPage() {
  const [id, setId] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!id) {
      alert("กรุณาใส่ ID ของหมอที่ต้องการลบ");
      return;
    }

    try {
      const res = await fetch(`/api/doctors/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("ลบข้อมูลหมอสำเร็จเรียบร้อย!");
        setId("");
      } else {
        const data = await res.json();
        alert(`ผิดพลาด: ${data.error || "ไม่พบข้อมูล"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("ระบบมีปัญหา ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
   
    <div className={styles.container}>
      <h1 className={styles.title}>ลบข้อมูลหมอ</h1>
      <form onSubmit={handleDelete} className={styles.form}>
        <input
          type="text"
          placeholder="ใส่ ID ของหมอ"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.btn}>
          ลบข้อมูล
        </button>
      </form>
    </div>
  );
}
