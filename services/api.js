// Serviço de API para operações CRUD com o backend
// Este serviço utiliza o serviço HTTP base para todas as requisições

import http from './http';

// ============ PRODUTOS ============

/**
 * Buscar todos os produtos
 * GET /products
 */
export const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = queryParams ? `/products?${queryParams}` : '/products';
  return await http.get(endpoint);
};

/**
 * Buscar produto por ID
 * GET /products/:id
 */
export const getProductById = async (id) => {
  return await http.get(`/products/${id}`);
};

/**
 * Criar novo produto
 * POST /products
 */
export const createProduct = async (productData) => {
  return await http.post('/products', productData);
};

/**
 * Atualizar produto completo
 * PUT /products/:id
 */
export const updateProduct = async (id, productData) => {
  return await http.put(`/products/${id}`, productData);
};

/**
 * Atualizar produto parcialmente
 * PATCH /products/:id
 */
export const patchProduct = async (id, productData) => {
  return await http.patch(`/products/${id}`, productData);
};

/**
 * Deletar produto
 * DELETE /products/:id
 */
export const deleteProduct = async (id) => {
  return await http.delete(`/products/${id}`);
};

/**
 * Upload de imagem de produto
 * POST /products/:id/image
 */
export const uploadProductImage = async (productId, imageFile) => {
  return await http.uploadFile(
    `/products/${productId}/image`,
    imageFile,
    'image'
  );
};

// ============ PEDIDOS ============

/**
 * Buscar todos os pedidos (admin/vendor)
 * GET /orders
 */
export const getOrders = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = queryParams ? `/orders?${queryParams}` : '/orders';
  return await http.get(endpoint);
};

/**
 * Buscar meus pedidos (cliente)
 * GET /orders/my-orders
 */
export const getMyOrders = async () => {
  return await http.get('/orders/my-orders');
};

/**
 * Buscar pedido por ID
 * GET /orders/:id
 */
export const getOrderById = async (id) => {
  return await http.get(`/orders/${id}`);
};

/**
 * Criar novo pedido
 * POST /orders
 */
export const createOrder = async (orderData) => {
  return await http.post('/orders', orderData);
};

/**
 * Atualizar status do pedido
 * PATCH /orders/:id/status
 */
export const updateOrderStatus = async (id, status) => {
  return await http.patch(`/orders/${id}/status`, { status });
};

/**
 * Cancelar pedido
 * DELETE /orders/:id
 */
export const cancelOrder = async (id) => {
  return await http.delete(`/orders/${id}`);
};

// ============ USUÁRIOS ============

/**
 * Buscar perfil do usuário
 * GET /users/profile
 */
export const getUserProfile = async () => {
  return await http.get('/users/profile');
};

/**
 * Atualizar perfil do usuário
 * PUT /users/profile
 */
export const updateUserProfile = async (profileData) => {
  return await http.put('/users/profile', profileData);
};

/**
 * Buscar endereços do usuário
 * GET /users/addresses
 */
export const getUserAddresses = async () => {
  return await http.get('/users/addresses');
};

/**
 * Adicionar novo endereço
 * POST /users/addresses
 */
export const addUserAddress = async (addressData) => {
  return await http.post('/users/addresses', addressData);
};

/**
 * Atualizar endereço
 * PUT /users/addresses/:id
 */
export const updateUserAddress = async (id, addressData) => {
  return await http.put(`/users/addresses/${id}`, addressData);
};

/**
 * Deletar endereço
 * DELETE /users/addresses/:id
 */
export const deleteUserAddress = async (id) => {
  return await http.delete(`/users/addresses/${id}`);
};

// ============ PAGAMENTO ============

/**
 * Processar pagamento
 * POST /payments/process
 */
export const processPayment = async (paymentData) => {
  return await http.post('/payments/process', paymentData);
};

/**
 * Buscar histórico de pagamentos
 * GET /payments/history
 */
