# StockWise API

**NestJS, TypeScript, Prisma ve SQLite** kullanılarak geliştirilmiş RESTful bir envanter yönetim API'sidir. StockWise, kullanıcıların kendi ürünlerini ve kategorilerini güvenli, kullanıcı bazlı veri izolasyonu sağlayan bir API üzerinden yönetmelerine olanak tanır.

## Özellikler

- **Authentication:** JWT tabanlı kullanıcı kayıt ve giriş sistemi.
- **Password Security:** Kullanıcı şifreleri veritabanına kaydedilmeden önce bcrypt ile hash'lenir.
- **Product Management:** Ürün oluşturma, listeleme, görüntüleme, güncelleme ve silme işlemleri.
- **Category Management:** Ürün kategorileri için CRUD işlemleri.
- **User Data Isolation:** Kullanıcılar yalnızca kendi ürünlerine ve kategorilerine erişebilir ve bunları yönetebilir.
- **Input Validation:** Gelen request verileri class-validator ve NestJS ValidationPipe kullanılarak doğrulanır.
- **Product–Category Relationship:** Ürünler isteğe bağlı olarak kategorilerle ilişkilendirilebilir.
- **SQLite Database:** Prisma ORM aracılığıyla yönetilen hafif bir ilişkisel veritabanı.
- **Integer-based Pricing:** Floating-point hassasiyet sorunlarını önlemek için ürün fiyatları kuruş cinsinden saklanır.

## Tech Stack

| Technology | Kullanım Amacı |
|---|---|
| TypeScript | Programming Language |
| NestJS | Backend Framework |
| SQLite | Relational Database |
| Prisma ORM | Database Access ve Migrations |
| JWT | Authentication |
| Passport.js | Authentication Strategy |
| bcrypt | Password Hashing |
| class-validator | Request Validation |
| class-transformer | Data Transformation |

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
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── categories/
│   │   ├── dto/
│   │   │   ├── create-category.dto.ts
│   │   │   └── update-category.dto.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.module.ts
│   │   └── categories.service.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── products.controller.ts
│   │   ├── products.module.ts
│   │   └── products.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── prisma7.config.ts
└── README.md
```

## Getting Started

### Gereksinimler (Prerequisites)

- Node.js 24 veya üzeri
- npm

### 1. Repository'yi Clone Etme

```bash
git clone https://github.com/SelinKarpuzcu/stockwise-api.git
cd stockwise-api
```

### 2. Dependencies Kurulumu

```bash
npm install
```

### 3. Environment Variables Yapılandırması

Proje ana dizininde bulunan `.env.example` dosyasını referans alarak `.env` dosyası oluşturun.

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-long-random-secret"
```

`JWT_SECRET` için güçlü ve rastgele oluşturulmuş bir secret kullanılması önerilir.

**Önemli:** Gerçek `.env` dosyanızı veya secret değerlerinizi asla repository'ye commit etmeyin.

### 4. Prisma Client Oluşturma

```bash
npx prisma generate
```

### 5. Database Kurulumu

Mevcut migrations dosyalarını uygulayarak SQLite veritabanını oluşturun:

```bash
npx prisma migrate deploy
```

### 6. Development Server Başlatma

```bash
npm run start:dev
```

API aşağıdaki adres üzerinden kullanılabilir:

```text
http://localhost:3000/api
```

## API Endpoints

Tüm endpoint'ler `/api` prefix'ini kullanır.

### Authentication

| Method | Endpoint | Açıklama | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Yeni kullanıcı kaydı oluşturur. | Hayır |
| POST | `/auth/login` | Kullanıcı girişi yapar ve JWT döndürür. | Hayır |
| GET | `/auth/me` | Giriş yapmış kullanıcının bilgilerini getirir. | Evet |

### Categories

| Method | Endpoint | Açıklama |
|---|---|---|
| POST | `/categories` | Yeni kategori oluşturur. |
| GET | `/categories` | Kullanıcının kategorilerini listeler. |
| GET | `/categories/:id` | ID üzerinden kategori bilgilerini getirir. |
| PATCH | `/categories/:id` | Kategoriyi günceller. |
| DELETE | `/categories/:id` | Kategoriyi siler. |

### Products

| Method | Endpoint | Açıklama |
|---|---|---|
| POST | `/products` | Yeni ürün oluşturur. |
| GET | `/products` | Kullanıcının ürünlerini listeler. |
| GET | `/products/:id` | ID üzerinden ürün bilgilerini getirir. |
| PATCH | `/products/:id` | Ürünü günceller. |
| DELETE | `/products/:id` | Ürünü siler. |

## Authentication

### Kullanıcı Kaydı (Register)

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

### Kullanıcı Girişi (Login)

Giriş işlemi sonucunda bir access token döndürülür.

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

Protected endpoint'lere erişirken JWT aşağıdaki request header içerisinde gönderilmelidir:

```http
Authorization: Bearer <your-access-token>
```

## Example Product Request

Yeni bir ürün oluşturmak için:

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

`priceInKurus` alanı ürün fiyatını kuruş cinsinden temsil eder. Örneğin, `75000` değeri `750.00 TRY` anlamına gelir.

`stockQuantity` alanı isteğe bağlıdır ve belirtilmediğinde varsayılan olarak `0` değerini alır. `categoryId` alanı da isteğe bağlıdır.

## Validation and Security

- Protected endpoint'lere erişim için geçerli bir JWT gereklidir.
- Kullanıcı şifreleri bcrypt hash'leri olarak saklanır.
- Kullanıcılar başka kullanıcılara ait kaynaklara erişemez veya bu kaynakları değiştiremez.
- Product ve Category sorguları, authentication işlemi gerçekleştiren kullanıcıya göre sınırlandırılır.
- Ürünler yalnızca aynı kullanıcıya ait kategorilerle ilişkilendirilebilir.
- Gelen request verileri DTO'lar aracılığıyla doğrulanır.
- Tanımlanmamış request alanları reddedilir.
- JWT token'ları bir saat sonra sona erer.

## Error Handling

API, aşağıdaki standart HTTP status code değerlerini kullanır:

| Status Code | Açıklama |
|---|---|
| 200 | Request başarılı. |
| 201 | Resource başarıyla oluşturuldu. |
| 400 | Geçersiz request verisi. |
| 401 | Authentication eksik veya geçersiz. |
| 404 | Resource bulunamadı. |
| 409 | Conflict. Örneğin, mevcut bir hesap veya kategori. |

## Build

Uygulamayı compile etmek için:

```bash
npm run build
```

## License

Bu proje, backend development staj görevi kapsamında geliştirilmiştir ve herhangi bir open-source license altında yayımlanmamıştır.