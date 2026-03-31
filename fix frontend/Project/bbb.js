console.log("JS ทำงานแล้ว");

let data = [];
let editIndex = null;

const modal = document.getElementById("modal");
const tableBody = document.getElementById("tableBody");

// โหลดข้อมูล
window.onload = () => {
    const saved = localStorage.getItem("appointments");
    if (saved) {
        data = JSON.parse(saved);
        renderTable();
    }
};

// เปิด modal
function openModal() {
    modal.style.display = "flex";
    document.getElementById("date").value = "";
    document.getElementById("name").value = "";
    editIndex = null;
}

// ปิด modal
function closeModal() {
    modal.style.display = "none";
}

// บันทึก
function saveData() {
    const date = document.getElementById("date").value;
    const name = document.getElementById("name").value;

    if (!date || !name) {
        alert("กรอกข้อมูลให้ครบ");
        return;
    }

    if (editIndex === null) {
        data.push({ date, name });
    } else {
        data[editIndex] = { date, name };
    }

    localStorage.setItem("appointments", JSON.stringify(data));
    renderTable();
    closeModal();
}

// แสดงตาราง
function renderTable() {
    tableBody.innerHTML = "";

    data.forEach((item, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${formatDate(item.date)}</td>
                <td>${item.name}</td>
                <td>
                    <button class="btn-edit" onclick="editData(${index})">แก้ไข</button>
                    <button class="btn-delete" onclick="deleteData(${index})">ลบ</button>
                </td>
            </tr>
        `;
    });
}

// แก้ไข
function editData(index) {
    const item = data[index];
    document.getElementById("date").value = item.date;
    document.getElementById("name").value = item.name;
    editIndex = index;
    modal.style.display = "flex";
}

// ลบ
function deleteData(index) {
    if (confirm("ต้องการลบหรือไม่?")) {
        data.splice(index, 1);
        localStorage.setItem("appointments", JSON.stringify(data));
        renderTable();
    }
}

// ฟอร์แมตวัน
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString("th-TH");
}