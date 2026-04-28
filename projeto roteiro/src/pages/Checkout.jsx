import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { CartContext } from '../context/CartContext';

function Checkout() {
  const { cartItems, getSubtotal, clearCart, loading } = useContext(CartContext);
  const subtotal = getSubtotal();
  const tax = subtotal * 0.08; 
  const total = subtotal + tax;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', address: '', city: '', state: '', zip: '', phone: '',
    cardName: '', cardNumber: '', expiry: '', cvv: ''
  });

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const orderId = useRef(null);

  useEffect(() => {
    if (!orderId.current) {
      orderId.current = Math.floor(Math.random() * 1000000000000);
    }
    // Redirect if cart is empty as per test case
    if (!loading && cartItems.length === 0 && !orderConfirmed) {
      navigate('/cart.html');
    }
  }, [cartItems, navigate, orderConfirmed, loading]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let newValue = value;

    // Input masking for Credit Card (spaces every 4 digits)
    if (id === 'cardNumber') {
      newValue = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (newValue.length > 19) return;
    }

    // Input masking for Expiry (MM/YY)
    if (id === 'expiry') {
      newValue = value.replace(/\//g, '');
      if (newValue.length > 2) {
        newValue = newValue.substring(0, 2) + '/' + newValue.substring(2, 4);
      }
      if (newValue.length > 5) return;
    }

    setFormData({ ...formData, [id]: newValue });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setOrderConfirmed(true);
    clearCart(); 
  };

  if (orderConfirmed) {
    return (
      <div id="orderConfirmation" className="container py-5 d-flex justify-content-center fade-in">
        <div className="bg-white p-5 rounded shadow text-center mt-5" style={{maxWidth: '500px'}}>
          <div className="mb-3" style={{fontSize: '3rem'}} aria-hidden="true">🎉</div>
          <h1 className="mb-3" style={{color: '#1a3b5c', fontWeight: 'bold'}}>Order Confirmed</h1>
          <p className="text-muted small mb-2">Thank you for your order.</p>
          <p className="text-muted small mb-4">Order ID: <span id="orderId">{orderId.current}</span></p>
          <p className="text-muted mb-4 small">A confirmation email has been sent to your email address.</p>
          <Link to="/index.html" className="btn btn-green px-4 py-2 fw-bold shadow-sm">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 fade-in">
      <h1 className="mb-4" style={{color: '#0c2b4b', fontWeight: 'bold'}}>Checkout</h1>
      <div className="row">
        <div className="col-lg-8">
          <form id="checkoutForm" onSubmit={handlePlaceOrder}>
            <div className="form-section mb-5">
              <h2 className="h4 mb-4" style={{color: '#1a3b5c', fontWeight: 'bold'}}>Shipping Information</h2>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label small text-muted mb-1">First Name</label>
                  <input id="firstName" type="text" className="form-control" value={formData.firstName} onChange={handleInputChange} required/>
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastName" className="form-label small text-muted mb-1">Last Name</label>
                  <input id="lastName" type="text" className="form-control" value={formData.lastName} onChange={handleInputChange} required/>
                </div>
                <div className="col-12">
                  <label htmlFor="address" className="form-label small text-muted mb-1">Street Address</label>
                  <input id="address" type="text" className="form-control" value={formData.address} onChange={handleInputChange} placeholder="123 Main Street" required/>
                </div>
                <div className="col-md-5">
                  <label htmlFor="city" className="form-label small text-muted mb-1">City</label>
                  <input id="city" type="text" className="form-control" value={formData.city} onChange={handleInputChange} required/>
                </div>
                <div className="col-md-4">
                  <label htmlFor="state" className="form-label small text-muted mb-1">State</label>
                  <select id="state" className="form-select" value={formData.state} onChange={handleInputChange} required>
                     <option value="">Select State</option>
                     <option value="Madeira">Madeira</option>
                     <option value="MI">MI</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label small text-muted mb-1">ZIP Code</label>
                  <input id="zip" type="text" className="form-control" value={formData.zip} onChange={handleInputChange} pattern="\d{5}" placeholder="12345" required/>
                </div>
                <div className="col-12 mt-3">
                  <label htmlFor="phone" className="form-label small text-muted mb-1">Phone Number</label>
                  <input id="phone" type="tel" className="form-control" value={formData.phone} onChange={handleInputChange} placeholder="555-123-4567" required/>
                </div>
              </div>
            </div>

            <div className="form-section mb-5">
              <h2 className="h4 mb-4" style={{color: '#1a3b5c', fontWeight: 'bold'}}>Payment Information</h2>
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="cardName" className="form-label small text-muted mb-1">Name on Card</label>
                  <input id="cardName" type="text" className="form-control" value={formData.cardName} onChange={handleInputChange} required/>
                </div>
                <div className="col-12">
                  <label htmlFor="cardNumber" className="form-label small text-muted mb-1">Card Number</label>
                  <input id="cardNumber" type="text" className="form-control" value={formData.cardNumber} onChange={handleInputChange} placeholder="1234 5678 9012 3456" required/>
                </div>
                <div className="col-md-6">
                  <label htmlFor="expiry" className="form-label small text-muted mb-1">Expiration Date</label>
                  <input id="expiry" type="text" className="form-control" value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY" required/>
                </div>
                <div className="col-md-6">
                  <label htmlFor="cvv" className="form-label small text-muted mb-1">CVV</label>
                  <input id="cvv" type="text" className="form-control" value={formData.cvv} onChange={handleInputChange} placeholder="123" required/>
                </div>
              </div>
            </div>

            <button id="placeOrderBtn" type="submit" className="btn btn-green w-100 py-3 mb-5 fw-bold fs-5 shadow">Place Order</button>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="order-summary-sidebar cart-summary sticky-top" style={{top: '20px'}}>
            <h2 className="h5 mb-4" style={{color: '#1a3b5c', fontWeight: 'bold'}}>Order Summary</h2>
            <div className="border-bottom mb-3 pb-2">
              {cartItems.map((item, idx) => (
                <div key={idx} className="order-item d-flex justify-content-between mb-2 small text-muted">
                   <span>{item.product.name} × {item.quantity}</span>
                   <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-between mb-2 text-muted small">
              <span>Subtotal</span>
              <span>$<span id="subtotal">{subtotal.toFixed(2)}</span></span>
            </div>
            <div className="d-flex justify-content-between mb-2 text-muted small">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="d-flex justify-content-between mb-3 border-bottom pb-3 text-muted small">
              <span>Tax (8%)</span>
              <span>$<span id="tax">{tax.toFixed(2)}</span></span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <strong className="fs-5 text-dark">Total</strong>
              <strong className="fs-5 text-dark">$<span id="total">{total.toFixed(2)}</span></strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

