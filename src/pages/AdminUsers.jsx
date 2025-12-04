import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <AdminLayout title="Data Pengguna Terdaftar">
      <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left', color: '#051e3e', fontSize: '0.95rem' }}>
                <th style={{ padding: '15px' }}>ID</th>
                <th style={{ padding: '15px' }}>Nama Lengkap</th>
                <th style={{ padding: '15px' }}>Email</th>
                <th style={{ padding: '15px' }}>Bergabung Sejak</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f9f9f9', background: index % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: '15px', color: '#888' }}>#{u.id}</td>
                <td style={{ padding: '15px', fontWeight: '600', color: '#333' }}>{u.nama}</td>
                <td style={{ padding: '15px', color: '#007bff' }}>{u.email}</td>
                <td style={{ padding: '15px', color: '#666' }}>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
export default AdminUsers;