import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Pastikan import ini ada!

function Register() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password })
      });

      const result = await response.json();

      if (response.ok) {
        // PERBAIKAN: Ganti alert() dengan Swal.fire()
        Swal.fire({
          title: 'Registrasi Berhasil!',
          text: 'Akun Anda telah dibuat. Silakan login.',
          icon: 'success',
          confirmButtonText: 'Lanjut Login',
          confirmButtonColor: '#3085d6'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
        
      } else {
        // Notifikasi Gagal yang lebih cantik
        Swal.fire({
          title: 'Gagal Daftar',
          text: result.message || 'Terjadi kesalahan saat pendaftaran.',
          icon: 'warning',
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      console.error("Register Error:", error);
      Swal.fire({
        title: 'Error',
        text: 'Gagal menghubungi server.',
        icon: 'error'
      });
    }
  };

  return (
    <div className="container" style={{ padding: '100px 0', maxWidth: '500px' }}>
      <div className="contact-form-area" style={{ textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '30px', borderRadius: '15px' }}>
        <h3 style={{ marginBottom: '10px' }}>Daftar Akun Baru</h3>
        <p style={{ marginBottom: '30px', color: '#666' }}>Gabung jadi member Vinix Roastery.</p>
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Nama Lengkap" 
              value={nama} 
              onChange={(e) => setNama(e.target.value)} 
              required 
              style={{ height: '50px', borderRadius: '8px' }}
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ height: '50px', borderRadius: '8px' }}
            />
          </div>
          
          <div className="form-group" style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              className="form-control" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ height: '50px', borderRadius: '8px' }}
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#666',
                zIndex: 10
              }}
            >
              {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
            </span>
          </div>

          <button type="submit" className="btn-send" style={{ width: '100%', height: '50px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}>Daftar Sekarang</button>
        </form>
        
        <p style={{ marginTop: '20px' }}>Sudah punya akun? <a href="/login" style={{ color: '#FFD700', fontWeight: 'bold' }}>Login disini</a></p>
      </div>
    </div>
  )
}

export default Register;