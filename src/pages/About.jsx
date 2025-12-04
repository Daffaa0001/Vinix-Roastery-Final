function About() {
  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <h2 className="section-title">Tentang Kami</h2>
      <p className="section-subtitle">Mengenal lebih dalam perjalanan Vinix Roastery</p>

      <div className="about-container">
        {/* Pastikan gambar about.jpg ada di public/img/ */}
        <div className="about-img"></div>
        
        <div className="about-content">
          <h3>Our Story</h3>
          <p>Vinix Roastery bermula dari keinginan sederhana: menghadirkan kopi yang jujur, berkualitas, dan punya cerita. Perjalanan ini berkembang ketika kami terhubung dengan ekosistem VINIX, yang memberi ruang bagi kami untuk menggabungkan kreativitas, teknologi, dan kecintaan pada kopi.</p>
          <p>Dari biji pilihan hingga proses roasting yang penuh detail, kami mencoba menghadirkan rasa yang tidak hanya enak, tetapi juga memiliki nilai. Bersama semangat inovatif yang mengalir di VINIX, kami tumbuh menjadi roastery yang dekat dengan petani, peduli kualitas, dan berorientasi pada pengalaman penikmat kopi.</p>
          
          <h3>Visi & Misi</h3>
          <p><strong>Visi:</strong> Menciptakan pengalaman kopi yang otentik dan berkelanjutan, dengan sentuhan inovasi dari ekosistem VINIX.</p>
          <p><strong>Misi:</strong> Mengolah biji kopi terbaik dengan proses roasting yang teliti dan transparan serta memperkenalkan kopi Indonesia melalui pendekatan kreatif dan teknologi ringan dari ekosistem VINIX.</p>
        </div>
      </div>
    </div>
  )
}

export default About