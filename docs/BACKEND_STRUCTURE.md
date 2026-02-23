# Backend Structure Documentation

## Overview

The backend follows a layered architecture pattern with clear separation of concerns.

backend/
└── src/
    ├── config/         # Configuration files (env, database, app settings)
    ├── middlewares/    # Express middleware (auth, error handling, logging)
    ├── routes/         # API route definitions
    ├── controllers/    # Request/response handlers
    ├── services/       # Business logic layer
    ├── repositories/   # Data access layer (DB queries)
    ├── validators/     # Input validation (planned)
    ├── utils/          # Reusable utility/helper functions
    ├── app.js          # Express app configuration
    └── server.js       # Application entry point

---

## Layer Architecture

Client Request
      ↓
Middleware
      ↓
Route
      ↓
Controller
      ↓
Service
      ↓
Repository
      ↓
Database
      ↓
---------------------------------
      ↑
Repository
      ↑
Service
      ↑
Controller
      ↑
Middleware
      ↑
Response Sent to Client


---

## Folders & Files

### 1. `config/` - Configuration

**Purpose:** Centralized configuration management

#### `database.config.js`
- Exports Prisma Client instance
- Database connection configuration
- Used by all repositories

#### `app.config.js`
- Application settings (port, JWT secret, bcrypt rounds)
- Loads from environment variables
- Fallback to defaults