export const getPaymentHistory = async () => {
  return await http.get('/payments/history');
};

/**
 * Verificar status de pagamento
 * GET /payments/:transactionId
 */
export const checkPaymentStatus = async (transactionId) => {
  return await http.get(`/payments/${transactionId}`);
};

// ============ RELATÓRIOS (VENDOR) ============

/**
 * Buscar vendas do vendor
 * GET /reports/sales
 */
export const getVendorSales = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = queryParams ? `/reports/sales?${queryParams}` : '/reports/sales';
  return await http.get(endpoint);
};

/**
 * Buscar produtos mais vendidos
 * GET /reports/top-products
 */
export const getTopProducts = async (limit = 10) => {
  return await http.get(`/reports/top-products?limit=${limit}`);
};

/**
 * Exportar relatório de vendas
 * GET /reports/export
 */
export const exportSalesReport = async (format = 'pdf') => {
  return await http.downloadFile(
    `/reports/export?format=${format}`,
    `relatorio_vendas.${format}`
  );
};

// ============ AVALIAÇÕES ============

/**
 * Buscar avaliações de um produto
 * GET /reviews/product/:id
 */
export const getProductReviews = async (productId) => {
  return await http.get(`/reviews/product/${productId}`);
};

/**
 * Criar avaliação
 * POST /reviews
 */
export const createReview = async (reviewData) => {
  return await http.post('/reviews', reviewData);
};

/**
 * Atualizar avaliação
 * PUT /reviews/:id
 */
export const updateReview = async (id, reviewData) => {
  return await http.put(`/reviews/${id}`, reviewData);
};

/**
 * Deletar avaliação
 * DELETE /reviews/:id
 */
export const deleteReview = async (id) => {
  return await http.delete(`/reviews/${id}`);
};

// ============ CATEGORIAS ============

/**
 * Buscar todas as categorias
 * GET /categories
 */
export const getCategories = async () => {
  return await http.get('/categories');
};

/**
 * Criar categoria (admin)
 * POST /categories
 */
export const createCategory = async (categoryData) => {
  return await http.post('/categories', categoryData);
};

/**
 * Atualizar categoria (admin)
 * PUT /categories/:id
 */
export const updateCategory = async (id, categoryData) => {
  return await http.put(`/categories/${id}`, categoryData);
};

/**
 * Deletar categoria (admin)
 * DELETE /categories/:id
 */
export const deleteCategory = async (id) => {
  return await http.delete(`/categories/${id}`);
};

// ============ CUPONS ============

/**
 * Validar cupom
 * POST /coupons/validate
 */
export const validateCoupon = async (couponCode) => {
  return await http.post('/coupons/validate', { code: couponCode });
};

/**
 * Buscar cupons disponíveis
 * GET /coupons
 */
export const getAvailableCoupons = async () => {
  return await http.get('/coupons');
};

// ============ SUPORTE ============

/**
 * Criar ticket de suporte
 * POST /support/tickets
 */
export const createSupportTicket = async (ticketData) => {
  return await http.post('/support/tickets', ticketData);
};

/**
 * Buscar meus tickets
 * GET /support/tickets
 */
export const getMyTickets = async () => {
  return await http.get('/support/tickets');
};

/**
 * Enviar mensagem em ticket
 * POST /support/tickets/:id/messages
 */
export const sendTicketMessage = async (ticketId, message) => {
  return await http.post(`/support/tickets/${ticketId}/messages`, { message });
};

export default {
  // Produtos
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  uploadProductImage,
  // Pedidos
  getOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  // Usuários
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  // Pagamento
  processPayment,
  getPaymentHistory,
  checkPaymentStatus,
  // Relatórios
  getVendorSales,
  getTopProducts,
  exportSalesReport,
  // Avaliações
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  // Categorias
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  // Cupons
  validateCoupon,
  getAvailableCoupons,
  // Suporte
  createSupportTicket,
  getMyTickets,
  sendTicketMessage,
};
