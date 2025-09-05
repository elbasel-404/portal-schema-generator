# Development Guide

This guide provides detailed information for developers working on the Portal API Generator project.

## 🚀 Environment Setup

### System Requirements

- **Operating System**: macOS, Linux, or Windows with WSL2
- **Runtime**: Bun 1.0+ (recommended) or Node.js 18+
- **Package Manager**: PNPM 8+ (preferred) or npm 9+
- **TypeScript**: 5.0+
- **Git**: 2.35+

### Initial Setup

1. **Install Bun** (recommended runtime):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Clone repository with submodules**:
   ```bash
   git clone --recursive https://github.com/elbasel42/portal-api-gen.git
   cd portal-api-gen
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

4. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API credentials
   ```

### Development Environment Configuration

#### Environment Variables

Create a `.env` file with the following variables:

```env
# API Configuration
API_BASE_URL=https://your-portal-api.com
API_TOKEN=your-authentication-token
API_TIMEOUT=30000

# Default Employee ID (for testing)
DEFAULT_EMPLOYEE_ID=305

# Generation Settings
OUTPUT_DIR=./schemas
CACHE_DIR=./json
LOG_LEVEL=info

# Development Settings
NODE_ENV=development
DEBUG=portal-api-gen:*
```

#### TypeScript Configuration

The project uses path aliases defined in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@lib/*": ["./lib/*"],
      "@utils/*": ["./utils/*"],
      "@schemas/*": ["./schemas/*"],
      "@models/*": ["./models/*"],
      "@type/*": ["./type/*"],
      "@constants/*": ["./constants/*"]
    }
  }
}
```

Always use these aliases in your imports:

```typescript
// ✅ Correct
import endpoints from '@lib/endpoints.json';
import { getModelZodSchema } from '@utils/model';

// ❌ Avoid
import endpoints from '../lib/endpoints.json';
import { getModelZodSchema } from '../../utils/model';
```

## 🛠️ Development Workflow

### Daily Development

1. **Start with fresh dependencies**:
   ```bash
   pnpm install
   ```

2. **Check current state**:
   ```bash
   git status
   git pull origin main
   ```

3. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Develop and test iteratively**:
   ```bash
   # Make changes
   npm run generate:details  # Test details generation
   npm run generate:create   # Test create generation
   ```

5. **Commit frequently**:
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

### Code Generation Scripts

#### Details Generation (`generate:details`)

```bash
npm run generate:details
```

This script:
- Reads endpoint configurations from `lib/endpoints.json`
- Fetches API responses for list/detail operations
- Generates Zod schemas for response validation
- Saves schemas to `schemas/{endpoint}/details.schema.ts`
- Caches responses in `json/{endpoint}/details.json`

#### Create Generation (`generate:create`)

```bash
npm run generate:create
```

This script:
- Processes endpoints with `createRequestBody` defined
- Makes POST requests with sample data
- Generates schemas for both request bodies and responses
- Handles success and error response patterns

### Working with Submodules

The `schemas` directory is a Git submodule:

```bash
# Initialize submodules (first time)
git submodule update --init --recursive

# Update schemas submodule
cd schemas
git checkout main
git pull origin main
cd ..

# Commit submodule updates
git add schemas
git commit -m "update schemas submodule"

# Push submodule changes
cd schemas
git add .
git commit -m "update generated schemas"
git push origin main
cd ..
```

## 🏗️ Adding New Features

### Adding a New Endpoint

1. **Define the endpoint** in `lib/endpoints.json`:
   ```json
   {
     "name": "new-endpoint",
     "url": "po/read/new-endpoint",
     "createUrl": "po/create/new-endpoint",
     "description": "Description of the new endpoint",
     "method": "POST",
     "listRequestBody": {
       "employee_id": 305
     },
     "createRequestBody": {
       "employee_id": 305,
       "data": "sample"
     }
   }
   ```

2. **Test the configuration**:
   ```bash
   npm run generate:details
   npm run generate:create
   ```

3. **Verify generated files**:
   ```bash
   ls -la schemas/new-endpoint/
   # Should contain: details.schema.ts, create.body.schema.ts, etc.
   ```

### Adding New Utility Functions

1. **Create the utility file**:
   ```typescript
   // utils/new-category/newUtility.ts
   /**
    * Description of what this utility does
    * @param param1 - Description of parameter
    * @returns Description of return value
    */
   export async function newUtility(param1: string): Promise<string> {
     // Implementation
   }
   ```

2. **Export from index**:
   ```typescript
   // utils/new-category/index.ts
   export { newUtility } from './newUtility';
   ```

3. **Update main utils index** (if needed):
   ```typescript
   // utils/index.ts
   export * from './new-category';
   ```

4. **Add tests**:
   ```typescript
   // tests/utils/newUtility.test.ts
   import { newUtility } from '@utils/new-category';

   describe('newUtility', () => {
     it('should perform expected operation', async () => {
       const result = await newUtility('test');
       expect(result).toBe('expected');
     });
   });
   ```

### Creating New Generator Scripts

1. **Create the script file**:
   ```typescript
   // scripts/generate.newtype.ts
   import endpoints from '@lib/endpoints.json';
   import { writeStringToFile } from '@utils/io';

   async function generateNewType() {
     for (const endpoint of endpoints) {
       // Generation logic
       const generated = await processEndpoint(endpoint);
       await writeStringToFile({
         filePath: `./schemas/${endpoint.name}/newtype.schema.ts`,
         data: generated
       });
     }
   }

   generateNewType().catch(console.error);
   ```

2. **Add npm script**:
   ```json
   // package.json
   {
     "scripts": {
       "generate:newtype": "bun ./scripts/generate.newtype.ts"
     }
   }
   ```

3. **Test the new script**:
   ```bash
   npm run generate:newtype
   ```

## 🔧 Debugging

### Debug Logging

Enable debug logging:

```bash
DEBUG=portal-api-gen:* npm run generate:details
```

Add debug statements to your code:

```typescript
import { getLogger } from '@utils/io/getLogger';