**Usage:**
```javascript
const config = require('./config/app.config');
const port = config.port;

2. middlewares/ - Express Middleware
Purpose: Cross-cutting concerns applied to requests

error.middleware.js
Global error handler
Catches all errors thrown in controllers/services
Formats error responses consistently
Must be last middleware in app.js
auth.middleware.js
JWT token validation
Extracts user from token and adds to req.user
Protects routes that require authentication

Usage: router.get

3. routes/ - API Route Definitions
Purpose: Define API endpoints and map to controllers

index.js
Aggregates all routes
Mounts routes under /api prefix
auth.routes.js
POST /api/auth/admin/login - Admin login
POST /api/auth/customer/login - Customer login
customer.routes.js
GET /api/customers - List all customers
GET /api/customers/:id - Get customer by ID
POST /api/customers - Create customer
PUT /api/customers/:id - Update customer
DELETE /api/customers/:id - Delete customer
POST /api/customers/:id/adjust-points - Adjust points
reward.routes.js
GET /api/rewards - List all rewards
GET /api/rewards/:id - Get reward by ID
POST /api/rewards - Create reward
PUT /api/rewards/:id - Update reward
DELETE /api/rewards/:id - Delete reward
GET /api/rewards/:id/stock - Check stock
transaction.routes.js
GET /api/transactions - List all transactions
GET /api/transactions/customer/:customerId - Get customer transactions
POST /api/transactions/redeem - Redeem reward
POST /api/transactions/earn - Earn points
4. controllers/ - Request/Response Handlers
Purpose: Handle HTTP requests, call services, format responses

Responsibilities:

Extract data from req.body, req.params, req.query
Call appropriate service methods
Use ApiResponse.success() or ApiResponse.error()
Pass errors to next() for error middleware
auth.controller.js
adminLogin() - Admin authentication
customerLogin() - Customer authentication
customer.controller.js
getAll() - Get all customers
getById() - Get single customer
create() - Create new customer
update() - Update customer
delete() - Delete customer
adjustPoints() - Add/subtract points
reward.controller.js
getAll() - Get all rewards
getById() - Get single reward
create() - Create new reward
update() - Update reward
delete() - Delete reward
checkStock() - Check inventory
transaction.controller.js
getAll() - Get all transactions
getByCustomer() - Get customer's transactions
redeemReward() - Process redemption
earnPoints() - Award points

Example:

async getById(req, res, next) {
  try {
    const { id } = req.params;
    const customer = await customerService.getCustomerById(id);
    return ApiResponse.success(res, customer);
  } catch (error) {
    next(error); // Pass to error middleware
  }
}

5. services/ - Business Logic Layer
Purpose: Implement business rules and orchestrate operations

Responsibilities:

Enforce business constraints
Validate business rules (e.g., sufficient points)
Orchestrate multiple repository calls
Manage transactions (atomic operations)
Throw custom errors
auth.service.js
adminLogin(email, password) - Validate admin credentials, generate JWT
customerLogin(email, password) - Validate customer credentials, generate JWT
customer.service.js
getAllCustomers() - Fetch all customers
getCustomerById(id) - Fetch single customer
createCustomer(data) - Create customer, hash password
updateCustomer(id, data) - Update customer
deleteCustomer(id) - Delete customer
adjustPoints(id, points) - Add/subtract points (validate non-negative)
reward.service.js
getAllRewards() - Fetch all rewards
getRewardById(id) - Fetch single reward
createReward(data) - Create reward + inventory (if stock required)
updateReward(id, data) - Update reward
deleteReward(id) - Delete reward
checkStock(rewardId) - Verify stock availability
transaction.service.js
getAllTransactions() - Fetch all transactions
getCustomerTransactions(customerId) - Fetch customer's history
redeemReward(customerId, rewardId) - Process redemption:
Validate customer exists
Validate reward exists and is active
Check sufficient points
Check stock availability
Deduct points
Decrement inventory
Create transaction record
All wrapped in database transaction (atomic)
earnPoints(customerId, points, description) - Award points, create transaction

Example:

async redeemReward(customerId, rewardId) {
  return await prisma.$transaction(async (tx) => {
    // 1. Validate customer
    // 2. Validate reward
    // 3. Check points
    // 4. Check stock
    // 5. Deduct points
    // 6. Update inventory
    // 7. Create transaction
  });
}

6. repositories/ - Data Access Layer
Purpose: Abstract database operations, isolate Prisma queries

Responsibilities:

Execute database queries (CRUD)
Build Prisma queries
Return raw data (no business logic)
Include related data where needed
admin.repository.js
findByEmail(email) - Find admin by email
findById(id) - Find admin by ID
create(data) - Create admin
customer.repository.js
findAll() - Get all customers
findById(id) - Get customer with transactions
findByEmail(email) - Find by email
create(data) - Create customer
update(id, data) - Update customer
delete(id) - Delete customer
updatePoints(id, points) - Update points directly
reward.repository.js
findAll() - Get all rewards with inventory
findById(id) - Get reward with inventory
create(data) - Create reward
update(id, data) - Update reward
delete(id) - Delete reward
transaction.repository.js
findAll() - Get all transactions with customer/reward
findByCustomerId(customerId) - Get customer's transactions
create(data) - Create transaction
inventory.repository.js
findByRewardId(rewardId) - Get inventory for reward
updateQuantity(rewardId, quantity) - Set quantity
decrementStock(rewardId, amount) - Decrement stock
create(data) - Create inventory record

async findById(id) {
  return await prisma.customer.findUnique({
    where: { id },
    include: { transactions: true }, // Include related data
  });
}

7. utils/ - Utility Functions
Purpose: Reusable helper functions

response.util.js
ApiResponse.success(res, data, message, statusCode)

Formats successful responses
Consistent structure: { success: true, message, data }
ApiResponse.error(res, message, statusCode, errors)

Formats error responses
Consistent structure: { success: false, message, errors }
error.util.js
Custom error classes:

AppError - Base error class
ValidationError - 400 errors (bad input)
UnauthorizedError - 401 errors (auth failed)
NotFoundError - 404 errors (resource not found)

Usage:
throw new ValidationError('Insufficient points');
throw new NotFoundError('Customer not found');

8. Root Files
app.js
Express app setup
Middleware configuration (cors, json parsing)
Route mounting (/api)
Error handler (must be last)
Exported for testing
server.js
Entry point
Loads environment variables
Imports app.js
Starts server on configured port
Data Flow Example
Request: POST /api/transactions/redeem

1. Client sends request with { customerId, rewardId }
                    ↓
2. Express receives request → auth.middleware validates JWT
                    ↓
3. Route matches → calls transactionController.redeemReward()
                    ↓
4. Controller extracts data → calls transactionService.redeemReward()
                    ↓
5. Service validates business rules:
   - Customer exists?
   - Reward exists and active?
   - Sufficient points?
   - Stock available?
                    ↓
6. Service orchestrates repositories:
   - customerRepository.updatePoints()
   - inventoryRepository.decrementStock()
   - transactionRepository.create()
   [All wrapped in database transaction]
                    ↓
7. Service returns transaction object to controller
                    ↓
8. Controller formats response using ApiResponse.success()
                    ↓
9. Response sent to client: { success: true, data: {...} }

API Response Format
Success Response

{
  "success": true,
  "message": "Reward redeemed successfully",
  "data": {
    "id": "uuid",
    "customerId": "uuid",
    "rewardId": "uuid",
    "points": -100,
    "type": "REDEEM"
  }
}

Error Response

{
  "success": false,
  "message": "Insufficient points",
  "errors": null
}

Authentication Flow
Client calls POST /api/auth/admin/login with email + password
authService.adminLogin() validates credentials
Generates JWT token with payload: { id, email, role: 'admin' }
Returns token to client
Client includes token in headers: Authorization: Bearer <token>
authMiddleware validates token on protected routes
Adds decoded user to req.user
Environment Variables
Required in backend/.env:

DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000

Testing Endpoints

Health Check: GET http://localhost:3000/health

Admin Login:

POST http://localhost:3000/api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

Get All Customers (requires auth):

GET http://localhost:3000/api/customers
Authorization: Bearer <token>

Next Steps
Add input validation (Joi/Zod)
Add pagination to list endpoints
Add filtering and search
Add unit tests
Add API documentation (Swagger)
Last Updated: 2026-02-22