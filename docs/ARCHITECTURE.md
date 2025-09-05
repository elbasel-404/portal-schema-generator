# Architecture Overview

This document provides a comprehensive overview of the Portal API Generator's architecture, design patterns, and system components.

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Endpoint      │    │   Generation    │    │   Output        │
│   Configuration │───▶│   Scripts       │───▶│   Schemas       │
│                 │    │                 │    │                 │
│ • endpoints.json│    │ • generate.*.ts │    │ • Zod schemas   │
│ • disabled.json │    │ • HTTP utils    │    │ • TS interfaces │
│ • API specs     │    │ • Model utils   │    │ • JSON cache    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   External API  │
                       │                 │
                       │ • Portal API    │
                       │ • Live data     │
                       │ • Responses     │
                       └─────────────────┘
```

### Core Components

#### 1. Configuration Layer (`/lib`)
- **Endpoint Definitions**: Centralized API endpoint configuration
- **Feature Flags**: Disabled endpoints management
- **Metadata**: Endpoint descriptions and specifications

#### 2. Generation Engine (`/scripts`)
- **Detail Generator**: Processes read/list operations
- **Create Generator**: Handles create/update operations
- **Orchestration**: Manages generation workflow

#### 3. Utility Layer (`/utils`)
- **HTTP Utils**: API communication and response handling
- **Model Utils**: Schema and type generation using quicktype
- **I/O Utils**: File system operations and logging

#### 4. Output Layer (`/schemas`, `/json`)
- **Generated Schemas**: Zod validation schemas
- **Type Definitions**: TypeScript interfaces
- **Response Cache**: Stored API responses for reference

## 🔧 Core Components Detail

### Configuration Management

```typescript
// lib/endpoints.json structure
interface EndpointConfig {
  name: string;                    // Unique identifier
  url: string;                     // API endpoint path
  createUrl: string | null;        // Optional create endpoint
  description?: string;            // Human-readable description
  method: HttpMethod;              // HTTP method
  listRequestBody?: RequestBody;   // List operation payload
  detailsRequestBody?: RequestBody; // Details operation payload
  createRequestBody?: RequestBody; // Create operation payload
}
```

**Design Principles:**
- **Single Source of Truth**: All endpoint configs in one place
- **Extensibility**: Easy to add new endpoints
- **Validation**: Schema validation for configuration files

### Generation Pipeline

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Config    │───▶│   Fetch     │───▶│  Transform  │───▶│   Output    │
│   Loading   │    │   Response  │    │   to Schema │    │   Files     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
   • Parse JSON        • HTTP request      • quicktype-core    • Write schemas
   • Validate          • Auth headers      • Zod generation    • Create types
   • Filter active     • Error handling    • Type inference    • Update cache
```

**Pipeline Stages:**

1. **Configuration Loading**
   ```typescript
   const endpoints = await loadEndpoints();
   const activeEndpoints = filterDisabled(endpoints);
   ```

2. **Response Fetching**
   ```typescript
   const response = await fetch(url, {
     method: endpoint.method,
     headers: await getFetchHeaders(),
     body: JSON.stringify(endpoint.requestBody)
   });
   ```

3. **Schema Generation**
   ```typescript
   const zodSchema = await getModelZodSchema(
     endpoint.name,
     JSON.stringify(response.data)
   );
   ```

4. **File Output**
   ```typescript
   await writeStringToFile({
     filePath: `./schemas/${endpoint.name}/details.schema.ts`,
     data: zodSchema
   });
   ```

### HTTP Layer Architecture

```typescript
// utils/http/index.ts - Centralized HTTP utilities
export interface HttpConfig {
  baseUrl: string;
  headers: Record<string, string>;
  timeout: number;
  retries: number;
}

// Modular design
export { getFetchHeaders } from './getFetchHeaders';
export { getFetchUrl } from './getFetchUrl';
export { writeResponseToFile } from './writeResponseToFile';
```

**Features:**
- **Authentication Management**: Centralized token handling
- **URL Construction**: Base URL + endpoint path resolution
- **Response Handling**: Standardized response processing
- **Error Handling**: Retry logic and error recovery

### Model Generation System

```typescript
// utils/model/ - Schema generation utilities
interface ModelGenerator {
  getModelZodSchema(name: string, json: string): Promise<string>;
  getModelInterface(name: string, json: string): Promise<string>;
  getModelJsonSchema(name: string, json: string): Promise<object>;
}
```

**Architecture:**
- **quicktype Integration**: Uses quicktype-core for code generation
- **Multi-format Output**: Supports Zod, TypeScript, JSON Schema
- **Type Safety**: Runtime and compile-time validation

## 🎯 Design Patterns

### 1. Configuration-Driven Architecture

The system uses configuration files to drive behavior:

```json
{
  "name": "transaction-list",
  "url": "po/read/retrieve-my-requests",
  "method": "POST",
  "listRequestBody": { "employee_id": 305 }
}
```

**Benefits:**
- **Flexibility**: Easy to modify without code changes
- **Maintainability**: Centralized endpoint management
- **Scalability**: Simple to add new endpoints

