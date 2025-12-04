import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../components/AdminLayout';

function AdminTransactions() {
  const [orders, setOrders] = useState([]);
  const formatRupiah = (angka) => "Rp " + parseInt(angka).toLocaleString('id-ID');

  const fetchAllOrders = () => {
      fetch('http://127.0.0.1:5000/api/admin/orders')
        .then(res=>res.json())
        .then(data => {
            if (Array.isArray(data)) setOrders(data);
            else setOrders([]);
        })
        .catch(err => console.error(err));
  };

  useEffect(() => { fetchAllOrders(); }, []);

  const updateStatus = async (id, status, estimasi = null) => {
      const payload = { order_id: id, status: status };
      if (estimasi) payload.estimasi = estimasi;

      await fetch('http://127.0.0.1:5000/api/admin/order_status', {
          method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)
      });
      Swal.fire('Sukses', 'Status diperbarui', 'success');
      fetchAllOrders();
  };

  const handleKirimBarang = async (orderId) => {
    const { value: estimasi } = await Swal.fire({
      title: 'Kirim Pesanan',
      input: 'text',
      inputPlaceholder: 'Estimasi (misal: 2 Hari)',
      showCancelButton: true,
      confirmButtonText: 'Kirim'
    });
    if (estimasi) updateStatus(orderId, 'dikirim', estimasi);
  };

  const lihatBukti = (filename, title="Bukti") => {
      if(!filename) return Swal.fire('Info', 'Belum ada bukti', 'info');
      Swal.fire({ title: title, imageUrl: `http://127.0.0.1:5000/uploads/${filename}`, width: '400px' });
  };

  const getStatusBadge = (status) => {
      const s = status ? status.toLowerCase().trim() : 'pending';
      let style = { padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight:'bold', color: 'white' };

      if (s === 'menunggu_verifikasi') { style.background = '#fd7e14'; return <span style={style}>Verifikasi</span>; }
      else if (s === 'lunas') { style.background = '#0d6efd'; return <span style={style}>Siap Kirim</span>; }
      else if (s === 'dikirim') { style.background = '#0dcaf0'; return <span style={style}>Dikirim</span>; }
      else if (s === 'selesai') { style.background = '#198754'; return <span style={style}>Selesai</span>; }
      else if (s === 'batal') { style.background = '#dc3545'; return <span style={style}>Batal</span>; }

      style.background = '#6c757d'; 
      return <span style={style}>Pending</span>;
  };

  return (
    <AdminLayout title="Kelola Transaksi">
      <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', overflowX:'auto' }}>
          <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: '0 15px'}}>
            <thead>
              <tr style={{color: '#888', textAlign: 'left', textTransform: 'uppercase', fontSize:'0.9rem'}}>
                <th style={{padding:'10px'}}>Pelanggan</th>
                <th style={{padding:'10px'}}>Total</th>
                <th style={{padding:'10px'}}>Status</th>
                <th style={{padding:'10px'}}>Bukti</th>
                <th style={{padding:'10px'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map((order) => {
                const safeStatus = (order.status || 'pending').toLowerCase().trim();
                return (
                  <tr key={order.id} style={{background: '#f8f9fa'}}>
                    <td style={{padding:'15px'}}><b>{order.nama_pembeli}</b><br/><small>{order.nama_produk} ({order.jumlah})</small></td>
                    <td style={{padding:'15px', color:'green', fontWeight:'bold'}}>{formatRupiah(order.total_harga)}</td>
                    <td style={{padding:'15px'}}>{getStatusBadge(order.status)}</td>
                    <td style={{padding:'15px'}}>
                        {/* TOMBOL BUKTI BAYAR */}
                        <button onClick={()=>lihatBukti(order.bukti_bayar, "Bukti Bayar")} style={{border:'1px solid #ccc', padding:'5px', borderRadius:'5px', cursor:'pointer', fontSize:'0.8rem', marginRight:'5px'}}>
                            📷 Bayar
                        </button>
                        {/* TOMBOL BUKTI PAKET (Baru muncul jika user sudah terima) */}
                        {order.bukti_diterima && (
                            <button onClick={()=>lihatBukti(order.bukti_diterima, "Bukti Paket")} style={{border:'1px solid #28a745', color:'green', padding:'5px', borderRadius:'5px', cursor:'pointer', fontSize:'0.8rem'}}>
                                📦 Paket
                            </button>
                        )}
                    </td>
                    <td style={{padding:'15px'}}>
                       {safeStatus === 'menunggu_verifikasi' && (
                           <div style={{display:'flex', gap:'5px'}}>
                               <button onClick={()=>updateStatus(order.id, 'lunas')} style={{background:'#198754', color:'white', border:'none', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}>✔ Terima</button>
                               <button onClick={()=>updateStatus(order.id, 'batal')} style={{background:'#dc3545', color:'white', border:'none', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}>✖ Tolak</button>
                           </div>
                       )}
                       {safeStatus === 'lunas' && (
                          <button onClick={()=>handleKirimBarang(order.id)} style={{background:'#0dcaf0', color:'white', border:'none', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}>📦 Kirim</button>
                       )}
                    </td>
                  </tr>
                )
              }) : <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>Belum ada transaksi</td></tr>}
            </tbody>
          </table>
      </div>
    </AdminLayout>
  )
}
export default AdminTransactions;