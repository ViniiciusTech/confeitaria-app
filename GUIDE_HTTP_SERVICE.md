# Guia de Uso - Serviço HTTP da Aplicação

## Visão Geral

A aplicação possui um sistema de requisições HTTP robusto com suporte para autenticação automática, tratamento de erros e interceptadores. Existem dois arquivos principais:

- **`services/http.js`** - Serviço HTTP base com métodos GET, POST, PUT, PATCH, DELETE e utilitários
- **`services/api.js`** - Serviço de API com funções prontas para cada endpoint do backend

## Como Usar

### 1. Usando o Serviço HTTP Direto

```javascript
import http from '../../services/http';

// GET
const result = await http.get('/products');
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}

// POST
const newProduct = await http.post('/products', {
  name: 'Bolo de Chocolate',
  price: 50.00,
  category: 'Bolos'
});

// PUT (substituir completo)
const updated = await http.put('/products/123', {
  name: 'Bolo de Chocolate',
  price: 55.00,
  category: 'Bolos'
});

// PATCH (atualizar parcial)
const patched = await http.patch('/products/123', { price: 55.00 });

// DELETE
const deleted = await http.delete('/products/123');
```

### 2. Usando o Serviço de API (Recomendado)

```javascript
import api from '../../services/api';

// Buscar produtos
const result = await api.getProducts({ category: 'Bolos', limit: 10 });
if (result.success) {
  console.log(result.data);
}

// Criar produto
const newProduct = await api.createProduct({
  name: 'Cupcake de Vanilla',
  price: 20.00,
  category: 'Cupcakes',
  description: 'Delicioso cupcake'
});

// Atualizar produto
const updated = await api.updateProduct('123', {
  name: 'Cupcake de Vanilla Premium',
  price: 25.00
});

// Deletar produto
const deleted = await api.deleteProduct('123');

// Upload de imagem
const imageResult = await api.uploadProductImage('123', imageFile);

// Criar pedido
const order = await api.createOrder({
  items: [{ productId: '123', quantity: 2 }],
  shippingAddress: '...'
});

// Buscar meus pedidos
const myOrders = await api.getMyOrders();
```

### 3. Estrutura de Resposta

Todas as requisições retornam um objeto com a seguinte estrutura:

```javascript
{
  success: boolean,    // true se sucesso, false se erro
  data: any,          // Dados retornados pelo servidor (se sucesso)
  error: string,      // Mensagem de erro (se falha)
  status: number      // Status HTTP da requisição
}
```

### 4. Autenticação Automática

O serviço HTTP adiciona automaticamente o token Firebase no header de autorização:

```javascript
// O token é adicionado automaticamente a todos os requests
// Header: Authorization: Bearer <token>
```

### 5. Tratamento de Erros

Os interceptadores tratam automaticamente os erros:

- **401 Unauthorized** - Sessão expirada (não autenticado)
- **403 Forbidden** - Sem permissão para acessar recurso
- **Erros de rede** - Sem resposta do servidor

Todos os erros são logados no console automaticamente.

### 6. Exemplos de Uso em Componentes

#### Exemplo 1: Buscar e Exibir Produtos

```javascript
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import api from '../../services/api';

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const result = await api.getProducts({ category: 'Bolos' });
        if (result.success) {
          setProducts(result.data);
        } else {
          console.error('Erro:', result.error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      keyExtractor={(item) => item.id}
    />
  );
}
```

#### Exemplo 2: Criar Produto com Upload de Imagem

```javascript
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import api from '../../services/api';

export default function CreateProductScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateProduct = async (imageFile) => {
    try {
      setLoading(true);

      // 1. Criar produto
      const createResult = await api.createProduct({
        name,
        price: parseFloat(price),
        category: 'Bolos'
      });

      if (!createResult.success) {
        Alert.alert('Erro', 'Falha ao criar produto');
        return;
      }

      const productId = createResult.data.id;

      // 2. Upload de imagem
      if (imageFile) {
        const uploadResult = await api.uploadProductImage(productId, imageFile);
        if (!uploadResult.success) {
          console.warn('Falha ao fazer upload da imagem');
        }
      }

      Alert.alert('Sucesso', 'Produto criado com sucesso!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput placeholder="Nome do produto" value={name} onChangeText={setName} />
      <TextInput placeholder="Preço" value={price} onChangeText={setPrice} />
      <TouchableOpacity 
        disabled={loading}
        onPress={() => handleCreateProduct(null)}
      >
        <Text>{loading ? 'Criando...' : 'Criar Produto'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

#### Exemplo 3: Criar e Acompanhar Pedido

```javascript
import api from '../../services/api';

