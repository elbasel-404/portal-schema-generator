# Examples and Tutorials

This document provides practical examples and step-by-step tutorials for using Portal API Generator.

## 🚀 Quick Start Tutorial

### Tutorial 1: Your First Schema Generation

Let's generate schemas for the transaction list endpoint.

#### Step 1: Verify Setup

```bash
# Check if the project is properly set up
cd portal-api-gen
npm run generate:details --dry-run || npm run generate:details
```

#### Step 2: Examine the Configuration

```bash
# Look at the endpoint configuration
cat lib/endpoints.json | jq '.[] | select(.name == "transaction-list")'
```

Expected output:
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

#### Step 3: Generate the Schema

```bash
# Generate schemas for all endpoints
npm run generate:details
```

#### Step 4: Examine the Generated Files

```bash
# Check what was generated
ls -la schemas/transaction-list/
cat schemas/transaction-list/details.schema.ts
```

#### Step 5: Use the Generated Schema

Create a test file to use the schema:

```typescript
// test-schema.ts
import { z } from 'zod';
import { TransactionListSchema } from './schemas/transaction-list/details.schema.js';

// Example API response data
const sampleResponse = {
  success: true,
  data: {
    transactions: [
      {
        id: 1,
        amount: 1000.50,
        date: "2024-01-15",
        status: "completed",
        description: "Salary payment"
      }
    ],
    total: 1,
    page: 1
  }
};

// Validate the response
const result = TransactionListSchema.safeParse(sampleResponse);

if (result.success) {
  console.log('✅ Valid response:', result.data);
  // TypeScript now knows the exact shape of the data
  result.data.data.transactions.forEach(tx => {
    console.log(`Transaction ${tx.id}: $${tx.amount}`);
  });
} else {
  console.error('❌ Invalid response:', result.error.issues);
}
```

## 📋 Common Use Cases

### Use Case 1: Adding a New Portal Endpoint

Let's say you need to add support for a new "employee-profile" endpoint.

#### Step 1: Define the Endpoint

Add to `lib/endpoints.json`:

```json
{
  "name": "employee-profile",
  "url": "po/read/employee-profile",
  "createUrl": "po/update/employee-profile",
  "description": "Employee profile information",
  "method": "POST",
  "listRequestBody": {
    "employee_id": 305
  },
  "detailsRequestBody": {
    "employee_id": 305
  },
  "createRequestBody": {
    "employee_id": 305,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@company.com",
    "department": "Engineering"
  }
}
```

#### Step 2: Generate Schemas

```bash
# Generate read/list schemas
npm run generate:details

# Generate create schemas
npm run generate:create
```

#### Step 3: Verify Generated Files

```bash
ls -la schemas/employee-profile/
# Should contain:
# - details.schema.ts
# - create.body.schema.ts
# - create.response.schema.ts
```

#### Step 4: Integrate in Your Application

```typescript
// employee-service.ts
import { EmployeeProfileSchema } from '@schemas/employee-profile/details.schema';
import { EmployeeProfileCreateRequestBodySchema } from '@schemas/employee-profile/create.body.schema';

export class EmployeeService {
  async getProfile(employeeId: number) {
    const response = await fetch('/api/po/read/employee-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: employeeId })
    });

    const data = await response.json();
    
    // Runtime validation
    const validated = EmployeeProfileSchema.parse(data);
    return validated.data;
  }

  async updateProfile(profileData: unknown) {
    // Validate input
    const validatedInput = EmployeeProfileCreateRequestBodySchema.parse(profileData);
    
    const response = await fetch('/api/po/update/employee-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedInput)
    });

    return response.json();
  }
}
```

### Use Case 2: Handling API Response Validation

When working with external APIs, validation is crucial:

```typescript
// api-client.ts
import { z } from 'zod';
import { AdNewsSchema } from '@schemas/ad-news/details.schema';

export class PortalApiClient {
  private async makeRequest<T>(
    endpoint: string,
    body: object,
    schema: z.ZodSchema<T>
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      
      // Runtime validation with detailed error reporting
      const result = schema.safeParse(rawData);
      
      if (!result.success) {
        console.error('API Response Validation Failed:');
        result.error.issues.forEach(issue => {
          console.error(`- ${issue.path.join('.')}: ${issue.message}`);
        });
        throw new Error('Invalid API response structure');
      }

      return result.data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getNews() {
    return this.makeRequest(
      'po/read/portal-news',
      { employee_id: this.employeeId },
      AdNewsSchema
    );
  }
}
```

### Use Case 3: Type-Safe Form Handling

Use generated schemas for form validation:

```typescript
// forms/employee-form.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeProfileCreateRequestBodySchema } from '@schemas/employee-profile/create.body.schema';

type FormData = z.infer<typeof EmployeeProfileCreateRequestBodySchema>;

export function EmployeeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(EmployeeProfileCreateRequestBodySchema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Data is already validated by the resolver
      const response = await fetch('/api/employee/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Update successful:', result);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name:</label>
        <input 
          {...register('first_name')} 
          type="text" 
        />
        {errors.first_name && (
          <span className="error">{errors.first_name.message}</span>
        )}
      </div>

      <div>
        <label>Email:</label>
        <input 
          {...register('email')} 
          type="email" 
        />
        {errors.email && (
          <span className="error">{errors.email.message}</span>
        )}
      </div>

      <button type="submit">Update Profile</button>
    </form>
  );
}
```

## 🔧 Advanced Examples

### Example 1: Custom Schema Post-Processing

Sometimes you need to modify generated schemas:

```typescript
// scripts/post-process-schemas.ts
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

async function postProcessSchemas() {
  const schemaFiles = await glob('schemas/**/*.schema.ts');

  for (const filePath of schemaFiles) {
    let content = readFileSync(filePath, 'utf-8');

    // Add custom transformations
    content = content.replace(
      /z\.string\(\)/g,
      'z.string().min(1, "This field is required")'
    );

    // Add custom types
    if (content.includes('employee_id')) {
      content = `import { EmployeeId } from '@types/common';\n${content}`;
      content = content.replace(
        /employee_id:\s*z\.number\(\)/g,
        'employee_id: EmployeeId'
      );
    }

    writeFileSync(filePath, content);
  }

  console.log(`Post-processed ${schemaFiles.length} schema files`);
}

postProcessSchemas().catch(console.error);
```

### Example 2: Automated Testing of Generated Schemas

```typescript
// tests/schema-validation.test.ts
import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import { readFileSync } from 'fs';

describe('Generated Schemas', () => {
  it('should have valid TypeScript syntax', async () => {
    const schemaFiles = await glob('schemas/**/*.schema.ts');
    
    for (const filePath of schemaFiles) {
      const content = readFileSync(filePath, 'utf-8');
      
      // Basic syntax checks
      expect(content).toContain('import { z } from "zod"');
      expect(content).toContain('export const');
      expect(content).toContain('export type');
      
      // Ensure no syntax errors (this would throw if invalid)
      expect(() => {
        eval(content.replace(/import.*from.*$/gm, ''));
      }).not.toThrow();
    }
  });

  it('should export correct schema names', async () => {
    const schemaFiles = await glob('schemas/**/details.schema.ts');
    
    for (const filePath of schemaFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const endpointName = filePath.split('/')[1];
      const expectedSchemaName = endpointName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('') + 'Schema';
      
      expect(content).toContain(`export const ${expectedSchemaName}`);
    }
  });
});
```

### Example 3: Dynamic Endpoint Configuration

Load endpoints from multiple sources:

