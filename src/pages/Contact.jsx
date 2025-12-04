function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman
    alert("Pesan terkirim! (Ini simulasi, karena belum ada Backend)");
  };

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <h2 className="section-title">Hubungi Kami</h2>
      <p className="section-subtitle">Punya pertanyaan, kolaborasi, atau yang lainnya?</p>

      <div className="contact-layout">
        
        {/* --- FORM AREA --- */}
        <div className="contact-form-area">
          <h3>Hubungi Kami</h3>
          <p>Isi formulir berikut untuk info kirim ke email kami. Terima kasih.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label>Nama</label>
                  <input type="text" className="form-control" placeholder="Nama Lengkap" required />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" placeholder="email@gmail.com" required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Subjek</label>
              <input type="text" className="form-control" placeholder="Contoh: Kerjasama / Pertanyaan" />
            </div>

            <div className="form-group">
              <label>Pesan</label>
              <textarea className="form-control" placeholder="Tulis pesanmu disini...."></textarea>
            </div>

            <button type="submit" className="btn-send">Kirim Email</button>
          </form>
        </div>

        {/* --- INFO CARD AREA --- */}
        <div className="contact-info-area">
          <div className="info-card">
            <h4>Alamat</h4>
            <p>Jalan Taman Surya No. 1, Ketabang,<br/>Kecamatan Genteng, Surabaya</p>
          </div>

          <div className="info-card">
            <h4>Jam Operasional</h4>
            <p>Senin - Jumat: 08.00 - 17.00</p>
            <p>Sabtu: 09.00 - 14.00</p>
          </div>

          <div className="info-card" style={{ cursor: 'pointer' }} onClick={() => window.open('https://chat.whatsapp.com/FTIHZ4ILKFr4kYSMF3JwXC')}>
            <h4>Kontak Whatsapp</h4>
            <p><i className="fab fa-whatsapp"></i> +62 8889 9911 (Klik untuk Chat)</p>
          </div>

          <div className="info-card">
            <h4>Email</h4>
            <p>vinixroastery@gmail.com</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Contact