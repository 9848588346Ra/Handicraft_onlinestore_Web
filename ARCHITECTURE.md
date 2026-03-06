# Clean Architecture - Handicraft Online Store

This project follows **Clean Architecture** principles with clear separation of concerns.

## Frontend Structure

```
Frontend/src/
├── domain/                    # Core business entities (no framework deps)
│   └── entities/
│       ├── User.ts            # User, CurrentUser
│       ├── Product.ts         # Product
│       ├── CartItem.ts        # CartItem
│       ├── Order.ts           # Order
│       └── index.ts
│
├── application/               # Use cases & ports (interfaces)
│   └── ports/
│       ├── IAuthRepository.ts
│       ├── ICartRepository.ts
│       ├── IOrderRepository.ts
│       ├── IProductRepository.ts
│       └── index.ts
│
├── infrastructure/            # External implementations (adapters)
│   └── api/
│       ├── HttpClient.ts      # Token storage, base request
│       ├── ApiClient.ts       # Implements repository interfaces
│       └── index.ts
│
├── presentation/              # UI layer (implicit)
│   ├── components/            # Reusable UI components
│   ├── context/               # React Context (AppContext)
│   └── (app/ pages)
│
├── app/                       # Next.js App Router (routes)
├── shared/                    # Schemas, static data (Zod, PRODUCTS)
├── styles/                    # CSS
└── services/                  # Re-export of infrastructure (backward compat)
```

### Dependency Rule
- **Domain** → No dependencies
- **Application** → Depends only on Domain
- **Infrastructure** → Implements Application ports, depends on Domain
- **Presentation** → Uses Infrastructure & Domain

## Backend Structure

```
Backend/
├── domain/                    # Core entities (pure interfaces)
│   └── entities/
│       └── index.ts           # IUser, IProduct, ICartItem, IOrder
│
├── infrastructure/            # External implementations
│   ├── database/              # Mongoose models (persistence)
│   │   ├── UserModel.ts
│   │   ├── ProductModel.ts
│   │   ├── CartModel.ts
│   │   ├── OrderModel.ts
│   │   └── index.ts
│   └── http/                  # Express HTTP layer
│       ├── middleware/
│       │   └── auth.ts
│       └── routes/
│           ├── auth.ts
│           ├── cart.ts
│           ├── orders.ts
│           └── products.ts
│
├── config/                    # Environment config
├── app/                       # Express app entry
├── scripts/                   # Seed script
└── uploads/                   # Product images
```

## Key Principles

1. **Domain** – Pure TypeScript types, no imports from frameworks
2. **Ports** – Interfaces define contracts; infrastructure implements them
3. **Dependency Inversion** – High-level modules don't depend on low-level; both depend on abstractions
4. **Testability** – Ports can be mocked for unit tests

## Import Guidelines

- **Frontend**: Use `@/domain/entities`, `@/application/ports`, `@/infrastructure/api`
- **Backend**: Use relative paths to `infrastructure/`, `domain/`, `config/`
