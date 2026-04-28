import React, { useContext } from 'react';
import { Link } from 'react-router';
import { CartContext } from '../context/CartContext';

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, clearCart, loading } = useContext(CartContext);
  const subtotal = getSubtotal();

  if (loading) {
    return (
      <div className="container py-5 fade-in">
        <h1 className="mb-4 playfair" style={{color: 'var(--madeira-blue-deep)', fontSize: '2.5rem'}}>Roteiros Reservados</h1>
        <div className="text-center py-5">
          <div className="loading-spinner mb-3"></div>
          <p className="text-muted">Carregando roteiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 fade-in">
      <h1 className="mb-4 playfair" style={{color: 'var(--madeira-blue-deep)', fontSize: '2.5rem'}}>Roteiros Reservados</h1>
      
      {cartItems.length === 0 ? (
        <div id="emptyCart" className="alert bg-white shadow-sm border-0 p-4">
           <p className="mb-0">Seu carrinho de roteiros está vazio. <Link to="/index.html" className="text-secondary fw-bold ms-2">Explorar Roteiros</Link></p>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item order-item border-bottom py-3 mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} className="cart-item-img" style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px'}} />
                    <div>
                      <h3 className="mb-1 h5 playfair" style={{color: 'var(--madeira-blue-deep)', fontWeight: 800}}>{item.product.name}</h3>
                      <div className="text-muted small">€{Number(item.product.price).toFixed(2)} por pessoa</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-4">
                    <div className="d-flex align-items-center">
                      <button className="qty-btn btn btn-sm btn-outline-secondary" aria-label="Diminuir quantidade" onClick={() => updateQuantity(item.product.id, -1)}>-</button>
                      <span className="qty-value px-2 fw-bold">{item.quantity}</span>
                      <button className="qty-btn btn btn-sm btn-outline-secondary" aria-label="Aumentar quantidade" onClick={() => updateQuantity(item.product.id, 1)}>+</button>
                    </div>
                    <div className="fw-bold" style={{fontSize: '1.1rem', color: '#333'}}>€{(item.product.price * item.quantity).toFixed(2)}</div>
                    <button className="remove-btn btn btn-sm btn-link text-danger text-decoration-none" aria-label="Remover roteiro" onClick={() => removeFromCart(item.product.id)}>x</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="cart-summary bg-light p-4 rounded shadow-sm order-summary-sidebar">
              <h2 className="mb-4 h5 playfair" style={{color: 'var(--madeira-blue-deep)', fontWeight: 'bold'}}>Resumo da Reserva</h2>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Subtotal</span>
                <span>€<span id="subtotal">{subtotal.toFixed(2)}</span></span>
              </div>
              <div className="d-flex justify-content-between mb-4 border-bottom pb-3 text-muted">
                <span>Taxa de Serviço</span>
                <span>GRÁTIS</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <strong className="fs-5 text-dark">Total</strong>
                <strong className="fs-5 text-dark">€<span id="total">{subtotal.toFixed(2)}</span></strong>
              </div>
              <Link to="/checkout.html" className="btn btn-green w-100 mb-3 fw-bold py-2 shadow-sm">Finalizar Reserva</Link>
              <button 
                id="clearCartBtn"
                className="btn btn-outline-danger w-100 py-2 shadow-sm" 
                onClick={clearCart}
              >
                Limpar Roteiros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