### 2. Plugin-Based Generation

Each generator operates independently:

```typescript
// Extensible generator pattern
interface Generator {
  name: string;
  generate(endpoint: Endpoint): Promise<void>;
}

const generators = [
  new DetailsGenerator(),
  new CreateGenerator(),
  // Easy to add new generators
];
```

### 3. Utility-First Design

Modular utilities enable composition:

```typescript
// Composable utility functions
const result = await pipe(
  loadEndpoints,
  filterActive,
  fetchResponses,
  generateSchemas,
  writeFiles
)(config);
```

### 4. Error Recovery Pattern

Graceful degradation on failures:

```typescript
// Individual endpoint failures don't stop the entire process
for (const endpoint of endpoints) {
  try {
    await processEndpoint(endpoint);
    successCount++;
  } catch (error) {
    logger.error(`Failed to process ${endpoint.name}:`, error);
    errorCount++;
    // Continue with next endpoint
  }
}
```

## 📁 Directory Structure & Responsibilities

```
portal-api-gen/
├── lib/                     # Configuration & Core Data
│   ├── endpoints.json       # ✨ Primary endpoint definitions
│   └── disabled_endpoints.json # Temporarily disabled endpoints
│
├── scripts/                 # 🔧 Generation Scripts
│   ├── generate.details.ts  # Processes read/list operations
│   ├── generate.create.ts   # Handles create operations
│   └── data.json           # Generation metadata
│
├── utils/                   # 🛠️ Utility Libraries
│   ├── http/               # HTTP communication layer
│   │   ├── getFetchHeaders.ts
│   │   ├── getFetchUrl.ts
│   │   └── writeResponseToFile.ts
│   ├── model/              # Schema generation utilities
│   │   ├── getModelZodSchema.ts
│   │   ├── getModelInterface.ts
│   │   └── quicktypeJSON.ts
│   └── io/                 # File I/O operations
│       ├── writeStringToFile.ts
│       └── getLogger.ts
│
├── schemas/                 # 📄 Generated Output (Git Submodule)
│   └── {endpoint-name}/
│       ├── details.schema.ts
│       ├── create.body.schema.ts
│       └── create.response.schema.ts
│
├── json/                    # 💾 Response Cache
│   └── {endpoint-name}/
│       ├── details.json
│       └── create.json
│
├── constants/              # 📋 Application Constants
│   └── paths/
│       └── logs/
│
├── type/                   # 🏷️ TypeScript Definitions
├── logs/                   # 📊 Operation Logs
└── docs/                   # 📚 Documentation
```

## 🔄 Data Flow

### 1. Configuration to Execution

```
endpoints.json → validate → filter active → queue for processing
```

### 2. HTTP Request Cycle

```
endpoint config → build URL → add headers → make request → handle response
```

### 3. Schema Generation Flow

```
JSON response → quicktype analysis → Zod schema → TypeScript types → file output
```

### 4. Error Handling Flow

```
operation failure → log error → continue processing → report summary
```

## 🚀 Performance Characteristics

### Scalability

- **Parallel Processing**: Multiple endpoints can be processed concurrently
- **Incremental Updates**: Only changed endpoints need regeneration
- **Caching**: Responses are cached to avoid redundant API calls

### Memory Management

- **Streaming**: Large responses are processed in chunks
- **Cleanup**: Temporary data is cleared after processing
- **Efficient Parsing**: Optimized JSON parsing for large datasets

### Network Optimization

- **Connection Pooling**: Reuses HTTP connections
- **Request Batching**: Groups related requests when possible
- **Retry Logic**: Handles transient network failures

## 🔒 Security Considerations

### Authentication

- **Token Management**: Secure storage and rotation of API tokens
- **Header Security**: Proper handling of sensitive headers
- **Environment Isolation**: Separation of dev/prod credentials

### Data Handling

- **Input Validation**: All endpoint configurations are validated
- **Output Sanitization**: Generated code is sanitized
- **Error Information**: Sensitive data excluded from error logs

## 🧪 Testing Strategy

### Unit Testing Approach

```typescript
// Example test structure
describe('ModelGenerator', () => {
  it('should generate valid Zod schema from JSON', async () => {
    const json = '{"id": 1, "name": "test"}';
    const schema = await getModelZodSchema('Test', json);
    expect(schema).toContain('z.object');
  });
});
```

### Integration Testing

- **End-to-End**: Full generation pipeline testing
- **API Mocking**: Mock external API responses for testing
- **File System**: Verify correct file generation

## 🔮 Future Architecture Considerations

### Extensibility Points

1. **Generator Plugins**: Support for additional output formats
2. **Custom Transformers**: User-defined data transformations
3. **Validation Rules**: Configurable validation logic
4. **Output Targets**: Multiple deployment destinations

### Performance Enhancements

1. **Incremental Processing**: Smart change detection
2. **Parallel Execution**: Multi-threaded generation
3. **Caching Strategies**: Advanced response caching
4. **Resource Optimization**: Memory and CPU efficiency

This architecture enables the Portal API Generator to be maintainable, extensible, and performant while providing type-safe API interactions for portal applications.