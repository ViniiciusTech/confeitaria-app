# 🎂 Confeitaria App

Aplicação React Native para gerenciamento de confeitaria com duas personas: Cliente e Vendedor.

## ✅ Correções Aplicadas

- ✅ Corrigido link "Criar conta" no LoginScreen (era "Register", agora é "Signup")
- ✅ Corrigido estilo do botão "Mostrar/Ocultar senha"
- ✅ Firebase configurado com Firestore Database
- ✅ Autenticação email/password implementada
- ✅ Sistema de navegação por tipo de usuário

## 🚀 Para Iniciar

```bash
npm start -- --port 8082
```

Depois pressione `w` para abrir no navegador, ou acesse: `http://localhost:8082`

## 📝 Dados de Teste

### Cliente:
- Email: cliente@email.com
- Senha: senha123

### Vendedor:
- Email: vendedor@email.com
- Senha: senha123

## 🎯 Funcionalidades

### Cliente:
- Visualizar produtos
- Entrar em contato
- Ver localização
- Informações sobre a confeitaria

### Vendedor:
- Gerenciar inventário
- Visualizar relatórios de vendas

## 🔧 Tecnologias Usadas

- React Native
- Expo
- Firebase (Auth + Firestore)
- React Navigation
- React Native Maps

## 📦 Dependências Principais

```json
{
  "@react-navigation/bottom-tabs": "^7.0.0",
  "@react-navigation/native": "^7.0.0",
  "@react-navigation/native-stack": "^7.0.0",
  "firebase": "^10.7.0",
  "expo": "^51.0.0",
  "react-native": "0.74.5"
}
```

## 🐛 Troubleshooting

Se encontrar erros:

1. **Porta ocupada:** Use `npm start -- --port 8083` para usar outra porta
2. **Erro de dependências:** Execute `npm install --legacy-peer-deps`
3. **Cache corrompido:** Delete `node_modules` e execute `npm install` novamente

## 📱 Como Criar Conta

1. Clique em **"Criar conta"**
2. Escolha o tipo: **Cliente** ou **Vendedor**
3. Preencha todos os campos
4. Clique em **"Criar Conta"**
5. Faça login com suas credenciais

---

**Versão:** 1.0.0  
**Última atualização:** 16 de novembro de 2025
