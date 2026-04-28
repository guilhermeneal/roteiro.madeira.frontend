import { useState, useEffect } from 'react'
import './App.css'

import Cart from './pages/Cart';
import Login from './pages/Login';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Navbar from './components/Navbar';
import Feedback from './pages/Feedback';

import { Routes, Route } from "react-router";

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="appContainer">
      <a className="skip-link" href="#mainContent">
        Saltar para o conteúdo principal
      </a>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main id="mainContent" style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/index.html" element={<Home searchQuery={searchQuery} />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/login.html" element={<Login />} />
          
          <Route path="/register" element={<Login register={true} />} />
          <Route path="/register.html" element={<Login register={true} />} />
          
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart.html" element={<Cart />} />
          
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout.html" element={<Checkout />} />
          
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/feedback.html" element={<Feedback />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Roteiros Turísticos Madeira</h3>
            <p>Descubra as melhores experiências turísticas na ilha da eterna primavera. Roteiros autênticos e inesquecíveis pela Madeira.</p>
            <div className="footer-social">
              <a href="#" className="social-icon" aria-label="Facebook">
                <span>f</span>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <span>📷</span>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <span>𝕏</span>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Links Rápidos</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/cart.html">Reservas</a></li>
              <li><a href="/feedback.html">Feedback</a></li>
              <li><a href="/login.html">Login</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Categorias</h3>
            <ul>
              <li><a href="/?category=natureza">🌿 Natureza</a></li>
              <li><a href="/?category=gastronomia">🍽️ Gastronomia</a></li>
              <li><a href="/?category=cultura">🏛️ Cultura</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contato</h3>
            <p>📧 info@roteirosmadeira.pt</p>
            <p>📞 +351 291 123 456</p>
            <p>📍 Funchal, Madeira</p>
            <p>⏰ Seg-Sex: 9h-18h</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 <a href="/">Roteiros Turísticos Madeira</a> - Todos os direitos reservados</p>
          <p><a href="/privacy">Privacidade</a> • <a href="/terms">Termos</a> • <a href="/cookies">Cookies</a></p>
        </div>
      </footer>

      {showScroll && (
        <button className="scroll-to-top" onClick={scrollToTop} aria-label="Voltar ao topo">
          ↑
        </button>
      )}
    </div>
  )
}

export default App;
