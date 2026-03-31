"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("บันทึกข้อมูลเรียบร้อยแล้ว ✅");
    router.push("/thankyou");
  };

  return (
      <div className="my-reg-bg">
        <div className="my-reg-title">ระบบลงทะเบียน</div>

        <div className="my-reg-card">
          <form onSubmit={handleSubmit}>
            {/* ✅ STEP 1 */}
            {step === 1 && (
              <div>
                <div className="my-reg-step-header">1. ข้อมูล</div>

                <div className="my-reg-row">
                  <input type="text" className="my-reg-input" placeholder="ชื่อ" />
                  <input type="text" className="my-reg-input" placeholder="นามสกุล" />
                </div>

                <div className="my-reg-row">
                  <input type="text" className="my-reg-input" placeholder="อายุ" />
                  <input type="text" className="my-reg-input" defaultValue="ไทย" />
                </div>

                <div className="my-reg-row">
                  <input type="text" className="my-reg-input" placeholder="เลขบัตรประชาชน" />
                </div>

                <div className="my-reg-row">
                  <select className="my-reg-input" defaultValue="">
                    <option value="" disabled>เพศ</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                  <input type="text" className="my-reg-input" placeholder="น้ำหนัก (กก.)" />
                  <input type="text" className="my-reg-input" placeholder="ส่วนสูง (ซม.)" />
                </div>

                <button
                  type="button"
                  className="my-reg-btn"
                  onClick={() => setStep(2)}
                >
                  ถัดไป
                </button>
              </div>
            )}

            {/* ✅ STEP 2 */}
            {step === 2 && (
              <div>
                <div className="my-reg-step-header">2. ที่อยู่</div>

                <div className="my-reg-row">
                  <input type="text" className="my-reg-input" placeholder="บ้านเลขที่" />
                  <input type="text" className="my-reg-input" placeholder="หมู่บ้าน / อาคาร" />
                </div>

                <div className="my-reg-row">
                  <input type="text" className="my-reg-input" placeholder="หมู่" />
                  <input type="text" className="my-reg-input" placeholder="ซอย" />
                  <input type="text" className="my-reg-input" placeholder="ถนน" />
                </div>

                <div className="my-reg-row">
                  <select className="my-reg-input" defaultValue="">
                    <option value="" disabled>จังหวัด</option>
                  </select>
                  <select className="my-reg-input" defaultValue="">
                    <option value="" disabled>อำเภอ/เขต</option>
                  </select>
                  <select className="my-reg-input" defaultValue="">
                    <option value="" disabled>ตำบล/แขวง</option>
                  </select>
                </div>

                <div className="my-reg-row">
                  <input type="text" className="my-reg-input" placeholder="รหัสไปรษณีย์" />
                </div>

                {/* ปุ่มกดย้อนกลับและถัดไป (วางคู่กัน) */}
                <div className="my-reg-row" style={{ marginTop: '24px' }}>
                  <button
                    type="button"
                    className="my-reg-btn"
                    style={{ backgroundColor: '#9ca3af' }} /* เปลี่ยนสีปุ่มย้อนกลับให้เป็นสีเทา */
                    onClick={() => setStep(1)}
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    className="my-reg-btn"
                    onClick={() => setStep(3)}
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            )}

            {/* ✅ STEP 3 */}
            {step === 3 && (
              <div>
                <div className="my-reg-step-header">3. อาการเบื้องต้น</div>

                <div className="my-reg-row">
                  <textarea 
                    className="my-reg-input" 
                    placeholder="ระบุอาการเบื้องต้นของคุณที่นี่..." 
                    rows="5" /* กำหนดความสูงของกล่องข้อความ */
                    style={{ resize: 'vertical' }} /* ให้ผู้ใช้ลากขยายแนวตั้งได้ */
                  ></textarea>
                </div>

                {/* ปุ่มกดย้อนกลับและปุ่มเสร็จสิ้น */}
                <div className="my-reg-row" style={{ marginTop: '24px' }}>
                  <button
                    type="button"
                    className="my-reg-btn"
                    style={{ backgroundColor: '#9ca3af' }}
                    onClick={() => setStep(2)}
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="submit" /* ปุ่มนี้ต้องเป็น type="submit" เพื่อให้ฟอร์มทำงาน (วิ่งไปที่หน้า success) */
                    className="my-reg-btn"
                    style={{ backgroundColor: '#059669' }} /* สีเขียวเข้มขึ้นเพื่อเน้นว่าเป็นปุ่มยืนยันสุดท้าย */
                  >
                    เสร็จสิ้น
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
  );
}