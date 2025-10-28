# Projeto: Galera do Volei API 

> 🚀  Aplicação de SOLID, Assíncrono (PostgreSQL) e Segurança.

## 🎯 Objetivo do Projeto
Esta API foi construída seguindo o padrão de **Arquitetura de Camadas** para demonstrar o conhecimento em **Qualidade de Código**. O foco principal foi ir além do CRUD, criando um projeto que:

1.  **Aplica o SOLID:** Principalmente Inversão de Dependência (D) e Responsabilidade Única (S).
2.  **Lida com Assincronicidade:** Toda a API foi adaptada para o uso assíncrono do PostgreSQL.
3.  **Implementa Transações:** Modelagem de regras de negócio complexas (candidatura, aceite, avaliação).

---

## ✨ Arquitetura e Padrões Aplicados

| Conceito | Chave de Implementação | Princípio SOLID |
| :--- | :--- | :--- |
| **Inversão de Dependência**| Os **Services** dependem de **Interfaces** (`IJogadorRepository`), e não da classe concreta de acesso ao banco. | **D (Dependency Inversion Principle):** Facilita a troca do banco de dados (Ex: para MongoDB). |
| **Persistência Assíncrona** | Repositórios (`JogadorPostgreRepository`) contêm o SQL e usam `async/await` e `pool.query()`. | |
| **Controle de Acesso** | **Middleware de Autorização** verifica o `Bearer Token` (`Authorization`). | **S (Single Responsibility Principle):** A segurança é separada da lógica de negócio. |
| **Tratamento de Erros** | Uso de **Exceções Personalizadas** (`404 NotFoundException`) capturadas globalmente. | Retorna códigos HTTP semanticamente corretos. |

---

## 💻 Endpoints Chave (Transações e Lógica)

Estes endpoints são a prova do design da sua API:

| Método | Endpoint | Descrição da Ação | Requisito Especial |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/partidas/:id/candidatura` | **Cria** uma nova solicitação. Verifica se o jogador já se candidatou (Regra de Negócio). | Lógica de Validação no **Service**. |
| **PATCH**| `/api/solicitacoes/:id` | **Atualiza** o status de uma solicitação (Aceitar/Recusar). | **Protegida por Middleware:** Requer `Authorization: Bearer 99`. |
| **GET** | `/api/jogadores/:id` | **Cálculo Avançado:** Retorna o perfil, chamando a lógica para calcular a `notaMedia` de forma assíncrona. | Combina dados de dois Repositórios. |

---

## 🛠️ Guia de Inicialização (Console Interativo)

Siga os passos no terminal para rodar o projeto.

### **1. Configuração do Banco de Dados**

Crie o arquivo `.env` na raiz do projeto e preencha suas credenciais:

```env
PGUSER=postgres
PGHOST=localhost
PGDATABASE=seu_banco_aqui
PGPASSWORD=sua_senha
PGPORT=5432
