import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'

// Import Halaman User
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Riwayat from './pages/Riwayat' 

// Import Halaman Admin
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminTransactions from './pages/AdminTransactions'
import AdminReports from './pages/AdminReports' // <-- Route Laporan

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // --- LOGIKA PENTING: CEK LOGIN SETIAP PINDAH HALAMAN ---
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(loggedInUser));
    } else {
      setUser(null); // Kalau storage kosong, pastikan state user juga null
    }
  }, [location]); // <-- Dijalankan setiap kali lokasi (halaman) berubah

  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin Logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal'
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
      }
    });
  };

  // Cek apakah ini halaman Admin?
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* NAVBAR USER (Hanya muncul jika BUKAN halaman admin) */}
      {!isAdminRoute && (
        <header>
          <div className="container">
            <Link to="/" className="brand-logo">
              <div className="logo-img-box">
                <img src="/img/logo.png" alt="Logo" />
              </div>
            </Link>
            
            <nav>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/products">Product</Link></li>
                {/* Menu Riwayat hanya untuk User Biasa */}
                {user && user.role === 'user' && (
                   <li><Link to="/riwayat">Pesanan Saya</Link></li>
                )}
                <li><Link to="/contact">Contact Us</Link></li>

                {/* Logika Tombol Login/Logout */}
                {user ? (
                  <li style={{display:'flex', alignItems:'center', gap:'15px'}}>
                    <span style={{color:'white', fontWeight:'500'}}>
                      Halo, <span style={{color:'#FFD700'}}>{user.nama}</span>
                    </span>
                    <button 
                      onClick={handleLogout} 
                      className="btn-nav-login" 
                      style={{background:'transparent', color:'#FFD700', borderColor:'#FFD700', cursor:'pointer'}}
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <li><Link to="/login" className="btn-nav-login">Login</Link></li>
                )}
              </ul>
            </nav>
          </div>
        </header>
      )}

      <Routes>
        {/* JALUR USER */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/riwayat" element={<Riwayat />} />

        {/* JALUR ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/reports" element={<AdminReports />} /> {/* <-- Menu Laporan Disini */}
      </Routes>

      {/* FOOTER USER */}
      {!isAdminRoute && (
        <footer>
          <div className="container">
            <div className="footer-grid">
              <div className="footer-item">
                <h4>Alamat</h4>
                <p>Jalan Taman Surya No. 1, Ketabang,<br />Kecamatan Genteng, Surabaya</p>
              </div>
              <div className="footer-item">
                <h4>Kontak Kami</h4>
                <p><i className="fab fa-whatsapp"></i> +62 8889 9911</p>
              </div>
              <div className="footer-item">
                <h4>Email</h4>
                <p>vinixroastery@gmail.com</p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  )
}

export default App