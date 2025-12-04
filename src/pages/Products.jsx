import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import Notifikasi Keren

function Products() {
  const [products, setProducts] = useState([]); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // State Mode Tampilan ('detail' atau 'order')
  const [viewMode, setViewMode] = useState('detail');

  // State Transaksi
  const [user, setUser] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [alamat, setAlamat] = useState('');
  
  const navigate = useNavigate();

  const formatRupiah = (angka) => "Rp " + parseInt(angka).toLocaleString('id-ID');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));

    const loggedInUser = localStorage.getItem('user');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, []);

  const openModal = (product, mode) => {
    setSelectedProduct(product);
    setViewMode(mode);
    setJumlah(1);      
    setAlamat('');     
  };

  const handleOrder = async () => {
    if (!user) {
      Swal.fire('Eits!', 'Silakan login dulu sebelum memesan.', 'warning');
      navigate('/login');
      return;
    }
    if (alamat.trim() === "") {
        Swal.fire('Ups!', 'Alamat pengiriman wajib diisi ya.', 'info');
        return;
    }

    const totalBayar = selectedProduct.harga * jumlah;

    try {
        const response = await fetch('http://127.0.0.1:5000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            product_id: selectedProduct.id,
            jumlah: jumlah,
            total_harga: totalBayar,
            alamat: alamat
          })
        });
    
        if (response.ok) {
          // NOTIFIKASI SUKSES YANG KEREN
          Swal.fire({
            title: 'Berhasil Dipesan!',
            text: 'Silakan cek menu "Pesanan Saya" untuk melakukan pembayaran.',
            icon: 'success',
            confirmButtonColor: '#FFD700',
            confirmButtonText: 'Siap, Bos!'
          });
          setSelectedProduct(null); 
        } else {
          Swal.fire('Gagal', 'Terjadi kesalahan sistem.', 'error');
        }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
        Swal.fire('Error', 'Tidak dapat terhubung ke server.', 'error');
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <h2 className="section-title">Katalog Produk Kopi</h2>
      <p className="section-subtitle">Stok Real-time dari Database Vinix Roastery</p>

      <div className="product-grid">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.gambar} alt={item.nama_produk} />
            <div className="product-info">
              <div className="product-name">{item.nama_produk}</div>
              <span className="product-price">{formatRupiah(item.harga)} (500 gr)</span>
              
              <div className="card-buttons">
                <button className="btn-card-white" onClick={() => openModal(item, 'detail')}>Lihat Detail</button>
                <button className="btn-card-white" onClick={() => openModal(item, 'order')}>Pesan</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL POPUP --- */}
      {selectedProduct && (
        <div className="modal" style={{ display: 'block' }} onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-left">
              <img src={selectedProduct.gambar} alt={selectedProduct.nama_produk} className="modal-img" />
            </div>
            
            <div className="modal-right" style={{overflowY: 'auto', maxHeight: '90vh'}}>
              <h2 className="modal-title">{selectedProduct.nama_produk}</h2>

              {viewMode === 'detail' ? (
                <>
                   <div className="spec-table" style={{marginBottom: '20px'}}>
                      <div className="spec-row"><span className="spec-label">Harga:</span> <span className="spec-value" style={{color: '#FFD700', fontWeight:'bold'}}>{formatRupiah(selectedProduct.harga)}</span></div>
                      <div className="spec-row"><span className="spec-label">Berat:</span> <span className="spec-value">500 gr</span></div>
                      <div className="spec-row"><span className="spec-label">Roast:</span> <span className="spec-value">{selectedProduct.roast_level}</span></div>
                      <div className="spec-row"><span className="spec-label">Proses:</span> <span className="spec-value">{selectedProduct.proses}</span></div>
                      <div className="spec-row"><span className="spec-label">Acid:</span> <span className="spec-value">{selectedProduct.acidity}</span></div>
                      <div className="spec-row"><span className="spec-label">Notes:</span> <span className="spec-value">{selectedProduct.notes}</span></div>
                  </div>
                  <p className="modal-desc" style={{fontSize: '0.9rem', marginBottom: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px'}}>
                    {selectedProduct.deskripsi}
                  </p>
                  <div className="modal-btns">
                    <button className="btn-modal-action" onClick={() => setViewMode('order')} style={{background: '#FFD700', border: 'none', color: '#051e3e'}}>Pesan Sekarang</button>
                    <button className="btn-modal-action" onClick={() => setSelectedProduct(null)}>Tutup</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="product-price" style={{color: '#FFD700', fontSize: '1.5rem', marginBottom: '20px'}}>
                    {formatRupiah(selectedProduct.harga)} <span style={{fontSize:'0.9rem', color:'white'}}>/ pack</span>
                  </p>
                  <h4 style={{color: 'white', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px'}}>Formulir Pemesanan</h4>
                  {user ? (
                    <div>
                      <div className="form-group">
                        <label style={{color: 'white', fontSize: '0.9rem'}}>Jumlah</label>
                        <input type="number" min="1" className="form-control" value={jumlah} onChange={(e) => setJumlah(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label style={{color: 'white', fontSize: '0.9rem'}}>Alamat</label>
                        <textarea className="form-control" style={{height: '80px'}} value={alamat} onChange={(e) => setAlamat(e.target.value)}></textarea>
                      </div>
                      <div style={{background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', margin: '20px 0', textAlign: 'center'}}>
                        <span style={{color: '#ccc', fontSize: '0.9rem'}}>Total Bayar:</span>
                        <h2 style={{color: '#FFD700', margin: '5px 0 0 0'}}>{formatRupiah(selectedProduct.harga * jumlah)}</h2>
                      </div>
                      <div className="modal-btns">
                        <button className="btn-modal-action" onClick={handleOrder} style={{background: '#FFD700', border: 'none', color: '#051e3e'}}>Konfirmasi</button>
                        <button className="btn-modal-action" onClick={() => setSelectedProduct(null)}>Batal</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{textAlign: 'center', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px'}}>
                      <p style={{color: '#ccc'}}>Anda harus Login untuk memesan.</p>
                      <button className="btn-modal-action" onClick={() => navigate('/login')} style={{background: '#FFD700', border: 'none', color: '#051e3e'}}>Login Sekarang</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Products