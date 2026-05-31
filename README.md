# TRK Imóveis — Deploy no Railway

## Estrutura do projeto
```
trk-app/
├── backend/      ← FastAPI Python
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
└── frontend/     ← Next.js 15
    ├── app/
    ├── components/
    ├── lib/
    └── Dockerfile
```

---

## Deploy no Railway (gratuito, 5 min)

### 1. Criar conta
Acesse https://railway.app e faça login com GitHub.

### 2. Subir o código no GitHub
```bash
cd trk-app
git init
git add .
git commit -m "TRK Imóveis — painel executivo"
gh repo create trk-painel --private --push --source=.
```

### 3. Criar projeto no Railway

**Backend:**
1. New Project → Deploy from GitHub Repo → selecione `trk-painel`
2. Add Service → selecione a pasta `/backend`
3. Railway detecta o Dockerfile automaticamente
4. Anote a URL gerada (ex: `https://trk-backend.up.railway.app`)

**Frontend:**
1. No mesmo projeto → Add Service → selecione `/frontend`
2. Adicione variável de ambiente:
   ```
   NEXT_PUBLIC_API_URL=https://trk-backend.up.railway.app
   ```
3. Railway faz o build e deploy automaticamente

### 4. Pronto
O painel estará disponível em:
`https://trk-frontend.up.railway.app`

---

## Rodar localmente (desenvolvimento)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## URLs da API
| Endpoint | Descrição |
|---|---|
| GET /api/consolidado | KPIs consolidados dos 3 imóveis |
| GET /api/imoveis | Lista todos os imóveis |
| GET /api/imoveis/{id} | Detalhe de um imóvel (qi7, q510, ql08) |
| GET /api/pagamentos | Todos os pagamentos em ordem cronológica |
| GET /api/vendedores | Recebido por vendedor consolidado |
