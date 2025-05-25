# Produto Web - Frontend

Aplicação frontend desenvolvida em React com PrimeReact para gerenciamento de produtos (CRUD).

## Requisitos

- Node.js >= 18.x
- NPM >= 9.x
- Backend rodando em: `http://localhost:3001` (ou conforme `.env`)
- Variáveis de ambiente configuradas (`REACT_APP_API_URL`)

---

## Instalação

Clone o repositório do frontend e instale as dependências:

```bash
npm install
```

---

### Execução em ambiente de desenvolvimento

```
npm start
```

# produção
```
npm run build
```

# homologação
```
cp .env.hml .env && npm run build
```