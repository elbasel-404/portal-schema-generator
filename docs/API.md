# API Documentation

This document provides comprehensive information about the Portal API Generator's endpoints, schemas, and usage patterns.

## 🔌 Endpoint Configuration

### Endpoint Definition Schema

All API endpoints are defined in `lib/endpoints.json` following this structure:

```typescript
interface Endpoint {
  name: string;              // Unique identifier for the endpoint
  url: string;               // Relative API path
  createUrl: string | null;  // Optional create endpoint path
  description?: string;      // Human-readable description
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  listRequestBody?: object;  // Request body for list operations
  detailsRequestBody?: object; // Request body for detail operations
  createRequestBody?: object | null; // Request body for create operations
}
```

### Available Endpoints

#### Transaction Management
- **transaction-list**: Retrieve user transaction requests
  - Method: `POST`
  - URL: `po/read/retrieve-my-requests`
  - Request Body: `{ "employee_id": number }`

#### News & Announcements
- **ad-news**: Portal announcements and advertisements
  - Method: `POST`
  - URL: `po/read/portal-news`

- **family-news**: Family-related news and updates
  - Method: `POST`
  - URL: `po/read/family-news`

#### Employee Services
- **bank-details**: Employee banking information
  - Method: `POST`
  - URL: `po/read/bank-details`

- **change-bank-account**: Bank account modification requests
  - Method: `POST`
  - URL: `po/read/change-bank-account`

#### Travel & Leave
- **holiday**: Holiday and vacation requests
  - Method: `POST`
  - URL: `po/read/holiday`

- **destination**: Travel destination management
  - Method: `POST`
  - URL: `po/read/destination`

#### Asset Management
- **custody**: Asset custody and tracking
  - Method: `POST`
  - URL: `po/read/custody`

## 🏗️ Schema Generation

### Generated File Structure

For each endpoint, the generator creates:

```
schemas/{endpoint-name}/
├── details.schema.ts       # Zod schema for details response
├── create.body.schema.ts   # Zod schema for create request body
└── create.response.schema.ts # Zod schema for create response
```

### Schema Types

#### Details Schema
Generated from the response of detail/list operations:

```typescript
// Example: schemas/transaction-list/details.schema.ts
import { z } from "zod";

export const TransactionListSchema = z.object({
  transactions: z.array(z.object({
    id: z.number(),
    amount: z.number(),
    date: z.string(),
    status: z.string(),
    // ... other fields
  })),
  total: z.number(),
  page: z.number()
});

export type TransactionList = z.infer<typeof TransactionListSchema>;
```

#### Create Request Body Schema
Generated from the create request body definition:

```typescript
// Example: schemas/transaction-list/create.body.schema.ts
import { z } from "zod";

export const TransactionListCreateRequestBodySchema = z.object({
  employee_id: z.number(),
  amount: z.number(),
  description: z.string(),
  // ... other required fields
});

export type TransactionListCreateRequestBody = z.infer<typeof TransactionListCreateRequestBodySchema>;
```

#### Create Response Schema
Generated from actual create operation responses:

```typescript
// Example: schemas/transaction-list/create.response.schema.ts
import { z } from "zod";

export const TransactionListCreateResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    // ... created object fields
  }).optional()
});

export type TransactionListCreateResponse = z.infer<typeof TransactionListCreateResponseSchema>;
```

## 🔧 HTTP Configuration

### Headers
The system automatically configures API headers including:
- Authentication tokens
- Content-Type headers
- Custom portal headers

```typescript
const headers = await getFetchHeaders();
// Returns configured headers for API requests
```

### URL Building
Base URLs and paths are automatically combined:

```typescript
const fullUrl = await getFetchUrl('po/read/user-profile');
// Returns: https://api.portal.com/po/read/user-profile
```

## 📝 Request/Response Patterns

### Standard Request Format
```typescript
{
  "employee_id": number,    // Required for most endpoints
  "page"?: number,          // Optional pagination
  "limit"?: number,         // Optional page size
  // ... endpoint-specific fields
}
```

### Standard Response Format
```typescript
{
  "success": boolean,
  "message": string,
  "data": any,              // Varies by endpoint
  "errors"?: string[],      // Present on validation errors
  "pagination"?: {          // Present on paginated responses
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  }
}
```

## 🔍 Validation

### Runtime Validation
All generated schemas provide runtime validation:

```typescript
import { TransactionListSchema } from '@schemas/transaction-list/details.schema';

// Validate API response
const result = TransactionListSchema.safeParse(apiResponse);
if (result.success) {
  // Type-safe access to result.data
  console.log(result.data.transactions);
} else {
  // Handle validation errors
  console.error(result.error.issues);
}
```

### Type Safety
Generated types ensure compile-time safety:

```typescript
import type { TransactionList } from '@schemas/transaction-list/details.schema';

function processTransactions(data: TransactionList) {
  // data is fully typed
  data.transactions.forEach(tx => {
    console.log(tx.amount); // TypeScript knows this is a number
  });
}
```

## 🚨 Error Handling

### Common Error Responses

#### Authentication Error (401)
```json
{
  "success": false,
  "message": "Unauthorized access",
  "error_code": "AUTH_FAILED"
}
```

#### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "employee_id is required",
    "amount must be positive"
  ]
}
```

#### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error",
  "error_code": "INTERNAL_ERROR"
}
```

## 🔄 Regeneration

To update schemas when API responses change:

1. **Update endpoint definitions** in `lib/endpoints.json`
2. **Run detail generation**: `npm run generate:details`
3. **Run create generation**: `npm run generate:create`
4. **Commit updated schemas** to the schemas submodule

## 📈 Performance Considerations

- **Caching**: API responses are cached in the `json/` directory
- **Incremental Generation**: Only changed endpoints are regenerated
- **Batch Processing**: Multiple endpoints can be processed in parallel
- **Error Recovery**: Failed requests don't stop the entire generation process

## 🔗 Related Resources

- [Schema Generation Guide](./SCHEMA_GENERATION.md)
- [Development Guide](./DEVELOPMENT.md)
- [Troubleshooting](./TROUBLESHOOTING.md)