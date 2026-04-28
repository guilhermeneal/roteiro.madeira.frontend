const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Mock Data - Roteiros Turísticos da Madeira
const products = [
  // NOTE: ids/prices align with Playwright suite expectations (e.g. product 1 = 79.99)
  { 
    id: 1, 
    name: "Trilho Pico do Areeiro - Pico Ruivo", 
    category: "natureza", 
    price: 79.99, 
    stock: 5, 
    image: "/images/Pico-do-Areeiro-Isla-Madeira.jpg",
    duration: "6 horas",
    difficulty: "Médio",
    rating: 4.8,
    reviews: 127,
    description: "Trilho deslumbrante entre as duas montanhas mais altas da Madeira com vistas espetaculares."
  },
  { 
    id: 2, 
    name: "Experiência Gastronômica Madeirense", 
    category: "gastronomia", 
    price: 89.99, 
    stock: 12, 
    image: "/images/lapas.jpg",
    duration: "4 horas",
    difficulty: "Fácil",
    rating: 4.9,
    reviews: 203,
    description: "Degustação dos pratos típicos da Madeira incluindo bolo do caco, lapas e vinho da terra."
  },
  { 
    id: 3, 
    name: "Mergulho na Reserva Natural do Garajau", 
    category: "natureza", 
    price: 24.99, 
    stock: 50, 
    image: "/images/garajau.jpeg",
    duration: "3 horas",
    difficulty: "Fácil",
    rating: 4.6,
    reviews: 89,
    description: "Mergulho nas águas cristalinas da reserva marinha com observação de vida marinha."
  },
  { 
    id: 4, 
    name: "Observação de Golfinhos e Baleias", 
    category: "natureza", 
    price: 49.99, 
    stock: 25, 
    image: "/images/golfinhos.jpeg",
    duration: "3 horas",
    difficulty: "Fácil",
    rating: 4.7,
    reviews: 156,
    description: "Viagem de catamarã para observação de golfinhos e baleias na costa da Madeira."
  },
  { 
    id: 5, 
    name: "Tour Cultural pelas Casas Coladas de Santana", 
    category: "cultura", 
    price: 129.99, 
    stock: 8, 
    image: "/images/santana.jpg",
    duration: "8 horas",
    difficulty: "Fácil",
    rating: 4.8,
    reviews: 94,
    description: "Visita completa às famosas casas coladas, museus locais e tradições madeirenses."
  },
  { 
    id: 6, 
    name: "Circuito Completo da Ilha Ocidental", 
    category: "cultura", 
    price: 69.99, 
    stock: 20, 
    image: "/images/Ilha-da-Madeira-Camara-dos-Lobos-2-1.jpg",
    duration: "10 horas",
    difficulty: "Médio",
    rating: 4.5,
    reviews: 178,
    description: "Tour completo pela costa oeste incluindo Cabo Girão, Câmara de Lobos e Porto Moniz."
  }
];

let cart = [];
let users = [{ email: 'demo@madeira.com', password: 'demo123', name: 'Demo User' }];

// Helper to calculate cart total
const calculateCart = () => {
  const items = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  });
  const total = items.reduce((sum, item) => sum + (item.product ? item.product.price * item.quantity : 0), 0);
  return { items, total: total.toFixed(2) };
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Products APIs
app.get('/api/products', (req, res) => {
  let filtered = [...products];
  const { category, search } = req.query;
  
  if (category && category !== 'Todas as Categorias') {
    filtered = filtered.filter(p => p.category === category);
  }
  
  const normalizedSearch = typeof search === 'string' ? search.trim() : '';
  if (normalizedSearch) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(normalizedSearch.toLowerCase()));
  }
  
  res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Auth APIs
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ message: 'Login successful', user: { email: user.email, name: user.name } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  users.push({ email, password, name });
  res.status(201).json({ message: 'Registration successful', user: { email, name } });
});

// Cart APIs
app.get('/api/cart', (req, res) => {
  res.json(calculateCart());
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += (quantity || 1);
  } else {
    cart.push({ productId, quantity: quantity || 1 });
  }
  res.status(201).json({ message: 'Added to cart', cart });
});

app.put('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;
  const item = cart.find(item => item.productId === id);
  if (item) {
    item.quantity = quantity;
    res.json({ message: 'Quantity updated', cart });
  } else {
    res.status(404).json({ error: 'Item not found in cart' });
  }
});

app.delete('/api/cart', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared' });
});

app.delete('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  cart = cart.filter(item => item.productId !== id);
  res.json({ message: 'Item removed', cart });
});

app.listen(port, () => {
  console.log(`Mock API listening at http://localhost:${port}`);
});

