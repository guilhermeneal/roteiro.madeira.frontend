import React, { useState, useEffect, useContext, useMemo } from 'react';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';

function Home({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Todas as Categorias');
  const [priceLimit, setPriceLimit] = useState(200);
  const [sortOrder, setSortOrder] = useState('Nome');

  const { addToCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = (searchQuery || '').trim();
    let result = products.filter(p => {
      if (normalizedQuery && !p.name.toLowerCase().includes(normalizedQuery.toLowerCase())) return false;
      if (category !== 'Todas as Categorias' && p.category !== category) return false;
      if (p.price > priceLimit) return false;
      return true;
    });

    result.sort((a, b) => {
      if (sortOrder === 'Preço') return a.price - b.price;
      return a.name.localeCompare(b.name);
    });
    
    return result;
  }, [products, searchQuery, category, priceLimit, sortOrder]);

  const handleAddToCart = (product) => {
    addToCart(product);
    addToast('Added to cart', 'success');
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    
    return stars;
  };

  return (
    <div className="fade-in">
      <div className="hero-banner hero">
        <h1 className="display-4 fw-bold mb-3">Descubra os <strong>Melhores Roteiros</strong> da Madeira</h1>
        <p className="lead mt-3">Experiências autênticas e inesquecíveis na ilha da eterna primavera</p>
        <button className="btn btn-green btn-lg px-5 py-3">Explorar Roteiros</button>
      </div>
      
      <div className="container mt-4 pb-5">
        <div className="d-flex justify-content-end mb-2">
          <a href="/cart.html" className="small text-decoration-none fw-bold" style={{ color: 'var(--madeira-blue)' }}>
            Ver reservas
          </a>
        </div>
        <div className="bg-white p-3 rounded shadow-sm d-flex gap-4 align-items-center mb-4 flex-wrap">
          <div>
            <label htmlFor="categoryFilter" className="form-label small text-muted mb-1">Categoria:</label>
            <select id="categoryFilter" className="form-select form-select-sm" value={category} onChange={e => setCategory(e.target.value)}>
              <option>Todas as Categorias</option>
              <option value="gastronomia">🍽️ Gastronomia</option>
              <option value="natureza">🌿 Natureza</option>
              <option value="cultura">🏛️ Cultura</option>
            </select>
          </div>
          <div style={{minWidth: '200px'}}>
            <label htmlFor="priceFilter" className="form-label small text-muted mb-1">Preço Máximo: €{priceLimit}</label>
            <input id="priceFilter" type="range" className="form-range" min="0" max="200" step="5" value={priceLimit} onChange={e => setPriceLimit(Number(e.target.value))} />
          </div>
          <div>
            <label htmlFor="sortFilter" className="form-label small text-muted mb-1">Ordenar por:</label>
            <select id="sortFilter" className="form-select form-select-sm" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option>Nome</option>
              <option>Preço</option>
            </select>
          </div>
        </div>

        <h2 className="mb-4 text-center playfair" style={{color: 'var(--madeira-blue-deep)', fontSize: '2.5rem'}}>Nossas Experiências</h2>

        {loading ? (
          <div className="d-flex flex-column align-items-center py-5">
            <div className="loading-spinner mb-3"></div>
            <p className="text-muted">Loading experiences...</p>
          </div>
        ) : (
          <div id="productGrid" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 fade-in">
            {filtered.length > 0 ? filtered.map(product => (
              <div className="col" key={product.id}>
                <div className="card product-card">
                  <div className="card-img-container">
                    <img src={product.image} className="card-img-top" alt={product.name} />
                  </div>
                  <div className="card-body">
                    <div className="card-header">
                      <h3 className="card-title">{product.name}</h3>
                      <span className="category-badge">
                        {product.category === 'gastronomia' && '🍽️ '}
                        {product.category === 'natureza' && '🌿 '}
                        {product.category === 'cultura' && '🏛️ '}
                        {product.category}
                      </span>
                    </div>
                    
                    <div className="rating-section">
                      <div className="stars">
                        {renderStars(product.rating)}
                      </div>
                      <span className="rating-text">
                        {product.rating} ({product.reviews} avaliações)
                      </span>
                    </div>

                    <div className="key-info">
                      <div className="duration">
                        <span className="icon">⏱️</span>
                        <span>{product.duration}</span>
                      </div>
                      <div className="price">
                        <span className="price-amount">
                          {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(product.price)}
                        </span>
                        <span className="price-label">por pessoa</span>
                      </div>
                    </div>

                    <div className={`difficulty-badge ${product.difficulty.toLowerCase()}`}>
                      <span>�</span>
                      <span>Dificuldade: {product.difficulty}</span>
                    </div>

                    <div className="stock-info">
                      <span>✓</span>
                      <span>{product.stock} vagas disponíveis</span>
                    </div>

                    <p className="description">{product.description}</p>
                    
                    <button className="add-to-cart-btn w-100" onClick={() => handleAddToCart(product)}>
                      Reservar Roteiro
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-12 text-center py-5">
                <p className="text-muted">No experiences found with these filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

