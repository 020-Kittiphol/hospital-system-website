// server.js - Hospital Management System API
const express = require("express");
const cors    = require("cors");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const { initializeDatabase } = require("./db");

const app    = express();
const PORT   = process.env.PORT || 3001;
const SECRET = process.env.JWT_SECRET || "hospital-secret-key-2026";

// Initialize DB (runs once at startup)
const db = initializeDatabase();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());

// Auth middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
}

// ─── AUTH ROUTES ─────────────────────────────────────────────────────────────

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  const user = db.prepare("SELECT * FROM users WHERE username = ? AND is_active = 1").get(username);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, full_name: user.full_name },
    SECRET,
    { expiresIn: "8h" }
  );

  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// GET /api/auth/me
app.get("/api/auth/me", authenticate, (req, res) => {
  const user = db.prepare("SELECT id,username,full_name,email,phone,role,is_active,created_at FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

// ─── USERS ROUTES ─────────────────────────────────────────────────────────────

// GET /api/users
app.get("/api/users", authenticate, (req, res) => {
  const { role, search } = req.query;
  let sql = "SELECT id,username,full_name,email,phone,role,is_active,created_at FROM users WHERE 1=1";
  const params = [];
  if (role)   { sql += " AND role = ?";                        params.push(role); }
  if (search) { sql += " AND (full_name LIKE ? OR email LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
  sql += " ORDER BY created_at DESC";
  res.json(db.prepare(sql).all(...params));
});

// GET /api/users/:id
app.get("/api/users/:id", authenticate, (req, res) => {
  const user = db.prepare("SELECT id,username,full_name,email,phone,role,is_active,created_at FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// POST /api/users
app.post("/api/users", authenticate, requireAdmin, (req, res) => {
  const { username, password, full_name, email, phone, role } = req.body;
  if (!username || !password || !full_name || !email)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const result = db.prepare(`
      INSERT INTO users (username, password, full_name, email, phone, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(username, bcrypt.hashSync(password, 10), full_name, email, phone || null, role || "patient");

    const created = db.prepare("SELECT id,username,full_name,email,phone,role,is_active,created_at FROM users WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (e) {
    if (e.message.includes("UNIQUE")) return res.status(409).json({ error: "Username or email already exists" });
    throw e;
  }
});

// PUT /api/users/:id
app.put("/api/users/:id", authenticate, (req, res) => {
  // Non-admin can only edit their own record
  if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id))
    return res.status(403).json({ error: "Forbidden" });

  const { full_name, email, phone, role, is_active, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const newPass = password ? bcrypt.hashSync(password, 10) : user.password;
  const newRole = req.user.role === "admin" ? (role ?? user.role) : user.role;

  db.prepare(`
    UPDATE users SET full_name=?, email=?, phone=?, role=?, is_active=?, password=?, updated_at=datetime('now')
    WHERE id=?
  `).run(full_name ?? user.full_name, email ?? user.email, phone ?? user.phone,
         newRole, is_active ?? user.is_active, newPass, req.params.id);

  const updated = db.prepare("SELECT id,username,full_name,email,phone,role,is_active,created_at FROM users WHERE id = ?").get(req.params.id);
  res.json(updated);
});

// DELETE /api/users/:id
app.delete("/api/users/:id", authenticate, requireAdmin, (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  res.json({ message: "User deleted successfully" });
});

// ─── DEPARTMENTS ROUTES ───────────────────────────────────────────────────────

// GET /api/departments
app.get("/api/departments", authenticate, (req, res) => {
  const depts = db.prepare(`
    SELECT d.*, COUNT(doc.id) as doctor_count
    FROM departments d
    LEFT JOIN doctors doc ON doc.department_id = d.id AND doc.is_active = 1
    GROUP BY d.id
    ORDER BY d.name
  `).all();
  res.json(depts);
});

// GET /api/departments/:id
app.get("/api/departments/:id", authenticate, (req, res) => {
  const dept = db.prepare("SELECT * FROM departments WHERE id = ?").get(req.params.id);
  if (!dept) return res.status(404).json({ error: "Department not found" });
  res.json(dept);
});

// POST /api/departments
app.post("/api/departments", authenticate, requireAdmin, (req, res) => {
  const { name, description, floor, phone } = req.body;
  if (!name) return res.status(400).json({ error: "Department name is required" });

  try {
    const result = db.prepare(`
      INSERT INTO departments (name, description, floor, phone)
      VALUES (?, ?, ?, ?)
    `).run(name, description || null, floor || null, phone || null);

    res.status(201).json(db.prepare("SELECT * FROM departments WHERE id = ?").get(result.lastInsertRowid));
  } catch (e) {
    if (e.message.includes("UNIQUE")) return res.status(409).json({ error: "Department name already exists" });
    throw e;
  }
});

// PUT /api/departments/:id
app.put("/api/departments/:id", authenticate, requireAdmin, (req, res) => {
  const dept = db.prepare("SELECT * FROM departments WHERE id = ?").get(req.params.id);
  if (!dept) return res.status(404).json({ error: "Department not found" });
  const { name, description, floor, phone, is_active } = req.body;

  db.prepare(`
    UPDATE departments SET name=?, description=?, floor=?, phone=?, is_active=?, updated_at=datetime('now')
    WHERE id=?
  `).run(name ?? dept.name, description ?? dept.description, floor ?? dept.floor,
         phone ?? dept.phone, is_active ?? dept.is_active, req.params.id);

  res.json(db.prepare("SELECT * FROM departments WHERE id = ?").get(req.params.id));
});

// DELETE /api/departments/:id
app.delete("/api/departments/:id", authenticate, requireAdmin, (req, res) => {
  const dept = db.prepare("SELECT * FROM departments WHERE id = ?").get(req.params.id);
  if (!dept) return res.status(404).json({ error: "Department not found" });
  try {
    db.prepare("DELETE FROM departments WHERE id = ?").run(req.params.id);
    res.json({ message: "Department deleted successfully" });
  } catch (e) {
    res.status(409).json({ error: "Cannot delete: department has associated doctors" });
  }
});

// ─── DOCTORS ROUTES ───────────────────────────────────────────────────────────

// GET /api/doctors
app.get("/api/doctors", authenticate, (req, res) => {
  const { department_id, search } = req.query;
  let sql = `
    SELECT doc.*, d.name as department_name
    FROM doctors doc
    JOIN departments d ON d.id = doc.department_id
    WHERE 1=1
  `;
  const params = [];
  if (department_id) { sql += " AND doc.department_id = ?"; params.push(department_id); }
  if (search)        { sql += " AND (doc.full_name LIKE ? OR doc.specialty LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
  sql += " ORDER BY doc.full_name";
  res.json(db.prepare(sql).all(...params));
});

// GET /api/doctors/:id
app.get("/api/doctors/:id", authenticate, (req, res) => {
  const doc = db.prepare(`
    SELECT doc.*, d.name as department_name
    FROM doctors doc JOIN departments d ON d.id = doc.department_id
    WHERE doc.id = ?
  `).get(req.params.id);
  if (!doc) return res.status(404).json({ error: "Doctor not found" });
  res.json(doc);
});

// POST /api/doctors
app.post("/api/doctors", authenticate, requireAdmin, (req, res) => {
  const { department_id, full_name, specialty, license_number, email, phone, available_days, available_time } = req.body;
  if (!department_id || !full_name || !specialty || !license_number || !email)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const result = db.prepare(`
      INSERT INTO doctors (department_id, full_name, specialty, license_number, email, phone, available_days, available_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(department_id, full_name, specialty, license_number, email,
           phone || null, available_days || "Mon,Tue,Wed,Thu,Fri", available_time || "08:00-17:00");

    const created = db.prepare(`
      SELECT doc.*, d.name as department_name
      FROM doctors doc JOIN departments d ON d.id = doc.department_id
      WHERE doc.id = ?
    `).get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (e) {
    if (e.message.includes("UNIQUE")) return res.status(409).json({ error: "License number or email already exists" });
    throw e;
  }
});

// PUT /api/doctors/:id
app.put("/api/doctors/:id", authenticate, requireAdmin, (req, res) => {
  const doc = db.prepare("SELECT * FROM doctors WHERE id = ?").get(req.params.id);
  if (!doc) return res.status(404).json({ error: "Doctor not found" });
  const { department_id, full_name, specialty, license_number, email, phone, available_days, available_time, is_active } = req.body;

  db.prepare(`
    UPDATE doctors SET department_id=?, full_name=?, specialty=?, license_number=?, email=?,
    phone=?, available_days=?, available_time=?, is_active=?, updated_at=datetime('now')
    WHERE id=?
  `).run(department_id ?? doc.department_id, full_name ?? doc.full_name, specialty ?? doc.specialty,
         license_number ?? doc.license_number, email ?? doc.email, phone ?? doc.phone,
         available_days ?? doc.available_days, available_time ?? doc.available_time,
         is_active ?? doc.is_active, req.params.id);

  res.json(db.prepare(`
    SELECT doc.*, d.name as department_name
    FROM doctors doc JOIN departments d ON d.id = doc.department_id
    WHERE doc.id = ?
  `).get(req.params.id));
});

// DELETE /api/doctors/:id
app.delete("/api/doctors/:id", authenticate, requireAdmin, (req, res) => {
  const doc = db.prepare("SELECT * FROM doctors WHERE id = ?").get(req.params.id);
  if (!doc) return res.status(404).json({ error: "Doctor not found" });
  db.prepare("DELETE FROM doctors WHERE id = ?").run(req.params.id);
  res.json({ message: "Doctor deleted successfully" });
});

// ─── APPOINTMENTS ROUTES ──────────────────────────────────────────────────────

// GET /api/appointments
app.get("/api/appointments", authenticate, (req, res) => {
  const { status, doctor_id, patient_id, date } = req.query;
  let sql = `
    SELECT a.*,
           u.full_name  as patient_name,
           u.phone      as patient_phone,
           doc.full_name as doctor_name,
           doc.specialty,
           dept.name    as department_name
    FROM appointments a
    JOIN users       u    ON u.id   = a.patient_id
    JOIN doctors     doc  ON doc.id = a.doctor_id
    JOIN departments dept ON dept.id = a.department_id
    WHERE 1=1
  `;
  const params = [];

  // Patients see only their own appointments
  if (req.user.role === "patient") {
    sql += " AND a.patient_id = ?"; params.push(req.user.id);
  } else {
    if (patient_id) { sql += " AND a.patient_id = ?";    params.push(patient_id); }
    if (doctor_id)  { sql += " AND a.doctor_id = ?";     params.push(doctor_id); }
  }
  if (status) { sql += " AND a.status = ?"; params.push(status); }
  if (date)   { sql += " AND a.appt_date = ?"; params.push(date); }
  sql += " ORDER BY a.appt_date DESC, a.appt_time DESC";

  res.json(db.prepare(sql).all(...params));
});

// GET /api/appointments/:id
app.get("/api/appointments/:id", authenticate, (req, res) => {
  const appt = db.prepare(`
    SELECT a.*,
           u.full_name as patient_name, u.email as patient_email, u.phone as patient_phone,
           doc.full_name as doctor_name, doc.specialty,
           dept.name as department_name
    FROM appointments a
    JOIN users u       ON u.id   = a.patient_id
    JOIN doctors doc   ON doc.id = a.doctor_id
    JOIN departments dept ON dept.id = a.department_id
    WHERE a.id = ?
  `).get(req.params.id);
  if (!appt) return res.status(404).json({ error: "Appointment not found" });
  // Patient can only see their own
  if (req.user.role === "patient" && appt.patient_id !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });
  res.json(appt);
});

// POST /api/appointments
app.post("/api/appointments", authenticate, (req, res) => {
  const { patient_id, doctor_id, department_id, appt_date, appt_time, reason } = req.body;
  if (!doctor_id || !department_id || !appt_date || !appt_time)
    return res.status(400).json({ error: "Missing required fields" });

  // Patients book for themselves; admin/receptionist can specify patient
  const pid = req.user.role === "patient" ? req.user.id : (patient_id || req.user.id);

  // Check for time conflict
  const conflict = db.prepare(`
    SELECT id FROM appointments
    WHERE doctor_id=? AND appt_date=? AND appt_time=? AND status NOT IN ('cancelled')
  `).get(doctor_id, appt_date, appt_time);
  if (conflict) return res.status(409).json({ error: "Doctor already has an appointment at this time" });

  const result = db.prepare(`
    INSERT INTO appointments (patient_id, doctor_id, department_id, appt_date, appt_time, reason, status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
  `).run(pid, doctor_id, department_id, appt_date, appt_time, reason || null);

  const created = db.prepare(`
    SELECT a.*, u.full_name as patient_name, doc.full_name as doctor_name, dept.name as department_name
    FROM appointments a
    JOIN users u ON u.id = a.patient_id
    JOIN doctors doc ON doc.id = a.doctor_id
    JOIN departments dept ON dept.id = a.department_id
    WHERE a.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/appointments/:id
app.put("/api/appointments/:id", authenticate, (req, res) => {
  const appt = db.prepare("SELECT * FROM appointments WHERE id = ?").get(req.params.id);
  if (!appt) return res.status(404).json({ error: "Appointment not found" });

  // Patients can only cancel their own; staff can update status/notes
  if (req.user.role === "patient") {
    if (appt.patient_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });
    if (req.body.status && req.body.status !== "cancelled")
      return res.status(403).json({ error: "Patients can only cancel appointments" });
  }

  const { appt_date, appt_time, reason, status, notes } = req.body;
  db.prepare(`
    UPDATE appointments SET appt_date=?, appt_time=?, reason=?, status=?, notes=?, updated_at=datetime('now')
    WHERE id=?
  `).run(appt_date ?? appt.appt_date, appt_time ?? appt.appt_time, reason ?? appt.reason,
         status ?? appt.status, notes ?? appt.notes, req.params.id);

  res.json(db.prepare(`
    SELECT a.*, u.full_name as patient_name, doc.full_name as doctor_name, dept.name as department_name
    FROM appointments a
    JOIN users u ON u.id = a.patient_id
    JOIN doctors doc ON doc.id = a.doctor_id
    JOIN departments dept ON dept.id = a.department_id
    WHERE a.id = ?
  `).get(req.params.id));
});

// DELETE /api/appointments/:id
app.delete("/api/appointments/:id", authenticate, requireAdmin, (req, res) => {
  const appt = db.prepare("SELECT * FROM appointments WHERE id = ?").get(req.params.id);
  if (!appt) return res.status(404).json({ error: "Appointment not found" });
  db.prepare("DELETE FROM appointments WHERE id = ?").run(req.params.id);
  res.json({ message: "Appointment deleted successfully" });
});

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
app.get("/api/stats", authenticate, (req, res) => {
  res.json({
    users:        db.prepare("SELECT COUNT(*) as c FROM users WHERE is_active=1").get().c,
    doctors:      db.prepare("SELECT COUNT(*) as c FROM doctors WHERE is_active=1").get().c,
    departments:  db.prepare("SELECT COUNT(*) as c FROM departments WHERE is_active=1").get().c,
    appointments: db.prepare("SELECT COUNT(*) as c FROM appointments").get().c,
    pending:      db.prepare("SELECT COUNT(*) as c FROM appointments WHERE status='pending'").get().c,
    confirmed:    db.prepare("SELECT COUNT(*) as c FROM appointments WHERE status='confirmed'").get().c,
    completed:    db.prepare("SELECT COUNT(*) as c FROM appointments WHERE status='completed'").get().c,
    todayAppts:   db.prepare("SELECT COUNT(*) as c FROM appointments WHERE appt_date=date('now')").get().c,
  });
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🏥 Hospital API running on http://localhost:${PORT}`);
  console.log(`   Default admin login: admin / admin123`);
});
