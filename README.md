<div align="center">

# City Backend

**API REST para gerenciamento de ocorrências urbanas**  
Conectando cidadãos, denúncias e dados geográficos em tempo real.

<br/>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

## Sobre

O **City Backend** é o núcleo de um sistema de ocorrências urbanas — seguro, escalável e bem estruturado. Ele gerencia o registro de denúncias feitas por cidadãos, controlando usuários, comentários, curtidas, permissões e geolocalização integrada.

A arquitetura foi pensada para expansão futura, incluindo painel administrativo, analytics e integração com órgãos públicos.

---

## Funcionalidades

| Módulo | Descrição |
|---|---|
| Autenticação | Cadastro e login com JWT |
| Ocorrências | CRUD completo com geolocalização |
| Comentários | Criação, edição e respostas aninhadas |
| Curtidas | Sistema de reações por ocorrência |
| Permissões | Controle de autoria para edição e exclusão |
| Geocoding | Integração com serviços de geocodificação |

---

## Estrutura do projeto

```
src/
├── controllers/   # Lógica de cada endpoint
├── routes/        # Definição das rotas da API
├── services/      # Regras de negócio e integrações
├── middlewares/   # Autenticação JWT e validações
└── lib/           # Utilitários (ex: jwt.js)
```

---

## Rodando localmente

**Pré-requisitos:** Node.js v18+, npm, PostgreSQL

```bash
# Clone o repositório
git clone https://github.com/jeanbrito-dev/city-backend.git
cd city-backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrations
npx prisma migrate dev

# Inicie o servidor
npm run dev
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/citydb
JWT_SECRET=your_super_secret_key
PORT=3000
```

> **Atenção:** nunca exponha o `.env` no repositório. Ele já está no `.gitignore`.

---

## Endpoints

```
# Autenticação
POST   /auth/register                    Cadastro de usuário
POST   /auth/login                       Login e geração de token

# Ocorrências
GET    /occurrences                      Listar ocorrências
POST   /occurrences                      Criar ocorrência
PUT    /occurrences/:id                  Atualizar (somente autor)
DELETE /occurrences/:id                  Remover (somente autor)

# Interações
POST   /occurrences/:id/like             Curtir ocorrência
POST   /occurrences/:id/comments         Comentar em ocorrência
POST   /comments/:id/replies             Responder comentário
```

---

## Repositórios

| | Repositório |
|---|---|
| Backend | [city-backend](https://github.com/jeanbrito-dev/city-backend) |
| Frontend | [city-frontend](https://github.com/jeanbrito-dev/city-frontend) |

---

## Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](./LICENSE) para mais informações.

---

<div align="center">
  <sub>Feito por <a href="https://github.com/jeanbrito-dev">Jean Brito</a></sub>
</div>