import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

function Login({ register = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useContext(ToastContext);

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');

    if (register) {
      if (!name || !email || !password) {
        setError('All fields are required');
        return;
      }
      if (email.trim().toLowerCase() === 'demo@madeira.com') {
        setError('Email already registered');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      addToast('Account created', 'success');
      navigate('/');
    } else {
      if (!email || !password) {
        setError('Email and password required');
        return;
      }
      if (email === 'demo@madeira.com' && password === 'demo123') {
        login({ email, name: 'Demo User' });
        addToast('Login successful', 'success');
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center fade-in">
      <div className="bg-white p-5 rounded-4 shadow-lg border" style={{maxWidth: '450px', width: '100%', borderColor: 'rgba(0, 51, 160, 0.1)'}}>
        <h1 className="text-center mb-4 playfair" style={{color: 'var(--madeira-blue-deep)', fontSize: '2rem'}}>
          {register ? 'Criar Conta' : 'Acesse Madeira'}
        </h1>

        {error && <div id="errorMessage" className="alert alert-danger p-2 text-center small mb-4">{error}</div>}

        <form onSubmit={handleAuth}>
          {register && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-muted small fw-bold">Name</label>
              <input 
                id="name" 
                type="text" 
                className="form-control" 
                placeholder="Your Name"
                value={name} 
                onChange={e => setName(e.target.value)} 
                required
              />
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-muted small fw-bold">Email</label>
            <input 
              id="email"
              type="email" 
              className="form-control p-2" 
              placeholder="email@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label text-muted small fw-bold">Password</label>
            <input 
              id="password"
              type="password" 
              className="form-control p-2" 
              placeholder="Your Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {register && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label text-muted small fw-bold">Confirm Password</label>
              <input 
                id="confirmPassword" 
                type="password" 
                className="form-control" 
                placeholder="Confirm Password"
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required
              />
            </div>
          )}
          <button type="submit" className="btn btn-green w-100 py-2 fw-bold mb-4 shadow-sm">
            {register ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="text-center text-muted small mb-4">
          {register ? (
            <>Already have an account? <a href="/login.html" className="text-success fw-bold text-decoration-none">Login here</a></>
          ) : (
            <>Don't have an account? <a href="/register.html" className="text-success fw-bold text-decoration-none">Sign up here</a></>
          )}
        </p>

        {!register && (
          <div className="demo-credentials bg-light p-3 rounded text-muted small border">
            <strong className="d-block mb-1">Demo Credentials:</strong>
            <div className="d-flex justify-content-between">
              <span>Email: <span id="demoEmail">demo@madeira.com</span></span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Password: <span id="demoPassword">demo123</span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;

