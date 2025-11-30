# API de Gerenciamento de Pedidos

API RESTful para gerenciar pedidos, desenvolvida com Node.js, Express e SQLite.

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Executando a Aplicação](#executando-a-aplicação)
- [Documentação da API](#documentação-da-api)
- [Endpoints](#endpoints)
- [Mapping de Dados](#mapping-de-dados)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Commits](#commits)

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados
- **Swagger UI** - Documentação interativa da API
- **Nodemon** - Auto-reload durante desenvolvimento

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd DesafioTecnicoJitterbit
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Instale o Nodemon (opcional, para desenvolvimento)

```bash
npm install --save-dev nodemon
```

## 🗄️ Configuração do Banco de Dados

### 1. Crie o arquivo do banco de dados

```bash
touch database.sql
```

### 2. Execute o schema SQL
Dentro do SQLite, execute:

```sql
-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT UNIQUE NOT NULL,
    value REAL NOT NULL,
    creationDate TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_orderId ON orders(orderId);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
```

Ou use o arquivo SQL fornecido:

## ▶️ Executando a Aplicação

### Modo Produção

```bash
npm start
```

### Modo Desenvolvimento (com auto-reload)

```bash
npm run dev
```

A API estará disponível em: `http://localhost:3000`

## 📚 Documentação da API

Acesse a documentação interativa Swagger UI em:

```
http://localhost:3000/api-docs
```

A interface Swagger permite testar todos os endpoints diretamente pelo navegador.

## 🔌 Endpoints

### Health Check

**GET** `/health`

Verifica se a API está funcionando.

**Resposta de Sucesso (200):**
```json
{
  "status": "OK",
  "message": "API está funcionando"
}
```

---

### Criar Pedido

**POST** `/order`

Cria um novo pedido no sistema.

**Request Body:**
```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Pedido criado com sucesso",
  "order": {
    "orderId": "v10089015vdb-01",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "productId": 2434,
        "quantity": 1,
        "price": 1000
      }
    ]
  }
}
```

**Exemplo com cURL:**
```bash
curl --location 'http://localhost:3000/order' \
--header 'Content-Type: application/json' \
--data '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}'
```

---

### Obter Pedido por ID

**GET** `/order/:orderId`

Retorna os dados de um pedido específico.

**Parâmetros:**
- `orderId` (string) - ID do pedido

**Resposta de Sucesso (200):**
```json
{
  "orderId": "v10089016vdb",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

**Exemplo com cURL:**
```bash
curl --location 'http://localhost:3000/order/v10089016vdb'
```

---

### Listar Todos os Pedidos

**GET** `/order/list`

Retorna uma lista com todos os pedidos cadastrados.

**Resposta de Sucesso (200):**
```json
{
  "total": 2,
  "orders": [
    {
      "orderId": "v10089016vdb",
      "value": 10000,
      "creationDate": "2023-07-19T12:24:11.529Z",
      "items": [
        {
          "productId": 2434,
          "quantity": 1,
          "price": 1000
        }
      ]
    }
  ]
}
```

**Exemplo com cURL:**
```bash
curl --location 'http://localhost:3000/order/list'
```

---

### Atualizar Pedido

**PUT** `/order/:orderId`

Atualiza os dados de um pedido existente.

**Parâmetros:**
- `orderId` (string) - ID do pedido a ser atualizado

**Request Body:**
```json
{
  "numeroPedido": "v10089016vdb",
  "valorTotal": 15000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 1000
    }
  ]
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Pedido atualizado com sucesso",
  "order": {
    "orderId": "v10089016vdb",
    "value": 15000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "productId": 2434,
        "quantity": 2,
        "price": 1000
      }
    ]
  }
}
```

**Exemplo com cURL:**
```bash
curl --location --request PUT 'http://localhost:3000/order/v10089016vdb' \
--header 'Content-Type: application/json' \
--data '{
  "numeroPedido": "v10089016vdb",
  "valorTotal": 15000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 1000
    }
  ]
}'
```

---

### Deletar Pedido

**DELETE** `/order/:orderId`

Remove um pedido do sistema.

**Parâmetros:**
- `orderId` (string) - ID do pedido a ser deletado

**Resposta de Sucesso (200):**
```json
{
  "message": "Pedido deletado com sucesso"
}
```

**Exemplo com cURL:**
```bash
curl --location --request DELETE 'http://localhost:3000/order/v10089016vdb'
```

---

## 🔄 Mapping de Dados

A API realiza transformação automática dos dados entre o formato de entrada (request) e o formato do banco de dados:

### Request → Database

| Campo Request | Campo Database | Tipo | Transformação |
|--------------|----------------|------|---------------|
| `numeroPedido` | `orderId` | string | Direto |
| `valorTotal` | `value` | number | Direto |
| `dataCriacao` | `creationDate` | string (ISO) | Converte para ISO 8601 |
| `items[].idItem` | `items[].productId` | integer | Parse para int |
| `items[].quantidadeItem` | `items[].quantity` | integer | Direto |
| `items[].valorItem` | `items[].price` | number | Direto |

### Exemplo de Transformação

**Entrada (Request):**
```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

**Saída (Database):**
```json
{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

## 📁 Estrutura do Projeto

```
DesafioTecnicoJitterbit/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuração do SQLite
│   │   └── swagger.js           # Configuração do Swagger
│   ├── controllers/
│   │   └── orderController.js   # Controladores das rotas
│   ├── routes/
│   │   └── orderRoutes.js       # Definição das rotas
│   ├── services/
│   │   └── orderService.js      # Lógica de negócio e mapping
│   └── app.js                   # Configuração do Express
├── server.js                    # Inicialização do servidor
├── database.sqlite              # Banco de dados SQLite
├── database_schema.sql          # Schema do banco
├── package.json                 # Dependências do projeto
├── .gitignore                   # Arquivos ignorados pelo Git
└── README.md                    # Documentação
```

## 🔒 Validações

A API implementa as seguintes validações:

- **Campos obrigatórios**: `numeroPedido`, `valorTotal`, `dataCriacao`, `items`
- **Items**: Deve conter pelo menos um item
- **Pedido único**: Não permite pedidos duplicados (constraint no `orderId`)
- **Formato de data**: Converte automaticamente para ISO 8601

## ⚠️ Tratamento de Erros

A API retorna códigos HTTP apropriados:

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos ou incompletos
- `404` - Recurso não encontrado
- `409` - Conflito (pedido já existe)
- `500` - Erro interno do servidor

Todas as respostas de erro incluem uma mensagem descritiva:

```json
{
  "error": "Descrição do erro",
  "details": "Detalhes adicionais (quando aplicável)"
}
```

## 🧪 Testando a API

### 1. Via Swagger UI
Acesse `http://localhost:3000/api-docs` e use a interface interativa.

### 2. Via cURL
Use os exemplos de cURL fornecidos em cada endpoint acima.

### 3. Via Postman
Importe a collection usando a URL do Swagger: `http://localhost:3000/api-docs`
