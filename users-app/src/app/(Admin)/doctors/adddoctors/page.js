"use client";

import { useState } from "react";
import styles from './style.module.css';
import { useRouter } from "next/navigation";

export default function AddDoctorPage() {
  const [doctorName, setDoctorName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (!doctorName.trim()) {
      alert("กรุณากรอกชื่อ-นามสกุลแพทย์");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/doctors', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          doctor_name: doctorName, 
          department_id: departmentId || null 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("เพิ่มข้อมูลแพทย์สำเร็จ!");
        setDoctorName("");
        setDepartmentId("");
      } else {
        alert("เกิดข้อผิดพลาด: " + (data.error || "ไม่สามารถเพิ่มข้อมูลได้"));
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>เพิ่มข้อมูลแพทย์ใหม่</h2>
      
      <form onSubmit={handleAdd}>
        <div className={styles.formGroup}>
          <label className={styles.label}>ชื่อ-นามสกุลแพทย์:</label>
          <input 
            type="text" 
            className={styles.input} 
            value={doctorName} 
            onChange={(e) => setDoctorName(e.target.value)} 
            placeholder="ตัวอย่าง: สมชาย ใจดี"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>รหัสแผนก (Department ID):</label>
          <input 
            type="number" 
            className={styles.input} 
            value={departmentId} 
            onChange={(e) => setDepartmentId(e.target.value)} 
            placeholder="ระบุตัวเลขรหัสแผนก"
          />
        </div>

        <div className={styles.buttonGroup}>
          <button 
            type="submit" 
            className={styles.btnSubmit}
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "ตกลง"}
          </button>
          
          <button 
            type="button" 
            className={styles.btnCancel} 
            onClick={() => router.back()}
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}