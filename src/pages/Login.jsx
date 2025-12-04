import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
        // PERBAIKAN: Gunakan URL lengkap backend Python (Port 5000)
        const response = await fetch('http://127.0.0.1:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
          // Simpan data user ke LocalStorage
          localStorage.setItem('user', JSON.stringify(result.user));

          // Notifikasi Sukses Cantik
          Swal.fire({
            title: 'Berhasil Masuk!',
            text: `Selamat datang kembali, ${result.user.nama}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            // Arahkan sesuai Role
            if (result.user.role === 'admin') {
                navigate('/admin'); 
            } else {
                navigate('/'); 
            }
            window.location.reload(); 
          });

        } else {
          // Jika password/email salah
          Swal.fire({
            title: 'Gagal Masuk',
            text: result.message || 'Email atau Password salah.',
            icon: 'error',
            confirmButtonColor: '#d33'
          });
        }
    } catch (error) {
        console.error("Login Error:", error);
        Swal.fire({
            title: 'Server Error',
            text: 'Tidak dapat terhubung ke server backend (Pastikan server.py berjalan).',
            icon: 'error'
        });
    }
  };

  return (
    <div className="container" style={{ padding: '100px 0', maxWidth: '500px' }}>
      <div className="contact-form-area" style={{ textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '30px', borderRadius: '15px' }}>
        <h3 style={{ marginBottom: '10px' }}>Login Akun</h3>
        <p style={{ marginBottom: '30px', color: '#666' }}>Masuk untuk akses fitur belanja.</p>
        
        <form onSubmit={handleLogin}>
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

          <button type="submit" className="btn-send" style={{ width: '100%', height: '50px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}>Masuk Sekarang</button>
        </form>
        
        <p style={{ marginTop: '20px' }}>
            Belum punya akun? <a href="/register" style={{ color: '#FFD700', fontWeight: 'bold' }}>Daftar disini</a>
        </p>
      </div>
    </div>
  )
}

export default Login;