/* eslint-disable no-unused-vars */
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- FUNGSI LOGOUT (SUDAH DIPERBAIKI) ---
  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin mau Logout?',
      text: "Sesi admin Anda akan berakhir.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Keluar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    }).then((res) => {
      if (res.isConfirmed) {
        // 1. Hapus data dari penyimpanan
        localStorage.removeItem('user');
        // 2. Paksa refresh halaman ke login agar state User benar-benar hilang
        window.location.href = '/login'; 
      }
    });
  };

  // Style Menu Aktif
  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? '#FFD700' : 'rgba(255,255,255,0.7)',
      background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
      padding: '12px 20px',
      borderRadius: '10px',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontWeight: isActive ? '600' : '400',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem',
      marginBottom: '8px',
      borderLeft: isActive ? '4px solid #FFD700' : '4px solid transparent'
    };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F3F4F6', fontFamily: "'Poppins', sans-serif" }}>
      
      {/* --- SIDEBAR KIRI --- */}
      <div style={{ 
          width: '260px', 
          background: '#051e3e', 
          color: 'white', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
          zIndex: 100
      }}>
        {/* Logo Area */}
        <div style={{ padding: '30px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#FFD700', letterSpacing: '1px' }}>ADMIN PANEL</h2>
          <p style={{ margin: '5px 0 0', fontSize: '0.75rem', opacity: 0.6, letterSpacing: '2px' }}>VINIX ROASTERY</p>
        </div>
        
        {/* Menu Navigasi */}
        <nav style={{ flex: 1, padding: '20px' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.5, marginBottom: '10px', letterSpacing: '1px' }}>Menu Utama</p>
          
          <Link to="/admin" style={getLinkStyle('/admin')}>
            <span>📊</span> Dashboard
          </Link>
          <Link to="/admin/transactions" style={getLinkStyle('/admin/transactions')}>
            <span>🛒</span> Transaksi
          </Link>
          <Link to="/admin/users" style={getLinkStyle('/admin/users')}>
            <span>👥</span> Data Pengguna
          </Link>
          
          {/* --- MENU BARU: LAPORAN EXCEL --- */}
          <Link to="/admin/reports" style={getLinkStyle('/admin/reports')}>
            <span>📄</span> Laporan Keuangan
          </Link>
        </nav>

        {/* Tombol Logout */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            onClick={handleLogout} 
            style={{ 
              width: '100%', padding: '12px', background: '#dc3545', color: 'white', 
              border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: '0 4px 10px rgba(220, 53, 69, 0.3)', transition: '0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#bb2d3b'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#dc3545'}
          >
            {/* Ikon Panah */}
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* --- KONTEN KANAN --- */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', width: 'calc(100% - 260px)' }}>
        
        {/* HEADER ATAS */}
        <header style={{ 
            background: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)', position: 'sticky', top: 0, zIndex: 90
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#051e3e', fontSize: '1.5rem' }}>{title}</h2>
            <p style={{ margin: '5px 0 0', color: '#888', fontSize: '0.9rem' }}>Selamat datang kembali, Admin.</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#051e3e' }}>Administrator</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#28a745' }}>● Online</p>
            </div>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#051e3e', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
              A
            </div>
          </div>
        </header>

        {/* ISI HALAMAN */}
        <div style={{ padding: '40px' }}>
            {children}
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;