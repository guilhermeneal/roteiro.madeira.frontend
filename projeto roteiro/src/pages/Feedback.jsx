import React, { useState, useEffect, useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({
    name: '',
    rating: 5,
    comment: '',
    category: 'trilho'
  });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('Todas');
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    fetch('/feedbacks.json')
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .catch(err => console.error('Failed to fetch feedbacks:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newFeedback.name || !newFeedback.comment) {
      addToast('Por favor preencha todos os campos', 'error');
      return;
    }
    
    const feedback = {
      id: Date.now(),
      ...newFeedback,
      date: new Date().toISOString().split('T')[0]
    };
    
    setFeedbacks([feedback, ...feedbacks]);
    addToast('Obrigado pelo teu feedback!', 'success');
    setShowForm(false);
    setNewFeedback({
      name: '',
      rating: 5,
      comment: '',
      category: 'trilho'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? 'var(--madeira-gold)' : '#e0e0e0', fontSize: '1.2rem', textShadow: i < rating ? '0 0 5px rgba(255, 215, 0, 0.3)' : 'none' }}>★</span>
    ));
  };

  const filteredFeedbacks = filter === 'Todas' ? feedbacks : feedbacks.filter(f => f.category === filter);

  return (
    <div className="container py-5 fade-in">
      <div className="hero-banner mb-5 text-center" style={{ padding: '80px 20px', borderRadius: 'var(--border-radius-lg)', borderBottom: 'none' }}>
        <h1 className="playfair">Experiências Vividas</h1>
        <p className="lead">Partilhe a sua jornada na ilha da eterna primavera</p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="bg-white p-3 rounded shadow-sm">
          <label className="form-label small text-muted mb-2">Filtrar por categoria:</label>
          <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>Todas</option>
            <option value="trilho">Trilho</option>
            <option value="gastronomia">Gastronomia</option>
            <option value="cultura">Cultura</option>
            <option value="natureza">Natureza</option>
          </select>
        </div>
        <button className="btn btn-green" onClick={() => setShowForm(true)}>
          Adicionar Feedback
        </button>
      </div>

      <div className="row g-4">
        {filteredFeedbacks.map(feedback => (
          <div className="col-md-6 col-lg-4" key={feedback.id}>
            <div className="card product-card h-100 border-0">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title mb-0 playfair" style={{color: 'var(--madeira-blue-deep)', fontWeight: 800}}>{feedback.name}</h5>
                  <span className="badge bg-light text-muted small">{feedback.date}</span>
                </div>
                <div className="mb-2">{renderStars(feedback.rating)}</div>
                <p className="text-muted small text-capitalize mb-3">
                  <span className="badge bg-success">{feedback.category}</span>
                </p>
                <p className="card-text small">{feedback.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Adicionar Feedback</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={newFeedback.name}
                      onChange={(e) => setNewFeedback({...newFeedback, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Classificação</label>
                    <select 
                      className="form-select" 
                      value={newFeedback.rating}
                      onChange={(e) => setNewFeedback({...newFeedback, rating: parseInt(e.target.value)})}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ Excelente</option>
                      <option value={4}>⭐⭐⭐⭐ Muito Bom</option>
                      <option value={3}>⭐⭐⭐ Bom</option>
                      <option value={2}>⭐⭐ Regular</option>
                      <option value={1}>⭐ Fraco</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Categoria</label>
                    <select 
                      className="form-select" 
                      value={newFeedback.category}
                      onChange={(e) => setNewFeedback({...newFeedback, category: e.target.value})}
                    >
                      <option value="trilho">Trilho</option>
                      <option value="gastronomia">Gastronomia</option>
                      <option value="cultura">Cultura</option>
                      <option value="natureza">Natureza</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comentário</label>
                    <textarea 
                      className="form-control" 
                      rows="4"
                      value={newFeedback.comment}
                      onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-green w-100">Enviar Feedback</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feedback;
