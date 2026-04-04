console.log("JS ทำงานแล้ว");

// โหลดข้อมูลจาก backend
fetch("http://localhost:3000/appointments")
.then(res => res.json())
.then(data => {

    let table = document.getElementById("AppointmentTableBody");
    table.innerHTML = "";

    data.forEach(item => {
        table.innerHTML += `
        <tr>
            <td>${item.patient_name}</td>
            <td>${item.doctor_name}</td>
            <td>${item.department}</td>
            <td>${item.date}</td>
            <td>${item.time}</td>
            <td>
                <button onclick="edit(${item.id})">แก้ไข</button>
                <button onclick="cancel(${item.id})">ยกเลิก</button>
            </td>
        </tr>`;
    });

});

// ไปหน้าแก้ไข
function edit(id){
    window.location.href = "appointment_edit.html?id=" + id;
}

// ไปหน้า cancel
function cancel(id){
    window.location.href = "appointment_cancel.html?id=" + id;
}