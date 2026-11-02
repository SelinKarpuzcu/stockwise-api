# StockWise API

A RESTful inventory management API built with **NestJS, TypeScript, Prisma, and SQLite**. StockWise allows authenticated users to manage their own products and categories through a secure, user-isolated API.

## Features

- **Authentication:** User registration and login with JWT-based authentication.
- **Password Security:** Passwords are hashed using bcrypt before storage.
- **Product Management:** Create, retrieve, update, and delete products.
- **Category Management:** Create, retrieve, update, and delete product categories.
- **User Data Isolation:** Users can only access and manage their own products and categories.
- **Input Validation:** Request payloads are validated using class-validator and NestJS ValidationPipe.
- **Product–Category Relationship:** Products can optionally be assigned to categories.
- **SQLite Database:** Lightweight relational database managed through Prisma ORM.
- **Integer-based Pricing:** Product prices are stored in kuruş to avoid floating-point precision issues.

## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Programming language |
| NestJS | Backend framework |
| SQLite | Relational database |
| Prisma ORM | Database access and migrations |
| JWT | Authentication |
| Passport.js | Authentication strategy |
| bcrypt | Password hashing |
| class-validator | Request validation |
| class-transformer | Data transformation |

## Project Structure

```text
stockwise-api/
├── prisma/
│   ├── migrations/
│   │   ├── 20261024232623_init/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   └── auth.service.ts
│   ├── categories/
│   │   ├── dto/
│   │   │   ├── create-category.dto.ts
│   │   │   └── update-category.dto.ts
│   │   ├── categories.controller.spec.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.spec.ts
│   │   └── categories.service.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   ├── prisma.service.spec.ts
│   │   └── prisma.service.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── products.controller.spec.ts
│   │   ├── products.controller.ts
│   │   ├── products.module.ts
│   │   ├── products.service.spec.ts
│   │   └── products.service.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── prisma7.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 24 or later
- npm

### 1. Clone the Repository

```bash
git clone <repository-url>
cd stockwise-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root using `.env.example` as a template.

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-long-random-secret"
```

Use a strong, randomly generated secret for `JWT_SECRET`.

**Important:** Never commit your actual `.env` file or secret values to the repository.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Set Up the Database

Apply the existing migrations to create the SQLite database:

```bash
npx prisma migrate deploy
```

### 6. Start the Development Server

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000/api
```

## API Endpoints

All endpoints use the `/api` prefix.

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Log in and receive a JWT | No |
| GET | `/auth/me` | Get authenticated user information | Yes |

### Categories

| Method | Endpoint | Description |
|---|---|---|
| POST | `/categories` | Create a category |
| GET | `/categories` | List the user's categories |
| GET | `/categories/:id` | Get a category by ID |
| PATCH | `/categories/:id` | Update a category |
| DELETE | `/categories/:id` | Delete a category |

### Products

| Method | Endpoint | Description |
|---|---|---|
| POST | `/products` | Create a product |
| GET | `/products` | List the user's products |
| GET | `/products/:id` | Get a product by ID |
| PATCH | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

## Authentication

Register a user:

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Log in to receive an access token:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

For protected endpoints, include the token in the request header:

```http
Authorization: Bearer <your-access-token>
```

## Example Product Request

```http
POST /api/products
Authorization: Bearer <your-access-token>
Content-Type: application/json
```

```json
{
  "name": "Wireless Mouse",
  "priceInKurus": 75000,
  "stockQuantity": 25,
  "categoryId": "your-category-id"
}
```

The `priceInKurus` field represents the product price in kuruş. For example, `75000` represents 750.00 TRY.

The `stockQuantity` field is optional and defaults to `0`. The `categoryId` field is also optional.

## Validation and Security

- Protected endpoints require a valid JWT.
- Passwords are stored as bcrypt hashes.
- Users cannot access or modify resources belonging to other users.
- Product and category queries are scoped to the authenticated user.
- Products can only be assigned to categories owned by the same user.
- Incoming request data is validated using DTOs.
- Unknown request properties are rejected.
- JWT tokens expire after one hour.

## Error Handling

The API uses standard HTTP status codes, including:

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request data |
| 401 | Missing or invalid authentication |
| 404 | Resource not found |
| 409 | Conflict, such as an existing account or category |

## Build

Compile the application:

```bash
npm run build
```

## License

This project was developed as a backend development internship assignment and is not published under an open-source license.