export default function CheckoutScreen() {
  const handleCheckout = async (cartItems, address) => {
    try {
      // Criar pedido
      const orderResult = await api.createOrder({
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: address,
        paymentMethod: 'credit_card'
      });

      if (!orderResult.success) {
        Alert.alert('Erro', orderResult.error);
        return;
      }

      const orderId = orderResult.data.id;

      // Processar pagamento
      const paymentResult = await api.processPayment({
        orderId,
        amount: orderResult.data.total,
        method: 'credit_card'
      });

      if (!paymentResult.success) {
        // Cancelar pedido se pagamento falhar
        await api.cancelOrder(orderId);
        Alert.alert('Erro', 'Falha ao processar pagamento');
        return;
      }

      Alert.alert('Sucesso', 'Pedido criado com sucesso!');
      
      // Atualizar status para pago
      await api.updateOrderStatus(orderId, 'paid');
    } catch (error) {
      console.error('Erro ao fazer checkout:', error);
    }
  };

  return (
    // ... componente
  );
}
```

## Métodos Disponíveis no Serviço HTTP

### GET
```javascript
http.get(endpoint, config)
```

### POST
```javascript
http.post(endpoint, data, config)
```

### PUT
```javascript
http.put(endpoint, data, config)
```

### PATCH
```javascript
http.patch(endpoint, data, config)
```

### DELETE
```javascript
http.delete(endpoint, config)
```

### HEAD
```javascript
http.head(endpoint, config)
```

### Upload de Arquivo
```javascript
http.uploadFile(endpoint, file, fieldName, additionalData)
```

### Download de Arquivo
```javascript
http.downloadFile(endpoint, filename)
```

## Configurar URL Base da API

Se precisar mudar a URL base da API:

```javascript
import http from '../../services/http';

http.setBaseURL('https://api.example.com');
```

## Adicionar Headers Customizados

```javascript
import http from '../../services/http';

http.setHeader('X-Custom-Header', 'valor');
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

## Métodos de API Disponíveis

### Produtos
- `getProducts(filters)` - GET /products
- `getProductById(id)` - GET /products/:id
- `createProduct(data)` - POST /products
- `updateProduct(id, data)` - PUT /products/:id
- `patchProduct(id, data)` - PATCH /products/:id
- `deleteProduct(id)` - DELETE /products/:id
- `uploadProductImage(productId, file)` - POST /products/:id/image

### Pedidos
- `getOrders(filters)` - GET /orders
- `getMyOrders()` - GET /orders/my-orders
- `getOrderById(id)` - GET /orders/:id
- `createOrder(data)` - POST /orders
- `updateOrderStatus(id, status)` - PATCH /orders/:id/status
- `cancelOrder(id)` - DELETE /orders/:id

### Usuários
- `getUserProfile()` - GET /users/profile
- `updateUserProfile(data)` - PUT /users/profile
- `getUserAddresses()` - GET /users/addresses
- `addUserAddress(data)` - POST /users/addresses
- `updateUserAddress(id, data)` - PUT /users/addresses/:id
- `deleteUserAddress(id)` - DELETE /users/addresses/:id

### Pagamento
- `processPayment(data)` - POST /payments/process
- `getPaymentHistory()` - GET /payments/history
- `checkPaymentStatus(transactionId)` - GET /payments/:transactionId

### Relatórios
- `getVendorSales(filters)` - GET /reports/sales
- `getTopProducts(limit)` - GET /reports/top-products
- `exportSalesReport(format)` - GET /reports/export

### Avaliações
- `getProductReviews(productId)` - GET /reviews/product/:id
- `createReview(data)` - POST /reviews
- `updateReview(id, data)` - PUT /reviews/:id
- `deleteReview(id)` - DELETE /reviews/:id

### Categorias
- `getCategories()` - GET /categories
- `createCategory(data)` - POST /categories
- `updateCategory(id, data)` - PUT /categories/:id
- `deleteCategory(id)` - DELETE /categories/:id

### Cupons
- `validateCoupon(code)` - POST /coupons/validate
- `getAvailableCoupons()` - GET /coupons

### Suporte
- `createSupportTicket(data)` - POST /support/tickets
- `getMyTickets()` - GET /support/tickets
- `sendTicketMessage(ticketId, message)` - POST /support/tickets/:id/messages

## Boas Práticas

1. **Sempre verificar sucesso da requisição**
```javascript
const result = await api.getProducts();
if (result.success) {
  // processar dados
} else {
  // tratar erro
}
```

2. **Usar try/finally para gerenciar loading**
```javascript
try {
  setLoading(true);
  const result = await api.getProducts();
} finally {
  setLoading(false);
}
```

3. **Adicionar timeouts e tratamento de timeout**
```javascript
const result = await Promise.race([
  api.getProducts(),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 10000)
  )
]).catch(error => ({
  success: false,
  error: error.message
}));
```

4. **Implementar retry logic para requisições críticas**
```javascript
async function fetchWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await fn();
    if (result.success) return result;
    if (i < maxRetries - 1) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
  }
  return { success: false, error: 'Máximo de tentativas atingido' };
}
```

## Troubleshooting

### Erro: "401 Unauthorized"
- Faça login novamente
- Verifique se o token Firebase está válido
- Limpe o cache da aplicação

### Erro: "CORS"
- Configure CORS no backend
- Verifique a URL base da API

### Erro: "Timeout"
- Verifique sua conexão de internet
- Aumente o timeout (padrão: 10s)

### Erro: "Network Error"
- Verifique se o backend está rodando
- Verifique a URL base da API

