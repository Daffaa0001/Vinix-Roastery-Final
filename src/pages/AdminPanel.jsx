import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const formatRupiah = (angka) => "Rp " + parseInt(angka).toLocaleString('id-ID');

  // Ambil Data dari Route No. 7 di Python
  const fetchAllOrders = () => {
    fetch('http://127.0.0.1:5000/api/admin/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    // Cek Login & Role Admin
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(loggedInUser);
    if (user.role !== 'admin') {
      Swal.fire('Akses Ditolak', 'Halaman ini khusus Admin!', 'error');
      navigate('/');
      return;
    }

    fetchAllOrders();
  }, []);

  // Update Status (Terima/Tolak)
  const updateStatus = async (orderId, newStatus) => {
    const response = await fetch('http://127.0.0.1:5000/api/admin/order_status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, status: newStatus })
    });

    if (response.ok) {
      Swal.fire('Sukses', `Status diubah menjadi ${newStatus.toUpperCase()}`, 'success');
      fetchAllOrders();
    } else {
      Swal.fire('Gagal', 'Server error', 'error');
    }
  };

  // Lihat Foto Bukti
  const lihatBukti = (filename) => {
    if (!filename) {
      Swal.fire('Info', 'User belum upload bukti transfer', 'info');
      return;
    }
    // Mengakses Route No. 9 di Python
    Swal.fire({
      title: 'Bukti Transfer',
      imageUrl: `http://127.0.0.1:5000/uploads/${filename}`,
      imageAlt: 'Bukti Transfer',
      imageWidth: 400,
      confirmButtonColor: '#051e3e'
    });
  };

  return (
    <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
      <h2 className="section-title">Dashboard Admin</h2>
      <p className="section-subtitle">Kelola pesanan masuk</p>

      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
          <thead style={{background: '#051e3e', color: 'white'}}>
            <tr>
              <th style={{padding: '15px'}}>ID</th>
              <th style={{padding: '15px'}}>Pembeli</th>
              <th style={{padding: '15px'}}>Produk</th>
              <th style={{padding: '15px'}}>Total</th>
              <th style={{padding: '15px'}}>Status</th>
              <th style={{padding: '15px'}}>Bukti</th>
              <th style={{padding: '15px'}}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{borderBottom: '1px solid #eee', textAlign: 'center'}}>
                <td style={{padding: '15px'}}>#{order.id}</td>
                <td style={{padding: '15px', fontWeight: 'bold'}}>{order.nama_pembeli}</td>
                <td style={{padding: '15px'}}>{order.nama_produk} ({order.jumlah}x)</td>
                <td style={{padding: '15px', color: '#051e3e', fontWeight: 'bold'}}>{formatRupiah(order.total_harga)}</td>
                
                <td style={{padding: '15px'}}>
                  <span style={{
                      padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                      background: order.status === 'pending' ? '#fff3cd' : 
                                  order.status === 'menunggu_verifikasi' ? '#cce5ff' : 
                                  order.status === 'lunas' ? '#d4edda' : '#f8d7da',
                      color: order.status === 'pending' ? '#856404' : 
                             order.status === 'menunggu_verifikasi' ? '#004085' : 
                             order.status === 'lunas' ? '#155724' : '#721c24'
                  }}>
                    {order.status.toUpperCase()}
                  </span>
                </td>

                <td style={{padding: '15px'}}>
                  <button onClick={() => lihatBukti(order.bukti_bayar)} style={{border:'1px solid #ccc', background:'white', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}>
                    📷 Lihat
                  </button>
                </td>

                <td style={{padding: '15px'}}>
                  {/* Tombol Aksi hanya muncul jika MENUNGGU VERIFIKASI */}
                  {order.status === 'menunggu_verifikasi' && (
                    <div style={{display: 'flex', gap: '5px', justifyContent:'center'}}>
                      <button onClick={() => updateStatus(order.id, 'lunas')} style={{background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>✔ Terima</button>
                      <button onClick={() => updateStatus(order.id, 'batal')} style={{background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>✖ Tolak</button>
                    </div>
                  )}
                  {order.status === 'lunas' && <span style={{color:'green', fontWeight:'bold'}}>Selesai</span>}
                  {order.status === 'batal' && <span style={{color:'red'}}>Dibatalkan</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPanel