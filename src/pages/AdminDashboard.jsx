import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, income: 0 });

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/admin/stats')
      .then(res => res.json())
      .then(data => {
          console.log("Stats Data:", data); 
          setStats({
            users: data.users || 0,
            orders: data.orders || 0,
            income: data.income || 0
          });
      })
      .catch(err => console.error(err));
  }, []);

  const cardStyle = {
    background: 'white', padding: '30px', borderRadius: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', cursor: 'pointer'
  };

  return (
    <AdminLayout title="Dashboard Overview">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
        
        {/* Card Users */}
        <div style={{...cardStyle, borderLeft: '5px solid #007bff'}}>
          <div>
            <p style={{ margin: 0, color: '#888' }}>Total Pengguna</p>
            <h2 style={{ margin: '10px 0 0', fontSize: '2.5rem', color: '#051e3e' }}>{stats.users}</h2>
          </div>
          <div style={{ background: '#e3f2fd', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>👥</div>
        </div>

        {/* Card Orders */}
        <div style={{...cardStyle, borderLeft: '5px solid #ffc107'}}>
          <div>
            <p style={{ margin: 0, color: '#888' }}>Pesanan Masuk</p>
            <h2 style={{ margin: '10px 0 0', fontSize: '2.5rem', color: '#051e3e' }}>{stats.orders}</h2>
          </div>
          <div style={{ background: '#fff3cd', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>📦</div>
        </div>

        {/* Card Income */}
        <div style={{...cardStyle, borderLeft: '5px solid #28a745'}}>
          <div>
            <p style={{ margin: 0, color: '#888' }}>Total Pendapatan</p>
            <h2 style={{ margin: '10px 0 0', fontSize: '2.5rem', color: '#28a745' }}>
              Rp {parseInt(stats.income).toLocaleString('id-ID')}
            </h2>
          </div>
          <div style={{ background: '#d4edda', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>💰</div>
        </div>

      </div>

      <div style={{ marginTop: '40px', padding: '30px', background: 'white', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h3 style={{ color: '#051e3e', margin: 0 }}>Selamat Datang di Panel Admin! 🚀</h3>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;