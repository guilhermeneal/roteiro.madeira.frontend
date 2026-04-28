import React, { useState, useEffect, useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

function HotelReservation() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showBooking, setShowBooking] = useState(false);
  const [filter, setFilter] = useState('Todas');
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    fetch('/hotels.json')
      .then(res => res.json())
      .then(data => setHotels(data))
      .catch(err => console.error('Failed to fetch hotels:', err));
  }, []);

  const handleBook = (hotel) => {
    setSelectedHotel(hotel);
    setShowBooking(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      addToast('Por favor selecione as datas', 'error');
      return;
    }
    addToast(`Reserva confirmada para ${selectedHotel.name}!`, 'success');
    setShowBooking(false);
    setSelectedHotel(null);
    setCheckIn('');
    setCheckOut('');
    setGuests(1);
  };

  const filteredHotels = filter === 'Todas' ? hotels : hotels.filter(hotel => hotel.category === filter);

  const renderStars = (stars) => {
    return '⭐'.repeat(stars);
  };

  return (
    <div className="container py-5 fade-in">
      <div className="hero-banner mb-5" style={{ padding: '60px 20px' }}>
        <h1>Reservas de Hotéis na Madeira</h1>
        <p className="lead">Encontra a acomodação perfeita para a tua estadia</p>
      </div>

      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <label className="form-label small text-muted mb-2">Filtrar por categoria:</label>
        <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>Todas</option>
          <option value="luxo">Luxo</option>
          <option value="moderno">Moderno</option>
          <option value="económico">Económico</option>
          <option value="ecológico">Ecológico</option>
          <option value="família">Família</option>
        </select>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredHotels.map(hotel => (
          <div className="col" key={hotel.id}>
            <div className="card product-card h-100 border-0">
              <img src={hotel.image} alt={hotel.name} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body p-4">
                <h5 className="card-title mb-2">{hotel.name}</h5>
                <p className="text-warning small mb-2">{renderStars(hotel.stars)}</p>
                <p className="text-muted small text-capitalize mb-2">{hotel.category}</p>
                <p className="text-muted small mb-2">📍 {hotel.location}</p>
                <p className="product-price mb-2">
                  {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(hotel.price)}/noite
                </p>
                <div className="small text-muted mb-3">
                  <div>Comodidades: {hotel.amenities.join(', ')}</div>
                </div>
                <p className="small text-muted mb-3">{hotel.description}</p>
                <button 
                  className="btn btn-green w-100 py-2 fw-bold"
                  onClick={() => handleBook(hotel)}
                  disabled={!hotel.available}
                >
                  {hotel.available ? 'Reservar' : 'Indisponível'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showBooking && selectedHotel && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reservar {selectedHotel.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowBooking(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleConfirmBooking}>
                  <div className="mb-3">
                    <label className="form-label">Data de Check-in</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Data de Check-out</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Número de Hóspedes</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      min="1"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Preço Total</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={checkIn && checkOut ? `${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(selectedHotel.price * Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))}` : ''}
                      readOnly
                    />
                  </div>
                  <button type="submit" className="btn btn-green w-100">Confirmar Reserva</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelReservation;
