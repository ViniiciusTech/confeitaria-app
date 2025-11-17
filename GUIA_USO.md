# Guia de Uso - Confeitaria App

## 🔑 Como Testar a Aplicação

### **1. CRIAR CONTA DE CLIENTE**

1. Clique em **"Criar conta"** na tela de login
2. Preencha os dados:
   - **Nome:** Seu nome
   - **Email:** cliente@email.com
   - **Senha:** senha123
   - **Confirmar Senha:** senha123
   - **Tipo:** Selecione **"Cliente"**
3. Clique em **"Criar Conta"**
4. Faça login com essas credenciais

### **2. CRIAR CONTA DE VENDEDOR**

1. Clique em **"Criar conta"** na tela de login
2. Preencha os dados:
   - **Nome:** Seu nome
   - **Email:** vendedor@email.com
   - **Senha:** senha123
   - **Confirmar Senha:** senha123
   - **Tipo:** Selecione **"Vendedor"**
3. Clique em **"Criar Conta"**
4. Faça login com essas credenciais

## 🎯 Telas Disponíveis

### **Para Cliente:**
- **Produtos:** Visualiza todos os bolos disponíveis
- **Contato:** Formulário para entrar em contato
- **Localização:** Mapa com localização da confeitaria
- **Informações:** Sobre a confeitaria, missão, visão e valores

### **Para Vendedor:**
- **Inventário:** Gerencia os produtos disponíveis
- **Relatórios:** Visualiza estatísticas de vendas

## 🔧 Dados de Teste do Firebase

**Coleção users:**
- user1: email teste@email.com, tipo cliente

**Coleção products:**
- prod1: Bolo de Chocolate, R$ 50.00

**Coleção sales:**
- sale1: Venda de teste

## ⚠️ Observações

- Todos os dados são salvos no Firebase
- Cada login cria uma nova sessão
- Logout ocorre automaticamente ao fechar a app
- Os produtos podem ser consultados por qualquer usuário logado
