import React, { useState, useEffect, useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

function CarRental() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [filter, setFilter] = useState('Todas');
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    fetch('/cars.json')
      .then(res => res.json())
      .then(data => setCars(data))
      .catch(err => console.error('Failed to fetch cars:', err));
  }, []);

  const handleBook = (car) => {
    setSelectedCar(car);
    setShowBooking(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!pickupDate || !returnDate) {
      addToast('Por favor selecione as datas', 'error');
      return;
    }
    addToast(`Reserva confirmada para ${selectedCar.name}!`, 'success');
    setShowBooking(false);
    setSelectedCar(null);
    setPickupDate('');
    setReturnDate('');
  };

  const filteredCars = filter === 'Todas' ? cars : cars.filter(car => car.category === filter);

  return (
    <div className="container py-5 fade-in">
      <div className="hero-banner mb-5" style={{ padding: '60px 20px' }}>
        <h1>Aluguer de Carros na Madeira</h1>
        <p className="lead">Explora a ilha com liberdade e conforto</p>
      </div>

      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <label className="form-label small text-muted mb-2">Filtrar por categoria:</label>
        <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>Todas</option>
          <option value="económico">Económico</option>
          <option value="compacto">Compacto</option>
          <option value="SUV">SUV</option>
          <option value="luxo">Luxo</option>
        </select>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredCars.map(car => (
          <div className="col" key={car.id}>
            <div className="card product-card h-100 border-0">
              <img src={car.image} alt={car.name} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body p-4">
                <h5 className="card-title mb-2">{car.name}</h5>
                <p className="text-muted small text-capitalize mb-2">{car.category}</p>
                <p className="product-price mb-2">
                  {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(car.price)}/dia
                </p>
                <div className="small text-muted mb-3">
                  <div>👥 {car.seats} lugares</div>
                  <div>⚙️ {car.transmission}</div>
                  <div>⛽ {car.fuel}</div>
                </div>
                <p className="small text-muted mb-3">{car.description}</p>
                <button 
                  className="btn btn-green w-100 py-2 fw-bold"
                  onClick={() => handleBook(car)}
                  disabled={!car.available}
                >
                  {car.available ? 'Reservar' : 'Indisponível'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showBooking && selectedCar && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reservar {selectedCar.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowBooking(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleConfirmBooking}>
                  <div className="mb-3">
                    <label className="form-label">Data de Levantamento</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Data de Devolução</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Preço Total</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={pickupDate && returnDate ? `${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(selectedCar.price * Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)))}` : ''}
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

export default CarRental;