```typescript
// scripts/dynamic-endpoints.ts
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

interface EndpointSource {
  name: string;
  loader: () => Promise<any[]>;
}

const sources: EndpointSource[] = [
  {
    name: 'static',
    loader: async () => JSON.parse(readFileSync('lib/endpoints.json', 'utf-8'))
  },
  {
    name: 'api-docs',
    loader: async () => {
      const response = await fetch('https://api.portal.com/docs/endpoints.json');
      return response.json();
    }
  },
  {
    name: 'config-files',
    loader: async () => {
      const configFiles = await glob('config/endpoints/*.json');
      const endpoints = [];
      
      for (const file of configFiles) {
        const config = JSON.parse(readFileSync(file, 'utf-8'));
        endpoints.push(...config.endpoints);
      }
      
      return endpoints;
    }
  }
];

async function mergeEndpointConfigurations() {
  const allEndpoints = [];
  
  for (const source of sources) {
    try {
      const endpoints = await source.loader();
      console.log(`Loaded ${endpoints.length} endpoints from ${source.name}`);
      allEndpoints.push(...endpoints);
    } catch (error) {
      console.warn(`Failed to load endpoints from ${source.name}:`, error.message);
    }
  }

  // Remove duplicates by name
  const uniqueEndpoints = allEndpoints.reduce((acc, endpoint) => {
    if (!acc.find(e => e.name === endpoint.name)) {
      acc.push(endpoint);
    }
    return acc;
  }, []);

  // Write merged configuration
  writeFileSync(
    'lib/endpoints.generated.json',
    JSON.stringify(uniqueEndpoints, null, 2)
  );

  console.log(`Merged ${uniqueEndpoints.length} unique endpoints`);
}

mergeEndpointConfigurations().catch(console.error);
```

## 🎯 Best Practices Examples

### Example 1: Error Handling Strategy

```typescript
// utils/safe-generation.ts
import { getLogger } from '@utils/io/getLogger';

const logger = getLogger({ logFileName: 'safe-generation' });

export async function safeGenerateSchema(
  endpoint: Endpoint,
  generator: (endpoint: Endpoint) => Promise<string>
): Promise<{ success: boolean; schema?: string; error?: string }> {
  try {
    logger.info(`Starting generation for ${endpoint.name}`);
    
    const schema = await generator(endpoint);
    
    // Validate generated schema
    if (!schema || schema.length < 50) {
      throw new Error('Generated schema appears to be empty or too short');
    }

    if (!schema.includes('z.object')) {
      throw new Error('Generated schema does not contain expected Zod patterns');
    }

    logger.info(`Successfully generated schema for ${endpoint.name}`);
    return { success: true, schema };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to generate schema for ${endpoint.name}: ${errorMessage}`);
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
}

// Usage
const results = await Promise.allSettled(
  endpoints.map(endpoint =>
    safeGenerateSchema(endpoint, generateDetailSchema)
  )
);

const summary = results.reduce((acc, result) => {
  if (result.status === 'fulfilled' && result.value.success) {
    acc.successful++;
  } else {
    acc.failed++;
  }
  return acc;
}, { successful: 0, failed: 0 });

console.log(`Generation complete: ${summary.successful} successful, ${summary.failed} failed`);
```

### Example 2: Performance Monitoring

```typescript
// utils/performance-monitor.ts
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  async time<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.recordMetric(operation, duration);
      console.log(`✅ ${operation}: ${duration.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.log(`❌ ${operation}: ${duration.toFixed(2)}ms (failed)`);
      throw error;
    }
  }

  private recordMetric(operation: string, duration: number) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(duration);
  }

  getStats(operation: string) {
    const times = this.metrics.get(operation) || [];
    if (times.length === 0) return null;

    const avg = times.reduce((a, b) => a + b) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    return { avg, min, max, count: times.length };
  }

  printSummary() {
    console.log('\n📊 Performance Summary:');
    for (const [operation, times] of this.metrics) {
      const stats = this.getStats(operation);
      if (stats) {
        console.log(`${operation}: avg=${stats.avg.toFixed(2)}ms, min=${stats.min.toFixed(2)}ms, max=${stats.max.toFixed(2)}ms (${stats.count} runs)`);
      }
    }
  }
}

// Usage in generation scripts
const monitor = new PerformanceMonitor();

for (const endpoint of endpoints) {
  await monitor.time(`generate-${endpoint.name}`, async () => {
    await generateSchemaForEndpoint(endpoint);
  });
}

monitor.printSummary();
```

These examples demonstrate practical, real-world usage patterns for the Portal API Generator. They show how to integrate the generated schemas into applications, handle errors gracefully, and extend the functionality for specific use cases.