/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

function Riwayat() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const formatRupiah = (angka) => "Rp " + parseInt(angka).toLocaleString('id-ID');

  // Data Bank untuk Dropdown
  const bankAccounts = {
    bca: { name: 'BCA', no: '123-456-7890', an: 'Vinix Roastery' },
    mandiri: { name: 'Mandiri', no: '123-000-444-555', an: 'PT Vinix Sejahtera' },
    bni: { name: 'BNI', no: '987-654-321', an: 'Vinix Official' },
    bri: { name: 'BRI', no: '0000-1111-2222', an: 'Vinix Coffee' }
  };

  const fetchOrders = (userId) => {
    // TAMBAH TIMESTAMP UNTUK MENCEGAH CACHE (WAJIB AGAR STATUS UPDATE)
    fetch(`http://127.0.0.1:5000/api/orders/${userId}?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Gagal ambil data:", err));
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(loggedInUser);
    setUser(userData);
    fetchOrders(userData.id);
  }, []);

  const getStatusBadge = (status) => {
      // Paksa huruf kecil dan hapus spasi biar aman
      const s = status ? status.toLowerCase().trim() : 'pending';
      let style = { padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'white', display:'inline-block', letterSpacing:'0.5px' };

      if (s === 'menunggu_verifikasi') { style.background = '#fd7e14'; return <span style={style}>Menunggu Verifikasi</span>; }
      else if (s === 'lunas') { style.background = '#0d6efd'; return <span style={style}>Lunas - Siap Kirim</span>; }
      else if (s === 'dikirim') { style.background = '#0dcaf0'; return <span style={style}>Sedang Dikirim</span>; }
      // STATUS SELESAI (HIJAU)
      else if (s === 'selesai') { style.background = '#198754'; return <span style={style}>Selesai</span>; }
      else if (s === 'batal') { style.background = '#dc3545'; return <span style={style}>Dibatalkan</span>; }
      
      style.background = '#6c757d'; 
      return <span style={style}>Belum Bayar</span>;
  };

  // --- FUNGSI 1: BAYAR (Premium Style dengan Dropdown Bank) ---
  const handleBayar = async (orderId, totalHarga) => {
    const hargaFormatted = formatRupiah(totalHarga);

    const { value: file } = await Swal.fire({
      title: '<h3 style="color:#051e3e; margin:0;">Pembayaran</h3>',
      html: `
        <div style="text-align: left; font-family: 'Poppins', sans-serif;">
          <p style="font-size: 0.95rem; color: #666; margin-bottom: 5px;">Total Tagihan:</p>
          <h2 style="color: #051e3e; margin-top: 0; margin-bottom: 20px; font-size: 2rem;">${hargaFormatted}</h2>
          
          <label style="display:block; margin-bottom:5px; font-weight:600; color:#333;">Pilih Bank Tujuan:</label>
          <select id="swal-bank" class="swal2-select" style="display:flex; width:100%; margin: 0 0 20px 0; border-radius: 8px; border: 1px solid #ccc; padding: 10px;">
            <option value="bca">Bank BCA</option>
            <option value="mandiri">Bank Mandiri</option>
            <option value="bni">Bank BNI</option>
            <option value="bri">Bank BRI</option>
          </select>

          <div id="bank-info-box" style="background: #f0f4f8; padding: 15px; border-radius: 10px; border-left: 5px solid #005eb8; margin-bottom: 20px; transition: 0.3s;">
            <p style="margin:0; font-size:0.85rem; color:#666;">Transfer ke:</p>
            <h3 id="rek-no" style="margin: 5px 0; color:#051e3e;">${bankAccounts.bca.no}</h3>
            <p id="rek-an" style="margin:0; font-weight:bold; color:#333;">a.n. ${bankAccounts.bca.an}</p>
          </div>

          <label style="display:block; margin-bottom:5px; font-weight:600; color:#333;">Upload Bukti Transfer:</label>
          <div class="file-upload-wrapper" style="position: relative; width: 100%; text-align: center;">
            <input type="file" id="swal-file" style="display: none;" accept="image/*">
            <label for="swal-file" id="file-label-area" style="display: flex; flex-direction: column; align-items: center; padding: 20px; border: 2px dashed #ccc; border-radius: 10px; background: #fafafa; cursor: pointer; transition: 0.3s;">
                <div style="font-size: 2rem; color: #ccc; margin-bottom: 5px;">📷</div>
                <span id="file-text" style="color: #666; font-size: 0.9rem; font-weight: 500;">Klik untuk pilih foto struk</span>
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Kirim Bukti',
      confirmButtonColor: '#051e3e',
      cancelButtonText: 'Batal',
      focusConfirm: false,
      didOpen: () => {
        // Logic Dropdown Bank
        const bankSelect = document.getElementById('swal-bank');
        const rekNo = document.getElementById('rek-no');
        const rekAn = document.getElementById('rek-an');
        const infoBox = document.getElementById('bank-info-box');
        const colors = { bca: '#005eb8', mandiri: '#ffb700', bni: '#f15a22', bri: '#00529c' };

        bankSelect.addEventListener('change', (e) => {
          const selected = bankAccounts[e.target.value];
          rekNo.textContent = selected.no;
          rekAn.textContent = 'a.n. ' + selected.an;
          infoBox.style.borderLeftColor = colors[e.target.value];
        });

        // Logic Input File
        const fileInput = document.getElementById('swal-file');
        const fileLabel = document.getElementById('file-label-area');
        const fileText = document.getElementById('file-text');

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const fileName = fileInput.files[0].name;
                fileText.innerHTML = "Foto Terpilih:<br/><b>" + fileName + "</b>";
                fileText.style.color = "#051e3e";
                fileLabel.style.borderColor = "#051e3e"; 
                fileLabel.style.backgroundColor = "#e6f0ff";
            }
        });
      },
      preConfirm: () => {
        const fileInput = document.getElementById('swal-file');
        if (!fileInput.files[0]) { Swal.showValidationMessage('Mohon upload bukti transfer dulu!'); }
        return fileInput.files[0];
      }
    });

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('order_id', orderId);

      try {
        Swal.fire({ title: 'Mengupload...', didOpen: () => Swal.showLoading() });
        const response = await fetch('http://127.0.0.1:5000/api/upload_payment', { method: 'POST', body: formData });
        if (response.ok) {
          Swal.fire('Berhasil!', 'Bukti pembayaran diterima.', 'success');
          if (user) fetchOrders(user.id);
        } else {
          Swal.fire('Gagal', 'Terjadi kesalahan saat upload.', 'error');
        }
      } catch (error) { Swal.fire('Error', 'Tidak dapat terhubung ke server.', 'error'); }
    }
  };

  // --- FUNGSI 2: TERIMA BARANG (Upload Bukti Paket) ---
  const handleSelesai = async (orderId) => {
    const { value: file } = await Swal.fire({
      title: '<h3 style="color:#198754; margin:0;">Pesanan Diterima?</h3>',
      html: `
        <div style="text-align: center; font-family: 'Poppins', sans-serif;">
            <p style="color: #666; margin-bottom: 15px;">
                Pastikan paket sudah aman di tangan Anda.<br/>
                <b>Wajib upload foto paket</b> sebagai bukti penerimaan.
            </p>
            
            <div class="file-upload-wrapper" style="position: relative; width: 100%; text-align: center;">
                <input type="file" id="swal-file-terima" style="display: none;" accept="image/*">
                <label for="swal-file-terima" id="label-terima" style="display: flex; flex-direction: column; align-items: center; padding: 20px; border: 2px dashed #28a745; border-radius: 10px; background: #f0fff4; cursor: pointer; transition: 0.3s;">
                    <div style="font-size: 2rem; color: #28a745; margin-bottom: 5px;">📦</div>
                    <span id="text-terima" style="color: #28a745; font-size: 0.9rem; font-weight: 500;">Klik untuk foto paket</span>
                </label>
            </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Konfirmasi Selesai',
      confirmButtonColor: '#198754',
      cancelButtonText: 'Batal',
      focusConfirm: false,
      didOpen: () => {
        const fileInput = document.getElementById('swal-file-terima');
        const fileLabel = document.getElementById('label-terima');
        const fileText = document.getElementById('text-terima');

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const fileName = fileInput.files[0].name;
                fileText.innerHTML = "Foto Paket:<br/><b>" + fileName + "</b>";
                fileText.style.color = "#155724";
                fileLabel.style.backgroundColor = "#d4edda";
                fileLabel.style.borderStyle = "solid";
            }
        });
      },
      preConfirm: () => {
        const fileInput = document.getElementById('swal-file-terima');
        if (!fileInput.files[0]) { Swal.showValidationMessage('Wajib upload foto bukti paket!'); }
        return fileInput.files[0];
      }
    });

    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('order_id', orderId);

        try {
            Swal.fire({ title: 'Menyelesaikan...', didOpen: () => Swal.showLoading() });
            
            // PANGGIL ENDPOINT BARU (finish_order)
            const response = await fetch('http://127.0.0.1:5000/api/finish_order', {
                method: 'POST',
                body: formData
            });
            
            if(response.ok) {
                Swal.fire('Terima Kasih!', 'Transaksi Selesai & Bukti tersimpan.', 'success');
                if (user) fetchOrders(user.id); // Refresh data otomatis
            } else {
                Swal.fire('Gagal', 'Terjadi kesalahan server.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Koneksi gagal.', 'error');
        }
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
      <h2 className="section-title">Riwayat Pesanan Saya</h2>
      {orders.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <p>Belum ada pesanan.</p>
          <button style={{background:'#051e3e', color:'white', padding:'10px 20px', border:'none', borderRadius:'5px', cursor:'pointer'}} onClick={() => navigate('/products')}>
            Belanja Sekarang
          </button>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          {orders.map((item) => {
            // Logic Aman Status
            const safeStatus = item.status ? item.status.toLowerCase().trim() : 'pending';
            return (
              <div key={item.id} style={{
                  background: 'white', padding: '20px', borderRadius: '15px', 
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap'
              }}>
                  <img src={item.gambar} alt="Produk" style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px'}} />
                  <div style={{flex: 1}}>
                      <h4 style={{margin: 0, color: '#051e3e'}}>{item.nama_produk}</h4>
                      <p style={{fontSize: '0.9rem', color: '#666'}}>
                          Jumlah: {item.jumlah} pack <br/>
                          Total: <b style={{color: '#051e3e'}}>{formatRupiah(item.total_harga)}</b>
                      </p>
                      {safeStatus === 'dikirim' && (
                          <p style={{fontSize:'0.85rem', color:'#0dcaf0', background:'#e0f7fa', padding:'5px 10px', borderRadius:'5px', display:'inline-block'}}>
                              🚚 Estimasi Sampai: <b>{item.estimasi_sampai || 'Segera'}</b>
                          </p>
                      )}
                  </div>
                  <div style={{textAlign: 'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'10px'}}>
                      {getStatusBadge(item.status)}
                      
                      {/* TOMBOL BAYAR (HANYA MUNCUL JIKA PENDING) */}
                      {safeStatus === 'pending' && (
                          <button onClick={() => handleBayar(item.id, item.total_harga)} style={{background:'#051e3e', color:'white', border:'none', padding:'8px 20px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
                              Bayar Sekarang
                          </button>
                      )}

                      {/* TOMBOL TERIMA (HANYA MUNCUL JIKA DIKIRIM) */}
                      {safeStatus === 'dikirim' && (
                          <button onClick={() => handleSelesai(item.id)} style={{
                              background:'#198754', color:'white', border:'none', 
                              padding:'8px 20px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'
                          }}>
                              ✅ Pesanan Diterima
                          </button>
                      )}
                  </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
export default Riwayat;