import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <h2>Find Your Brew</h2>
        <p>Kopi pilihan yang diproses dengan sepenuh hati, terinspirasi dari semangat inovasi. Setiap batch kami proses dengan detail dan transparansi.</p>
        <Link to="/products" className="btn-white-pill">Jelajahi Produk</Link>
      </div>
    </section>
  )
}

export default Home