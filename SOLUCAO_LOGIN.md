# 🔧 Solução para Erro de Login

## Problema
O erro "Failed to fetch" ocorre quando o JSON Server não está rodando.

## ✅ Solução Implementada

Foi adicionado um **sistema de fallback** que permite login mesmo sem o JSON Server:

1. **Primeiro tenta conectar ao JSON Server** (porta 3001)
2. **Se falhar, usa dados locais** (localStorage)
3. **Usuário padrão sempre disponível**: `admin@agenda.com` / `admin123`

## 🚀 Como Resolver

### Opção 1: Iniciar o JSON Server (Recomendado)

Abra um **novo terminal** e execute:

```bash
npm run api
```

Ou:

```bash
npx json-server --watch db.json --port 3001
```

Depois, tente fazer login novamente.

### Opção 2: Usar Modo Offline

Agora o sistema funciona **mesmo sem o JSON Server**:

- Use as credenciais: `admin@agenda.com` / `admin123`
- Ou crie uma nova conta (será salva localmente)

## 📝 Notas

- O modo offline salva usuários no `localStorage`
- Os dados locais são independentes do JSON Server
- Para funcionalidades completas (clientes, agendamentos), o JSON Server é necessário

## 🔍 Verificar se o JSON Server está rodando

Acesse no navegador: `http://localhost:3001/users`

Se aparecer um JSON com os usuários, o servidor está funcionando!