const logger = getLogger({ logFileName: 'debug' });

logger.info('Processing endpoint:', endpoint.name);
logger.error('Failed to process:', error);
```

### Common Debug Scenarios

#### Schema Generation Issues

```typescript
// Add detailed logging to generation
console.log('Input JSON:', JSON.stringify(responseData, null, 2));
const schema = await getModelZodSchema(name, JSON.stringify(responseData));
console.log('Generated schema:', schema);
```

#### HTTP Request Problems

```typescript
// Debug HTTP requests
const url = await getFetchUrl(endpoint.url);
const headers = await getFetchHeaders();
console.log('Request URL:', url);
console.log('Request headers:', headers);

const response = await fetch(url, { method, headers, body });
console.log('Response status:', response.status);
console.log('Response headers:', Object.fromEntries(response.headers));
```

#### File System Issues

```typescript
// Debug file operations
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const filePath = './schemas/endpoint/file.ts';
const dir = dirname(filePath);

console.log('Directory exists:', existsSync(dir));
console.log('File path:', filePath);
```

### Using Browser DevTools (for Node.js)

```bash
# Run with Node.js inspector
node --inspect-brk ./scripts/generate.details.js
# Then open chrome://inspect in Chrome
```

## 🧪 Testing

### Manual Testing

1. **Test with sample data**:
   ```bash
   # Create test endpoint configuration
   echo '{"name": "test", "url": "test", "method": "GET"}' > test-endpoint.json
   ```

2. **Test individual utilities**:
   ```typescript
   // Create test script
   import { getModelZodSchema } from '@utils/model';
   
   const testJson = '{"id": 1, "name": "test"}';
   const schema = await getModelZodSchema('Test', testJson);
   console.log(schema);
   ```

3. **Test error scenarios**:
   ```bash
   # Test with invalid endpoint
   # Test with network failure
   # Test with malformed JSON
   ```

### Integration Testing

Create test scripts for full workflows:

```typescript
// scripts/test-integration.ts
import { testEndpointGeneration } from './test-helpers';

async function runIntegrationTests() {
  const results = await Promise.allSettled([
    testEndpointGeneration('transaction-list'),
    testEndpointGeneration('ad-news'),
    // ... other endpoints
  ]);

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Test ${index} failed:`, result.reason);
    }
  });
}
```

## 📊 Performance Optimization

### Profiling

1. **Memory usage**:
   ```bash
   node --max-old-space-size=4096 --trace-gc ./scripts/generate.details.js
   ```

2. **CPU profiling**:
   ```bash
   node --prof ./scripts/generate.details.js
   node --prof-process isolate-*.log > processed.txt
   ```

### Optimization Strategies

1. **Batch processing**:
   ```typescript
   // Process endpoints in batches
   const batchSize = 5;
   for (let i = 0; i < endpoints.length; i += batchSize) {
     const batch = endpoints.slice(i, i + batchSize);
     await Promise.all(batch.map(processEndpoint));
   }
   ```

2. **Caching**:
   ```typescript
   // Cache expensive operations
   const cache = new Map();
   function cachedOperation(key: string) {
     if (cache.has(key)) {
       return cache.get(key);
     }
     const result = expensiveOperation(key);
     cache.set(key, result);
     return result;
   }
   ```

3. **Stream processing**:
   ```typescript
   // For large files
   import { createReadStream } from 'fs';
   import { pipeline } from 'stream';

   await pipeline(
     createReadStream('large-file.json'),
     new JSONParser(),
     new SchemaGenerator(),
     new FileWriter()
   );
   ```

## 🔒 Security Best Practices

### API Credentials

- Never commit credentials to Git
- Use environment variables for sensitive data
- Rotate tokens regularly
- Use least-privilege access

### Code Security

1. **Input validation**:
   ```typescript
   function validateEndpoint(endpoint: unknown): Endpoint {
     if (!endpoint || typeof endpoint !== 'object') {
       throw new Error('Invalid endpoint configuration');
     }
     // Validate required fields
     return endpoint as Endpoint;
   }
   ```

2. **File path safety**:
   ```typescript
   import { resolve, join } from 'path';

   function safeFilePath(basePath: string, relativePath: string): string {
     const fullPath = resolve(join(basePath, relativePath));
     if (!fullPath.startsWith(resolve(basePath))) {
       throw new Error('Path traversal detected');
     }
     return fullPath;
   }
   ```

## 📝 Code Quality

### Linting Setup

```bash
# Install ESLint (if not already installed)
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Create .eslintrc.js
echo 'module.exports = { ... }' > .eslintrc.js
```

### Pre-commit Hooks

```bash
# Install husky
pnpm add -D husky

# Setup pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

### Code Formatting

```bash
# Install Prettier
pnpm add -D prettier

# Create .prettierrc
echo '{ "semi": true, "singleQuote": true }' > .prettierrc

# Format code
npx prettier --write "**/*.{ts,js,json,md}"
```

This development guide should help you contribute effectively to the Portal API Generator project. For additional questions, please refer to the [Contributing Guidelines](./CONTRIBUTING.md) or open an issue on GitHub.