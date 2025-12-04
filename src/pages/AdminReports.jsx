import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; // Library Excel
import AdminLayout from '../components/AdminLayout';

// --- CSS IN JS UNTUK ANIMASI ---
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  .hover-card:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
  }
`;

function AdminReports() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  // State Filter (Default: Bulan & Tahun saat ini)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); 
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Helper: Format Rupiah (Aman dari error jika angka null)
  const formatRupiah = (angka) => "Rp " + parseInt(angka || 0).toLocaleString('id-ID');

  // Inject CSS Styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // --- 1. AMBIL DATA DARI SERVER ---
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        console.log("DATA DARI DATABASE:", data); // Cek Console (F12) untuk debugging
        setOrders(data);
        // eslint-disable-next-line react-hooks/immutability
        filterData(data, selectedMonth, selectedYear);
      })
      .catch(err => console.error("Gagal ambil data:", err));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- 2. LOGIKA FILTER CANGGIH ---
  const filterData = (data, month, year) => {
    const filtered = data.filter(item => {
      // Safety Check: Lewati jika tanggal atau status kosong (biar gak error)
      if (!item.tanggal_order || !item.status) return false;

      const date = new Date(item.tanggal_order);
      
      // Normalisasi Status (Ubah ke huruf kecil semua biar cocok)
      const statusLower = item.status.toLowerCase();
      
      // DAFTAR STATUS YANG DIANGGAP "UANG MASUK"
      const validStatuses = ['lunas', 'dikirim', 'selesai'];
      
      const isStatusValid = validStatuses.includes(statusLower);
      const isMonthValid = date.getMonth() + 1 === parseInt(month);
      const isYearValid = date.getFullYear() === parseInt(year);

      return isStatusValid && isMonthValid && isYearValid;
    });

    console.log("DATA SETELAH FILTER:", filtered); // Cek Console (F12)
    setFilteredOrders(filtered);
  };

  // Handle saat dropdown berubah
  const handleFilterChange = () => {
    filterData(orders, selectedMonth, selectedYear);
  };

  // --- 3. EXPORT KE EXCEL ---
  const exportToExcel = () => {
    if (filteredOrders.length === 0) {
        alert(`Tidak ada data transaksi SUKSES (Lunas/Dikirim/Selesai) pada bulan ${selectedMonth}-${selectedYear}.`);
        return;
    }

    const dataToExport = filteredOrders.map((order, index) => ({
      No: index + 1,
      "Tanggal Order": new Date(order.tanggal_order).toLocaleDateString('id-ID'),
      "Nama Pelanggan": order.nama_pembeli,
      "Produk": order.nama_produk,
      "Jumlah": order.jumlah,
      "Total Harga": parseInt(order.total_harga || 0),
      "Status": (order.status || '').toUpperCase().replace('_', ' ')
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Rapikan Lebar Kolom Excel
    const wscols = [
        {wch: 5}, {wch: 15}, {wch: 25}, {wch: 25}, {wch: 10}, {wch: 20}, {wch: 15}
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");

    XLSX.writeFile(workbook, `Laporan_Vinix_${selectedMonth}-${selectedYear}.xlsx`);
  };

  // Hitung Total Pemasukan
  const totalPemasukan = filteredOrders.reduce((acc, curr) => acc + parseInt(curr.total_harga || 0), 0);

  // Helper Warna Badge Status
  const getStatusColor = (status) => {
      const s = (status || '').toLowerCase();
      switch(s) {
          case 'selesai': return { bg: '#d1e7dd', text: '#0f5132' };
          case 'dikirim': return { bg: '#cff4fc', text: '#055160' };
          case 'lunas': return { bg: '#d4edda', text: '#155724' };
          default: return { bg: '#fff3cd', text: '#856404' };
      }
  };

  return (
    <AdminLayout title="Laporan Keuangan Bulanan">
      <div className="fade-in" style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
        
        {/* --- AREA FILTER --- */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem', color: '#555' }}>Bulan</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '150px', outline: 'none' }}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem', color: '#555' }}>Tahun</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '100px', outline: 'none' }}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          <button onClick={handleFilterChange} className="hover-card" style={{ padding: '10px 25px', background: '#051e3e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(5, 30, 62, 0.2)' }}>
            🔍 Tampilkan
          </button>

          <button onClick={exportToExcel} className="hover-card" style={{ marginLeft: 'auto', padding: '10px 25px', background: '#207245', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(32, 114, 69, 0.2)' }}>
            <span>📥</span> Download Excel
          </button>
        </div>

        {/* --- KARTU RINGKASAN PEMASUKAN --- */}
        <div className="fade-in" style={{ marginBottom: '25px', padding: '20px', background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)', borderRadius: '12px', borderLeft: '6px solid #007bff', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div>
            <p style={{ margin: '0 0 5px', fontSize: '0.9rem', color: '#666' }}>Total Pemasukan (Sah)</p>
            <h2 style={{ margin: 0, color: '#051e3e', fontSize: '2rem' }}>{formatRupiah(totalPemasukan)}</h2>
            <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#888' }}>*Hanya menghitung status Lunas, Dikirim, & Selesai</p>
          </div>
          <div style={{ fontSize: '3rem', opacity: 0.2 }}>💰</div>
        </div>

        {/* --- TABEL DATA --- */}
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
            <thead>
                <tr style={{ color: '#888', fontSize: '0.9rem', textAlign: 'left', textTransform: 'uppercase' }}>
                <th style={{ padding: '15px' }}>Tanggal</th>
                <th style={{ padding: '15px' }}>Pelanggan</th>
                <th style={{ padding: '15px' }}>Produk</th>
                <th style={{ padding: '15px' }}>Total</th>
                <th style={{ padding: '15px' }}>Status</th>
                </tr>
            </thead>
            <tbody>
                {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => {
                    const statusStyle = getStatusColor(order.status);
                    return (
                        <tr key={order.id || index} className="fade-in" style={{ background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: '0.2s', animationDelay: `${index * 0.1}s` }}>
                        <td style={{ padding: '15px', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                           {new Date(order.tanggal_order).toLocaleDateString('id-ID')}
                        </td>
                        <td style={{ padding: '15px', fontWeight: '600', color: '#333' }}>{order.nama_pembeli}</td>
                        <td style={{ padding: '15px', color: '#555' }}>{order.nama_produk} <span style={{fontSize:'0.8rem', color:'#999'}}>x{order.jumlah}</span></td>
                        <td style={{ padding: '15px', color: '#207245', fontWeight: 'bold' }}>{formatRupiah(order.total_harga)}</td>
                        <td style={{ padding: '15px', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
                            <span style={{ background: statusStyle.bg, color: statusStyle.text, padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {(order.status || '-').replace('_', ' ')}
                            </span>
                        </td>
                        </tr>
                    );
                })
                ) : (
                <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#888', background: '#f9f9f9', borderRadius: '10px' }}>
                    🚫 Tidak ada data penjualan SAH pada periode ini.<br/>
                    <small>(Pastikan pesanan sudah berstatus: <b>Lunas, Dikirim, atau Selesai</b>)</small>
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminReports;