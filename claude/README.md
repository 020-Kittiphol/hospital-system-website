# 🏥 Hospital Management System

ระบบบริหารจัดการโรงพยาบาล — Full Stack Mini Project

## 📁 โครงสร้างโปรเจค

```
hospital-system/
├── backend/
│   ├── package.json     # dependencies
│   ├── server.js        # Express API + Routes ทั้งหมด
│   └── db.js            # SQLite schema + seed data
└── frontend/
    └── index.html       # Single-page app (HTML + CSS + JS)
```

## 🛠️ Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Node.js, Express.js                 |
| Database | SQLite (ผ่าน better-sqlite3)        |
| Auth     | JWT + bcryptjs                      |
| Frontend | Vanilla HTML / CSS / JavaScript     |

---

## 🚀 วิธีติดตั้งและรัน

### 1. ติดตั้ง Backend

```bash
cd hospital-system/backend
npm install
npm start
# Server จะรันที่ http://localhost:3001
```

### 2. เปิด Frontend

เปิดไฟล์ `frontend/index.html` ด้วย Browser โดยตรง  
หรือใช้ Live Server extension ใน VS Code

---

## 🔑 Default Login Accounts

| Username      | Password     | Role          |
|---------------|--------------|---------------|
| admin         | admin123     | Admin         |
| receptionist  | recep123     | Receptionist  |
| patient01     | patient123   | Patient       |
| patient02     | patient123   | Patient       |

---

## 📡 API Endpoints

### Auth
| Method | Path            | Description        |
|--------|-----------------|--------------------|
| POST   | /api/auth/login | เข้าสู่ระบบ         |
| GET    | /api/auth/me    | ดูข้อมูลตัวเอง      |

### Users
| Method | Path            | Access        | Description         |
|--------|-----------------|---------------|---------------------|
| GET    | /api/users      | All (auth)    | ดูรายชื่อผู้ใช้     |
| GET    | /api/users/:id  | All (auth)    | ดูผู้ใช้รายคน       |
| POST   | /api/users      | Admin only    | เพิ่มผู้ใช้ใหม่     |
| PUT    | /api/users/:id  | Admin/Self    | แก้ไขข้อมูลผู้ใช้   |
| DELETE | /api/users/:id  | Admin only    | ลบผู้ใช้            |

### Departments
| Method | Path                  | Access     | Description    |
|--------|-----------------------|------------|----------------|
| GET    | /api/departments      | All (auth) | ดูแผนกทั้งหมด  |
| GET    | /api/departments/:id  | All (auth) | ดูแผนกรายเดียว |
| POST   | /api/departments      | Admin only | เพิ่มแผนก       |
| PUT    | /api/departments/:id  | Admin only | แก้ไขแผนก       |
| DELETE | /api/departments/:id  | Admin only | ลบแผนก          |

### Doctors
| Method | Path             | Access     | Description      |
|--------|------------------|------------|------------------|
| GET    | /api/doctors     | All (auth) | ดูแพทย์ทั้งหมด   |
| GET    | /api/doctors/:id | All (auth) | ดูแพทย์รายคน     |
| POST   | /api/doctors     | Admin only | เพิ่มแพทย์        |
| PUT    | /api/doctors/:id | Admin only | แก้ไขข้อมูลแพทย์  |
| DELETE | /api/doctors/:id | Admin only | ลบแพทย์           |

### Appointments
| Method | Path                   | Access       | Description             |
|--------|------------------------|--------------|-------------------------|
| GET    | /api/appointments      | Auth (scope) | ดูการนัดหมาย            |
| GET    | /api/appointments/:id  | Auth (scope) | ดูนัดรายการ             |
| POST   | /api/appointments      | All (auth)   | สร้างนัดหมายใหม่         |
| PUT    | /api/appointments/:id  | Auth (scope) | แก้ไข/เปลี่ยนสถานะนัด   |
| DELETE | /api/appointments/:id  | Admin only   | ลบนัดหมาย               |

### Dashboard
| Method | Path       | Description    |
|--------|------------|----------------|
| GET    | /api/stats | สถิติรวม        |

---

## 🔒 Role-based Access Control

- **Admin** — เข้าถึงได้ทุกอย่าง
- **Receptionist** — ดู/แก้ไขนัดหมาย, ดูผู้ใช้, ดูแพทย์/แผนก
- **Patient** — เห็นเฉพาะนัดหมายของตัวเอง, สร้างนัดใหม่, ยกเลิกนัดตัวเอง

---

## 🗄️ Database Schema

```sql
users          -- ผู้ใช้งาน (admin / receptionist / patient)
departments    -- แผนกต่างๆ ในโรงพยาบาล
doctors        -- ข้อมูลแพทย์ (FK → departments)
appointments   -- การนัดหมาย (FK → users, doctors, departments)
```

---

## 💡 ฟีเจอร์หลัก

- ✅ JWT Authentication + Role-based access
- ✅ CRUD ครบทุกระบบ (Users, Departments, Doctors, Appointments)
- ✅ ตรวจสอบเวลานัดซ้อน (conflict detection)
- ✅ Filter & Search ในทุกหน้า
- ✅ Dashboard สถิติรวม
- ✅ SQLite database พร้อม seed data
- ✅ Toast notifications
- ✅ Confirm before delete
- ✅ Responsive UI
