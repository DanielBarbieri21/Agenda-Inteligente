# 🚀 Instruções Rápidas

## Como executar o projeto

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar a API fake (JSON Server)
Em um terminal, execute:
```bash
npm run api
```
Ou:
```bash
npx json-server --watch db.json --port 3001
```

### 3. Iniciar o servidor de desenvolvimento
Em outro terminal, execute:
```bash
npm run dev
```

### 4. Acessar a aplicação
Abra seu navegador em: `http://localhost:5173`

## 📝 Estrutura criada

✅ **Componentes:**
- `Navbar.vue` - Barra de navegação com dark mode
- `Calendar.vue` - Calendário interativo
- `ClientCard.vue` - Card de exibição de cliente

✅ **Páginas:**
- `Dashboard.vue` - Dashboard com gráficos e estatísticas
- `Clients.vue` - Gerenciamento de clientes (CRUD)
- `Schedule.vue` - Agendamentos com calendário

✅ **Store (Pinia):**
- `store/clients.js` - Gerenciamento de estado global

✅ **Router:**
- `router/index.js` - Configuração de rotas

✅ **Configurações:**
- TailwindCSS configurado
- Dark mode implementado
- JSON Server configurado

## 🎯 Funcionalidades

- ✅ Dashboard com gráficos (Chart.js)
- ✅ CRUD completo de clientes
- ✅ Calendário de agendamentos
- ✅ Dark/Light mode
- ✅ Design responsivo
- ✅ API REST fake (JSON Server)

## 📦 Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run api` - Inicia o JSON Server

## 🔧 Próximos passos

1. Testar todas as funcionalidades
2. Fazer commit e push para o GitHub
3. (Opcional) Fazer deploy na Vercel/Netlify

---

**Dica:** Mantenha o JSON Server rodando enquanto desenvolve!

