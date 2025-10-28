#  Galera do Volei

## 🎯 Objetivo do Projeto
Este projeto implementa uma API RESTful, focada em demonstrar a aplicação correta dos princípios de **Arquitetura de Software** e **Qualidade de Código**. O desenvolvimento priorizou:

1.  **Separação de Responsabilidades (Camadas).**
2.  **Transações Avançadas** que modelam a lógica de negócio (além do CRUD).
3.  **Preparação para o Ambiente de Produção** (PostgreSQL, Assíncrono e Middleware de Segurança).

## ✨ Arquitetura e Padrões Aplicados

O projeto adota uma **Arquitetura de Camadas** estrita, aplicando os seguintes conceitos:

| Conceito | Aplicação no Projeto | Princípio SOLID |
| :--- | :--- | :--- |
| **Persistência Real** | Migração total dos Repositórios para o **PostgreSQL** (`node-postgres`). | |
| **Inversão de Dependência**| Os **Services** dependem de **Interfaces** (`IJogadorRepository`), e não de classes concretas. | **D (Dependency Inversion Principle):** Facilita a troca do banco de dados sem alterar a lógica. |
| **Lógica de Negócio** | Os **Services** (ex: `JogadorService`) são responsáveis por cálculos (média) e validações. | **S (Single Responsibility Principle):** A lógica de negócio é isolada. |
| **Controle de Acesso** | Implementação de um **Middleware de Autorização** na rota de `PATCH`. | Segurança e **S** de SOLID. |
| **Tratamento de Erros** | Uso de **Exceções Personalizadas** capturadas globalmente. | Retorna códigos HTTP semanticamente corretos (`404`, `400`). |

---

## 💻 Endpoints Chave (Transações Avançadas)

Estes endpoints demonstram a arquitetura de serviços e a lógica de negócio do projeto:

| Método | Endpoint | Descrição da Transação | Requisito Especial |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/partidas/:id/candidatura` | **Cria** uma nova solicitação. Lança erro `400 Bad Request` se o jogador já estiver candidatado. | Valida duplicidade na camada Service. |
| **PATCH**| `/api/solicitacoes/:id` | **Atualiza** o status de uma solicitação (Aceitar/Recusar). | **Autorização:** Requer `Authorization: Bearer 99`. |
| **POST**| `/api/avaliacoes` | **Registra** uma nova nota para um jogador/partida. | O Service valida se a nota está entre 0 e 10. |
| **GET** | `/api/jogadores/:id` | **Consulta** o perfil completo do jogador. | **Lógica de Dados:** O Service calcula a `notaMedia` em tempo real. |

---

## 🛠️ Configuração e Execução

### **1. Pré-requisitos**

1.  Node.js e NPM instalados.
2.  Servidor **PostgreSQL** rodando.

### **2. Configuração do Banco de Dados**

Na raiz do projeto, crie o arquivo **`.env`** com suas credenciais:

```env
PGUSER=postgres
PGHOST=localhost
PGDATABASE=seu_banco_aqui
PGPASSWORD=sua_senha
PGPORT=5432
