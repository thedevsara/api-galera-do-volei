# 🏐 Galera do Vôlei API

> Aplicação de SOLID, Assíncrono (PostgreSQL) e Segurança.

## 🎯 Objetivo do Projeto

Esta API foi construída seguindo o padrão de **Arquitetura de Camadas** para demonstrar conhecimento em **Qualidade de Código**. O foco principal foi ir além do CRUD, criando um projeto que:

1. **Aplica o SOLID** — principalmente Inversão de Dependência (D) e Responsabilidade Única (S).
2. **Lida com Assincronicidade** — toda a API foi adaptada para o uso assíncrono do PostgreSQL.
3. **Implementa Transações** — modelagem de regras de negócio complexas (candidatura, aceite, avaliação).

## 📄 Descrição do Projeto

Este projeto implementa uma API RESTful para um aplicativo de organização de partidas de vôlei. O foco do desenvolvimento foi **romper a barreira do CRUD ordinário**, criando endpoints que representam ações e transações de negócio, em vez de apenas manipular dados de forma básica.

---

## ✨ Arquitetura e Padrões Aplicados

| Conceito | Chave de Implementação | Princípio SOLID |
| :--- | :--- | :--- |
| **Inversão de Dependência** | Os **Services** dependem de **Interfaces** (`IJogadorRepository`), e não da classe concreta de acesso ao banco. | **D (Dependency Inversion Principle):** facilita a troca do banco de dados (ex.: para MongoDB). |
| **Persistência Assíncrona** | Repositórios (`JogadorPostgreRepository`) contêm o SQL e usam `async/await` e `pool.query()`. | — |
| **Controle de Acesso** | **Middleware de Autorização** verifica o `Bearer Token` (`Authorization`). | **S (Single Responsibility Principle):** a segurança é separada da lógica de negócio. |
| **Tratamento de Erros** | Uso de **Exceções Personalizadas** (`404 NotFoundException`) capturadas globalmente. | Retorna códigos HTTP semanticamente corretos. |

---

## 📋 Requisitos (User Stories)

- **Como um jogador**, eu quero me candidatar a uma partida, para que eu possa participar.
- **Como um organizador**, eu quero aceitar ou recusar uma candidatura, para gerenciar os participantes da partida.
- **Como um jogador**, eu quero avaliar uma partida ou outro jogador, para dar um feedback à comunidade.
- **Como um organizador**, eu quero ver todas as candidaturas para a minha partida, para saber quem quer participar.
- **Como um jogador**, eu quero ver o meu perfil, incluindo a minha nota média, para acompanhar o meu desempenho.

---

## 💻 Endpoints Chave (Transações e Lógica)

| Método | Endpoint | Descrição da Ação | Requisito Especial |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/partidas/:id/candidatura` | **Cria** uma nova solicitação. Verifica se o jogador já se candidatou (regra de negócio). | Lógica de validação no **Service**. |
| **PATCH** | `/api/solicitacoes/:id` | **Atualiza** o status de uma solicitação (aceitar/recusar). | Protegida por middleware: requer `Authorization: Bearer 99`. |
| **GET** | `/api/jogadores/:id` | **Cálculo avançado**: retorna o perfil, calculando a `notaMedia` de forma assíncrona. | Combina dados de dois repositórios. |

---

## 📚 Endpoints e Tipos de Dados

### Candidatar-se a uma Partida

- **Método:** `POST`
- **URL:** `/api/partidas/:id/candidatura`
- **Headers:** `Content-Type: application/json`

**Request Body**
```json
{
  "idJogador": 1
}
```

**Response Body (201 Created)**
```json
{
  "message": "Candidatura criada com sucesso!",
  "solicitacao": { "id": 1, "idPartida": 1, "idJogador": 1, "status": "pendente" }
}
```

### Aceitar ou Recusar uma Candidatura

- **Método:** `PATCH`
- **URL:** `/api/solicitacoes/:id`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <token>`

**Request Body**
```json
{
  "status": "aceito"
}
```

**Response Body (200 OK)**
```json
{
  "message": "Status da solicitação 1 atualizado para aceito.",
  "solicitacao": { "id": 1, "idPartida": 1, "idJogador": 1, "status": "aceito" }
}
```

### Registrar uma Avaliação

- **Método:** `POST`
- **URL:** `/api/avaliacoes`
- **Headers:** `Content-Type: application/json`

**Request Body**
```json
{
  "idAvaliador": 2,
  "idAvaliado": 1,
  "tipoAvaliacao": "jogador",
  "nota": 9.5,
  "comentario": "Excelente jogador!"
}
```

**Response Body (201 Created)**
```json
{
  "message": "Avaliação registrada com sucesso.",
  "avaliacao": { "id": 1, "idAvaliador": 2, "idAvaliado": 1, "tipoAvaliacao": "jogador", "nota": 9.5 }
}
```

### Ver o Perfil de um Jogador

- **Método:** `GET`
- **URL:** `/api/jogadores/:id`
- **Headers:** Nenhum (ou `Authorization: Bearer <token>` se for um perfil privado)
- **Request Body:** Nenhum

**Response Body (200 OK)**
```json
{
  "id": 1,
  "nome": "Jio",
  "idade": 21,
  "sexo": "feminino",
  "categoria": "iniciante",
  "avaliacao": 7.5,
  "notaMedia": "9.50",
  "avaliacoesRecebidas": 1
}
```

### Listar Solicitações de uma Partida

- **Método:** `GET`
- **URL:** `/api/partidas/:id/solicitacoes`
- **Headers:** Nenhum (ou `Authorization: Bearer <token>` para o organizador)
- **Request Body:** Nenhum

**Response Body (200 OK)**
```json
[
  {
    "id": 1,
    "idPartida": 1,
    "idJogador": 1,
    "status": "aceito"
  }
]
```

### Marcar Presença em uma Partida

- **Método:** `POST`
- **URL:** `/api/partidas/:id/presenca`
- **Headers:** `Content-Type: application/json`

**Request Body**
```json
{
  "idJogador": 1
}
```

**Response Body (200 OK)**
```json
{
  "message": "Presença do jogador Guga registrada com sucesso na partida 'Volei do ADS'."
}
```

---

## 🛠️ Guia de Inicialização

### 1. Configuração do Banco de Dados

Crie o arquivo `.env` na raiz do projeto e preencha suas credenciais:

```env
PGUSER=postgres
PGHOST=localhost
PGDATABASE=seu_banco_aqui
PGPASSWORD=sua_senha
PGPORT=5432
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Compilar e iniciar o servidor

```bash
npx tsc
node dist/server.js
```

O servidor será iniciado em `http://localhost:3000`.
