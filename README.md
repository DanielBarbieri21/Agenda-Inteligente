# 📅 Agenda Inteligente - Sistema de Agendamentos

Um sistema moderno e completo de gerenciamento de agendamentos e clientes, desenvolvido com Vue 3 e tecnologias de ponta.

![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-2.1-FFD859?logo=vue.js&logoColor=white)

## ✨ Funcionalidades

- 📊 **Dashboard Interativo** com gráficos e estatísticas
- 👥 **Gerenciamento de Clientes** (CRUD completo)
- 📅 **Calendário de Agendamentos** visual e intuitivo
- 🌙 **Dark Mode / Light Mode** com persistência
- 📱 **Design Responsivo** para todos os dispositivos
- 🔄 **API REST Fake** com JSON Server

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Função |
|------------|--------|--------|
| Vue 3 | 3.5+ | Framework frontend |
| Vite | 7.1+ | Build tool e dev server |
| Vue Router | 4.x | Roteamento |
| Pinia | 2.x | Gerenciamento de estado |
| TailwindCSS | 4.1+ | Framework CSS |
| Chart.js | Latest | Gráficos e visualizações |
| JSON Server | Latest | API REST fake |

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 20.19+ ou 22.12+
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/SEU_USUARIO/agenda-vue.git
cd agenda-vue
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o JSON Server (API fake)**
```bash
# Em um terminal separado
npx json-server --watch db.json --port 3001
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
```
http://localhost:5173
```

## 📁 Estrutura do Projeto

```
agenda-vue/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Navbar.vue      # Barra de navegação
│   │   ├── Calendar.vue    # Componente de calendário
│   │   └── ClientCard.vue  # Card de cliente
│   ├── pages/              # Páginas da aplicação
│   │   ├── Dashboard.vue  # Dashboard principal
│   │   ├── Clients.vue     # Gerenciamento de clientes
│   │   └── Schedule.vue   # Agendamentos
│   ├── router/            # Configuração de rotas
│   │   └── index.js
│   ├── store/             # Gerenciamento de estado (Pinia)
│   │   ├── index.js
│   │   └── clients.js
│   ├── assets/            # Arquivos estáticos
│   ├── App.vue            # Componente raiz
│   └── main.js           # Entry point
├── db.json               # Banco de dados fake (JSON Server)
├── package.json
└── README.md
```

## 🎯 Funcionalidades Detalhadas

### Dashboard
- Estatísticas em tempo real (total de clientes, agendamentos, etc.)
- Gráfico de agendamentos por dia da semana
- Lista dos próximos agendamentos

### Clientes
- Listagem de todos os clientes
- Adicionar novo cliente
- Editar informações do cliente
- Excluir cliente
- Visualização em cards responsivos

### Agendamentos
- Calendário visual interativo
- Criar novos agendamentos
- Visualizar agendamentos por data
- Excluir agendamentos
- Lista completa de agendamentos

## 🌙 Dark Mode

O projeto inclui suporte completo a dark mode com:
- Toggle manual através do botão na navbar
- Persistência da preferência no localStorage
- Transições suaves entre temas

## 📡 API Endpoints (JSON Server)

A API fake está disponível em `http://localhost:3001`:

- `GET /clients` - Listar clientes
- `POST /clients` - Criar cliente
- `PUT /clients/:id` - Atualizar cliente
- `DELETE /clients/:id` - Excluir cliente
- `GET /appointments` - Listar agendamentos
- `POST /appointments` - Criar agendamento
- `DELETE /appointments/:id` - Excluir agendamento

## 🎨 Personalização

### Cores e Tema

O projeto usa TailwindCSS. Para personalizar as cores, edite `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      // Suas cores personalizadas
    }
  }
}
```

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`.

## 🚀 Deploy

### Vercel

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Faça o deploy:
```bash
vercel
```

### Netlify

1. Instale a CLI do Netlify:
```bash
npm i -g netlify-cli
```

2. Faça o deploy:
```bash
netlify deploy --prod
```

**Nota:** Para produção, você precisará substituir o JSON Server por uma API real.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 👨‍💻 Desenvolvido por:
IronDev Software. Contato: dibarbieri21@gmail.com | (32) 99118-6728

## ✅ Funcionalidades Implementadas

- [x] **Autenticação com JWT** - Sistema completo de login e registro com proteção de rotas
- [x] **Notificações de agendamentos** - Alertas automáticos 30min e 5min antes dos agendamentos
- [x] **Exportação de relatórios** - Exportação em PDF, CSV e Excel
- [x] **Busca e filtros avançados** - Busca por nome, email, telefone e ordenação
- [x] **Integração com calendários externos** - Exportação para Google Calendar e arquivos .ics
- [x] **Modo offline com PWA** - Aplicação funciona offline com service worker

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
# Agenda-Inteligente
