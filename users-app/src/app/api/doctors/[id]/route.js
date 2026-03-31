import { NextResponse } from 'next/server';
const pool = require('../../../models/db_pool');

export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
    try {
        const id = params.id;

        const [result] = await pool.query('DELETE FROM doctors WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "ไม่พบข้อมูลแพทย์ที่ต้องการลบ" }, { status: 404 });
        }

        return NextResponse.json({ message: "ลบข้อมูลแพทย์สำเร็จ" });
        
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDoctors = async () => {
        try {
            const response = await fetch('/api/doctors');
            const data = await response.json();
            setDoctors(data);
        } catch (error) {
            console.error("ดึงข้อมูลไม่สำเร็จ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleDelete = async (id, name) => {
        const isConfirm = window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ "นพ./พญ. ${name}"?`);
        
        if (isConfirm) {
            try {
                const response = await fetch(`/api/doctors/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert("ลบข้อมูลสำเร็จแล้ว ✅");
                    fetchDoctors();
                } else {
                    alert("เกิดข้อผิดพลาดในการลบข้อมูล");
                }
            } catch (error) {
                console.error("Delete Error:", error);
                alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
            }
        }
    };

    return (
        <table className="beautiful-table">
            <thead>
                <tr>
                    <th>ชื่อหมอ</th>
                    <th>รหัสเเผนก</th>
                    <th>เบอร์โทร</th>
                    <th>จัดการ</th>
                </tr>
            </thead>
            <tbody>
                {!isLoading && doctors.map((doc) => (
                    <tr key={doc.id}>
                        <td>{doc.first_name} {doc.last_name}</td>
                        <td>{doc.department_id}</td>
                        <td>{doc.phone}</td>
                        <td>
                            <button 
                                onClick={() => handleDelete(doc.id, doc.first_name)}
                                className="btn-modern btn-red"
                                style={{ padding: '5px 12px', fontSize: '12px' }}
                            >
                                ลบ
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}