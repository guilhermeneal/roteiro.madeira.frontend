import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar({ searchQuery, setSearchQuery }) {
  const { cartCount } = useContext(CartContext);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isBumped, setIsBumped] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (cartCount === 0) return;
    setIsBumped(true);
    const timer = setTimeout(() => setIsBumped(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav className="custom-navbar d-flex justify-content-between align-items-center">
      {/* Brand */}
      <Link to="/" className="logo text-decoration-none d-flex align-items-center" aria-label="Roteiro Turístico - Madeira Home">
        <span style={{ fontSize: '1.6rem' }} aria-hidden="true">🧭</span>
        <span className="brand-title">Roteiros</span>
      </Link>

      {/* Center Search Input — DESKTOP ONLY */}
      {location.pathname === '/' && setSearchQuery && (
        <div className="input-group navbar-search-desktop" style={{ maxWidth: '400px' }}>
          <input 
            id="searchInput"
            type="text" 
            className="form-control search-input" 
            placeholder="Search experiences..." 
            aria-label="Search experiences"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button id="searchBtn" className="btn btn-green search-btn d-flex align-items-center justify-content-center" aria-label="Search">
             <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
               <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
             </svg>
          </button>
          <Link to="/cart.html" className="a11y-focus-link">
            Ir para o carrinho
          </Link>
        </div>
      )}

      {/* Right Controls — DESKTOP ONLY */}
      <div id="authArea" className="d-flex align-items-center gap-3 navbar-actions-desktop">
        <Link to="/feedback.html" className="btn btn-outline-green py-2 px-3">⭐ Feedback</Link>
        {location.pathname === '/checkout' || location.pathname === '/checkout.html' ? (
          <Link to="/cart.html" className="btn btn-outline-green py-2 px-3">Back to Cart</Link>
        ) : (
          <>
            <Link to="/cart.html" className={`cart-link cart-header text-decoration-none me-3 hover-opacity ${isBumped ? 'bump' : ''}`} aria-label={`Shopping Cart, ${cartCount} items`}>
              <span className="me-2" style={{color: 'white'}} aria-hidden="true">🛒</span>
              Cart (<span id="cartCount">{cartCount}</span>)
            </Link>
            {isAuthenticated ? (
              <>
                <span className="text-muted small fw-bold">Hi, {user?.name || 'User'}</span>
                <button id="logoutBtn" className="btn btn-outline-danger py-1 px-2 small" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login.html" className="btn btn-outline-secondary bg-white text-dark py-2 px-3">Login</Link>
                <Link to="/register.html" className="btn btn-green py-2 px-3">Sign Up</Link>
              </>
            )}
          </>
        )}
      </div>

      {/* Hamburger Button — MOBILE ONLY */}
      <button 
        className={`hamburger-btn ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle Menu"
        aria-expanded={mobileOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-close-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">×</button>
        
        {/* Mobile Search */}
        {location.pathname === '/' && setSearchQuery && (
          <div className="mobile-search px-4 mt-5">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search experiences..." 
              aria-label="Search experiences"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Mobile Nav Links */}
        <div className="mobile-nav-links px-4">
          <Link to="/feedback.html" className="btn btn-outline-green w-100 mb-3">⭐ Feedback</Link>
          <Link to="/cart.html" className={`btn btn-outline-green w-100 mb-3 ${isBumped ? 'bump' : ''}`}>
            🛒 Cart ({cartCount})
          </Link>

          {isAuthenticated ? (
            <>
              <div className="mobile-user-info mb-2">Hi, {user?.name || 'User'}</div>
              <button className="btn btn-outline-danger w-100" onClick={() => { logout(); setMobileOpen(false); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login.html" className="btn btn-outline-secondary bg-white text-dark w-100 mb-2">Login</Link>
              <Link to="/register.html" className="btn btn-green w-100">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

