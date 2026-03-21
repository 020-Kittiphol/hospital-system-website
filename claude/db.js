// db.js - Database initialization with SQLite
const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "hospital.db");

function initializeDatabase() {
  const db = new Database(DB_PATH);

  // Enable WAL mode for better performance
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // ─── Create Tables ────────────────────────────────────────────────────────

  db.exec(`
    -- Users table (admin, receptionist, patient)
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT    NOT NULL UNIQUE,
      password    TEXT    NOT NULL,
      full_name   TEXT    NOT NULL,
      email       TEXT    NOT NULL UNIQUE,
      phone       TEXT,
      role        TEXT    NOT NULL DEFAULT 'patient'
                          CHECK(role IN ('admin','receptionist','patient')),
      is_active   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Departments table
    CREATE TABLE IF NOT EXISTS departments (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL UNIQUE,
      description TEXT,
      floor       TEXT,
      phone       TEXT,
      is_active   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Doctors table
    CREATE TABLE IF NOT EXISTS doctors (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      department_id   INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
      full_name       TEXT    NOT NULL,
      specialty       TEXT    NOT NULL,
      license_number  TEXT    NOT NULL UNIQUE,
      email           TEXT    NOT NULL UNIQUE,
      phone           TEXT,
      available_days  TEXT    NOT NULL DEFAULT 'Mon,Tue,Wed,Thu,Fri',
      available_time  TEXT    NOT NULL DEFAULT '08:00-17:00',
      is_active       INTEGER NOT NULL DEFAULT 1,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Appointments table
    CREATE TABLE IF NOT EXISTS appointments (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      doctor_id     INTEGER NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
      department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
      appt_date     TEXT    NOT NULL,
      appt_time     TEXT    NOT NULL,
      reason        TEXT,
      status        TEXT    NOT NULL DEFAULT 'pending'
                            CHECK(status IN ('pending','confirmed','completed','cancelled')),
      notes         TEXT,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // ─── Seed Data ────────────────────────────────────────────────────────────
  const bcrypt = require("bcryptjs");

  const userCount = db.prepare("SELECT COUNT(*) as c FROM users").get().c;
  if (userCount === 0) {
    const hash = (p) => bcrypt.hashSync(p, 10);

    // Seed users
    const insertUser = db.prepare(`
      INSERT INTO users (username, password, full_name, email, phone, role)
      VALUES (@username, @password, @full_name, @email, @phone, @role)
    `);
    insertUser.run({ username: "admin",       password: hash("admin123"),   full_name: "System Admin",      email: "admin@hospital.com",      phone: "02-000-0001", role: "admin" });
    insertUser.run({ username: "receptionist",password: hash("recep123"),   full_name: "สมศรี มีใจดี",       email: "recep@hospital.com",       phone: "02-000-0002", role: "receptionist" });
    insertUser.run({ username: "patient01",   password: hash("patient123"), full_name: "นายสมชาย ใจดี",      email: "somchai@email.com",        phone: "081-234-5678", role: "patient" });
    insertUser.run({ username: "patient02",   password: hash("patient123"), full_name: "นางสาวมาลี รักสวย",  email: "malee@email.com",          phone: "082-345-6789", role: "patient" });

    // Seed departments
    const insertDept = db.prepare(`
      INSERT INTO departments (name, description, floor, phone)
      VALUES (@name, @description, @floor, @phone)
    `);
    insertDept.run({ name: "อายุรกรรม",     description: "ตรวจรักษาโรคทั่วไปและโรคภายใน",     floor: "ชั้น 1", phone: "02-111-1001" });
    insertDept.run({ name: "ศัลยกรรม",      description: "การผ่าตัดและบาดแผลต่างๆ",             floor: "ชั้น 2", phone: "02-111-1002" });
    insertDept.run({ name: "กุมารเวชกรรม",  description: "รักษาเด็กและทารก",                   floor: "ชั้น 2", phone: "02-111-1003" });
    insertDept.run({ name: "สูตินรีเวช",    description: "ดูแลสุขภาพสตรีและการตั้งครรภ์",       floor: "ชั้น 3", phone: "02-111-1004" });
    insertDept.run({ name: "จักษุวิทยา",    description: "ตรวจรักษาโรคตา",                     floor: "ชั้น 1", phone: "02-111-1005" });
    insertDept.run({ name: "ออร์โธปิดิกส์", description: "รักษาโรคกระดูกและข้อ",               floor: "ชั้น 3", phone: "02-111-1006" });

    // Seed doctors
    const insertDoc = db.prepare(`
      INSERT INTO doctors (department_id, full_name, specialty, license_number, email, phone, available_days, available_time)
      VALUES (@department_id, @full_name, @specialty, @license_number, @email, @phone, @available_days, @available_time)
    `);
    insertDoc.run({ department_id: 1, full_name: "นพ.วิชัย สุขภาพดี",     specialty: "อายุรกรรมทั่วไป",   license_number: "ว.12345", email: "dr.vichai@hospital.com",   phone: "081-001-0001", available_days: "Mon,Tue,Wed,Thu,Fri", available_time: "08:00-16:00" });
    insertDoc.run({ department_id: 1, full_name: "พญ.สุนีย์ รักษาดี",     specialty: "โรคหัวใจ",          license_number: "ว.12346", email: "dr.sunee@hospital.com",    phone: "081-001-0002", available_days: "Mon,Wed,Fri",         available_time: "09:00-17:00" });
    insertDoc.run({ department_id: 2, full_name: "นพ.ประสิทธิ์ มือดี",   specialty: "ศัลยกรรมทั่วไป",   license_number: "ว.22345", email: "dr.prasit@hospital.com",   phone: "081-002-0001", available_days: "Tue,Thu,Sat",         available_time: "08:00-15:00" });
    insertDoc.run({ department_id: 3, full_name: "พญ.อรุณี เด็กรัก",     specialty: "กุมารเวชศาสตร์",    license_number: "ว.32345", email: "dr.arunee@hospital.com",   phone: "081-003-0001", available_days: "Mon,Tue,Wed,Thu,Fri", available_time: "08:00-16:00" });
    insertDoc.run({ department_id: 4, full_name: "พญ.กมลา แม่และเด็ก",  specialty: "สูตินรีเวชศาสตร์",   license_number: "ว.42345", email: "dr.kamala@hospital.com",   phone: "081-004-0001", available_days: "Mon,Wed,Fri",         available_time: "09:00-17:00" });
    insertDoc.run({ department_id: 6, full_name: "นพ.ธนากร กระดูกแกร่ง", specialty: "ออร์โธปิดิกส์",     license_number: "ว.62345", email: "dr.thanakorn@hospital.com", phone: "081-006-0001", available_days: "Tue,Thu",             available_time: "10:00-18:00" });

    // Seed appointments
    const insertAppt = db.prepare(`
      INSERT INTO appointments (patient_id, doctor_id, department_id, appt_date, appt_time, reason, status)
      VALUES (@patient_id, @doctor_id, @department_id, @appt_date, @appt_time, @reason, @status)
    `);
    insertAppt.run({ patient_id: 3, doctor_id: 1, department_id: 1, appt_date: "2026-03-12", appt_time: "09:00", reason: "ตรวจสุขภาพประจำปี",  status: "confirmed" });
    insertAppt.run({ patient_id: 4, doctor_id: 4, department_id: 3, appt_date: "2026-03-13", appt_time: "10:30", reason: "เด็กมีไข้สูง",         status: "pending" });
    insertAppt.run({ patient_id: 3, doctor_id: 2, department_id: 1, appt_date: "2026-03-10", appt_time: "14:00", reason: "ปวดหัวใจ เหนื่อยง่าย", status: "completed" });
    insertAppt.run({ patient_id: 4, doctor_id: 5, department_id: 4, appt_date: "2026-03-15", appt_time: "09:30", reason: "ฝากครรภ์",             status: "confirmed" });

    console.log("✅ Database seeded successfully");
  }

  return db;
}

module.exports = { initializeDatabase };
