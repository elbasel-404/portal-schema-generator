# Portal API Generator

A TypeScript utility for generating type-safe API schemas and interfaces from portal endpoints. This tool automatically generates Zod schemas and TypeScript types from JSON API responses, ensuring type safety and reducing boilerplate code in portal applications.

## 🚀 Features

- **Automatic Schema Generation**: Generate Zod schemas from JSON API responses
- **TypeScript Interface Generation**: Create strongly-typed interfaces for API models
- **Endpoint Management**: Centralized management of API endpoints with request/response validation
- **Type Safety**: Full TypeScript support with runtime validation using Zod
- **Portal Integration**: Specifically designed for portal systems with employee data and transaction management

## 📋 Requirements

- **Runtime**: Bun (recommended) or Node.js 18+
- **TypeScript**: Version 5.0+
- **Package Manager**: PNPM (preferred) or npm

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/elbasel42/portal-api-gen.git
   cd portal-api-gen
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Install Bun (if not already installed)**:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

## 🎯 Quick Start

### Generate Schema for Details Endpoints
```bash
npm run generate:details
```

### Generate Schema for Create Endpoints
```bash
npm run generate:create
```

## 📁 Project Structure

```
portal-api-gen/
├── lib/                    # Core library files
│   ├── endpoints.json      # API endpoint definitions
│   └── disabled_endpoints.json
├── scripts/                # Generation scripts
│   ├── generate.details.ts # Details endpoint generator
│   └── generate.create.ts  # Create endpoint generator
├── utils/                  # Utility functions
│   ├── http/              # HTTP-related utilities
│   ├── model/             # Model generation utilities
│   └── io/                # File I/O utilities
├── schemas/               # Generated Zod schemas (git submodule)
├── json/                  # Cached JSON responses
├── constants/             # Application constants
└── type/                  # TypeScript type definitions
```

## 📊 How It Works

1. **Endpoint Configuration**: Define API endpoints in `lib/endpoints.json`
2. **Response Fetching**: Scripts fetch actual API responses
3. **Schema Generation**: Uses quicktype-core to generate Zod schemas from JSON
4. **Type Generation**: Creates TypeScript interfaces for type safety
5. **File Output**: Saves generated schemas and types to appropriate directories

## 🔧 Configuration

### Endpoint Definition Format

```json
{
  "name": "transaction-list",
  "url": "po/read/retrieve-my-requests",
  "createUrl": null,
  "description": "get my request",
  "method": "POST",
  "listRequestBody": {
    "employee_id": 305
  },
  "detailsRequestBody": {
    "employee_id": 305
  },
  "createRequestBody": null
}
```

### Environment Variables

Create a `.env` file for configuration:
```env
API_BASE_URL=https://your-portal-api.com
API_TOKEN=your-api-token
EMPLOYEE_ID=your-employee-id
```

## 📚 Usage Examples

### Basic Schema Generation

```typescript
import { getModelZodSchema } from '@utils/model';

// Generate Zod schema from JSON response
const schema = await getModelZodSchema('UserProfile', jsonResponse);
```

### HTTP Utilities

```typescript
import { getFetchHeaders, getFetchUrl } from '@utils/http';

// Get configured headers for API requests
const headers = await getFetchHeaders();

// Build complete URL for endpoint
const url = await getFetchUrl('po/read/user-profile');
```

### Model Utilities

```typescript
import { getModelInterface } from '@utils/model';

// Generate TypeScript interface
const interface = await getModelInterface('UserData', jsonData);
```

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Use path aliases defined in `tsconfig.json`

## 🐛 Troubleshooting

### Common Issues

**Q: Bun command not found**
A: Install Bun using `curl -fsSL https://bun.sh/install | bash`

**Q: Permission denied on API requests**
A: Check your API token and endpoint permissions

**Q: Schema generation fails**
A: Verify the JSON response format is valid

For more help, see our [Troubleshooting Guide](./docs/TROUBLESHOOTING.md).
