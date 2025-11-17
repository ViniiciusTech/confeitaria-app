// backend/server.js - servidor mínimo para testes locais
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend mínimo rodando' })
})

// Produtos de exemplo
const sampleProducts = [
  {
    id: 'prod_1',
    name: 'Bolo de Chocolate',
    category: 'Bolos',
    price: 45.5,
    description: 'Bolo de chocolate delicioso',
    quantity: 10,
    image: null,
    createdAt: new Date(),
  },
  {
    id: 'prod_2',
    name: 'Cupcake de Baunilha',
    category: 'Cupcakes',
    price: 8.0,
    description: 'Cupcake macio e doce',
    quantity: 25,
    image: null,
    createdAt: new Date(),
  }
]

// GET /api/products
app.get('/api/products', (req, res) => {
  // Simular atraso leve
  setTimeout(() => {
    res.json(sampleProducts)
  }, 300)
})

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const p = sampleProducts.find(x => x.id === req.params.id)
  if (!p) return res.status(404).json({ error: 'Produto não encontrado' })
  res.json(p)
})

// Endpoint para criar produto (simples)
app.post('/api/products', (req, res) => {
  const payload = req.body
  const newProduct = { id: `prod_${Date.now()}`, ...payload, createdAt: new Date() }
  sampleProducts.push(newProduct)
  res.status(201).json(newProduct)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚀 Backend mínimo rodando em http://localhost:${PORT}`))
