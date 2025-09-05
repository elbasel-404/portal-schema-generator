# Troubleshooting Guide

This guide helps you resolve common issues when working with Portal API Generator.

## 🚨 Common Issues

### Installation & Setup Issues

#### Issue: "bun: command not found"

**Symptoms:**
```bash
$ npm run generate:details
bun: command not found
```

**Solutions:**

1. **Install Bun**:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   source ~/.bashrc  # or restart terminal
   ```

2. **Use Node.js alternative**:
   ```bash
   # Update package.json scripts to use node instead of bun
   "scripts": {
     "generate:details": "node --loader ts-node/esm ./scripts/generate.details.ts",
     "generate:create": "node --loader ts-node/esm ./scripts/generate.create.ts"
   }
   ```

3. **Install ts-node for Node.js**:
   ```bash
   pnpm add -D ts-node
   ```

#### Issue: TypeScript path aliases not working

**Symptoms:**
```bash
Error: Cannot resolve module '@utils/model'
```

**Solutions:**

1. **Check tsconfig.json paths**:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@utils/*": ["./utils/*"],
         "@lib/*": ["./lib/*"]
       }
     }
   }
   ```

2. **For Node.js, install module resolution**:
   ```bash
   pnpm add -D tsconfig-paths
   ```

3. **Update Node.js scripts**:
   ```bash
   node -r tsconfig-paths/register --loader ts-node/esm script.ts
   ```

#### Issue: Permission denied errors

**Symptoms:**
```bash
EACCES: permission denied, mkdir '/schemas'
```

**Solutions:**

1. **Check directory permissions**:
   ```bash
   ls -la schemas/
   chmod 755 schemas/
   ```

2. **Run with proper permissions**:
   ```bash
   sudo npm run generate:details  # Not recommended
   # Better: fix ownership
   sudo chown -R $USER:$USER ./schemas
   ```

### Generation Script Issues

#### Issue: "Failed to fetch endpoint data"

**Symptoms:**
```bash
Error fetching transaction-list: 401 Unauthorized
```

**Solutions:**

1. **Check API credentials**:
   ```bash
   # Verify .env file exists and has correct values
   cat .env
   ```

2. **Test API access manually**:
   ```bash
   curl -H "Authorization: Bearer $API_TOKEN" $API_BASE_URL/po/read/test
   ```

3. **Update authentication**:
   ```typescript
   // utils/http/getFetchHeaders.ts
   export async function getFetchHeaders() {
     return {
       'Authorization': `Bearer ${process.env.API_TOKEN}`,
       'Content-Type': 'application/json'
     };
   }
   ```

#### Issue: Schema generation fails with invalid JSON

**Symptoms:**
```bash
SyntaxError: Unexpected token in JSON at position 0
```

**Solutions:**

1. **Check API response format**:
   ```typescript
   // Add logging to see raw response
   console.log('Raw response:', await response.text());
   ```

2. **Handle non-JSON responses**:
   ```typescript
   if (!response.headers.get('content-type')?.includes('application/json')) {
     throw new Error('Response is not JSON');
   }
   ```

3. **Validate response structure**:
   ```typescript
   const data = await response.json();
   if (!data || typeof data !== 'object') {
     throw new Error('Invalid response structure');
   }
   ```

#### Issue: quicktype-core fails to generate schema

**Symptoms:**
```bash
Error: quicktype-core failed to process JSON
```

**Solutions:**

1. **Check input JSON validity**:
   ```bash
   echo "$json_data" | jq .  # Validate JSON
   ```

2. **Handle edge cases**:
   ```typescript
   // Sanitize JSON before processing
   function sanitizeJson(jsonString: string): string {
     try {
       const parsed = JSON.parse(jsonString);
       return JSON.stringify(parsed, null, 2);
     } catch (error) {
       throw new Error(`Invalid JSON: ${error.message}`);
     }
   }
   ```

3. **Add fallback schema generation**:
   ```typescript
   try {
     return await getModelZodSchema(name, jsonString);
   } catch (error) {
     console.warn(`Failed to generate schema for ${name}, using fallback`);
     return generateFallbackSchema(name);
   }
   ```

### File System Issues

#### Issue: "Cannot write to schemas directory"

**Symptoms:**
```bash
Error: ENOENT: no such file or directory, open './schemas/endpoint/file.ts'
```

**Solutions:**

1. **Initialize git submodules**:
   ```bash
   git submodule update --init --recursive
   ```

2. **Create missing directories**:
   ```typescript
   import { mkdirSync } from 'fs';
   import { dirname } from 'path';

   function ensureDir(filePath: string) {
     mkdirSync(dirname(filePath), { recursive: true });
   }
   ```

3. **Check submodule status**:
   ```bash
   git submodule status
   # Should show initialized submodules
   ```

#### Issue: Large files causing memory issues

**Symptoms:**
```bash
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solutions:**

1. **Increase Node.js memory limit**:
   ```bash
   node --max-old-space-size=4096 script.js
   ```

2. **Process files in chunks**:
   ```typescript
   async function processLargeFile(filePath: string) {
     const stream = createReadStream(filePath, { encoding: 'utf8' });
     let buffer = '';
     
     for await (const chunk of stream) {
       buffer += chunk;
       // Process complete JSON objects
       const objects = buffer.split('\n');
       buffer = objects.pop() || ''; // Keep incomplete line
       
       for (const obj of objects) {
         if (obj.trim()) {
           await processJsonObject(obj);
         }
       }
     }
   }
   ```

### Network & API Issues

#### Issue: Connection timeout

**Symptoms:**
```bash
Error: connect ETIMEDOUT
```

**Solutions:**

1. **Increase timeout values**:
   ```typescript
   const response = await fetch(url, {
     signal: AbortSignal.timeout(30000), // 30 seconds
     // ... other options
   });
   ```

2. **Add retry logic**:
   ```typescript
   async function fetchWithRetry(url: string, options: any, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         return await fetch(url, options);
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
       }
     }
   }
   ```

3. **Check network connectivity**:
   ```bash
   ping api.portal.com
   curl -I https://api.portal.com/health
   ```

#### Issue: Rate limiting

**Symptoms:**
```bash
Error: 429 Too Many Requests
```

**Solutions:**

1. **Add request throttling**:
   ```typescript
   import pLimit from 'p-limit';
   
   const limit = pLimit(2); // Max 2 concurrent requests
   
   const results = await Promise.all(
     endpoints.map(endpoint => 
       limit(() => processEndpoint(endpoint))
     )
   );
   ```

2. **Implement exponential backoff**:
   ```typescript
   async function exponentialBackoff(fn: () => Promise<any>, maxRetries = 5) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (error.status !== 429 || i === maxRetries - 1) {
           throw error;
         }
         const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s, 8s, 16s
         await new Promise(resolve => setTimeout(resolve, delay));
       }
     }
   }
   ```

### Environment Issues

#### Issue: Different behavior between environments

**Symptoms:**
- Works locally but fails in CI/CD
- Different outputs on different machines

**Solutions:**

1. **Standardize Node.js version**:
   ```json
   // package.json
   {
     "engines": {
       "node": ">=18.0.0",
       "npm": ">=9.0.0"
     }
   }
   ```

2. **Use .nvmrc for version management**:
   ```bash
   echo "18.17.0" > .nvmrc
   nvm use
   ```

3. **Lock dependencies exactly**:
   ```bash
   npm ci  # Use lockfile exactly
   ```

#### Issue: Environment variables not loading

**Symptoms:**
```bash
API_TOKEN is undefined
```

**Solutions:**

1. **Check .env file location and format**:
   ```bash
   ls -la .env
   cat .env  # Should not have spaces around =
   ```

2. **Load environment variables explicitly**:
   ```typescript
   import 'dotenv/config';
   // or
   import dotenv from 'dotenv';
   dotenv.config();
   ```

3. **Validate required environment variables**:
   ```typescript
   const requiredEnvVars = ['API_TOKEN', 'API_BASE_URL'];
   
   for (const envVar of requiredEnvVars) {
     if (!process.env[envVar]) {
       throw new Error(`Missing required environment variable: ${envVar}`);
     }
   }
   ```

## 🔧 Debugging Tools

### Enable Debug Logging

```bash
# Enable all debug logs
DEBUG=portal-api-gen:* npm run generate:details

# Enable specific module logs
DEBUG=portal-api-gen:http npm run generate:details
```

### Check Generated Files

```bash
# Verify schema files were created
find schemas/ -name "*.ts" -newer $(date -d '1 hour ago' '+%Y%m%d%H%M')

# Check file contents
head -20 schemas/transaction-list/details.schema.ts
```

### Validate Generated Schemas

```typescript
// Test script to validate schemas
import { z } from 'zod';
import { TransactionListSchema } from '@schemas/transaction-list/details.schema';

const testData = { /* test data */ };
const result = TransactionListSchema.safeParse(testData);

if (!result.success) {
  console.error('Schema validation failed:', result.error.issues);
} else {
  console.log('Schema validation passed');
}
```

### Monitor Resource Usage

```bash
# Monitor memory usage
node --trace-gc script.js 2>&1 | grep "Mark-Sweep"

# Monitor file system usage
lsof +D ./schemas  # List open files in schemas directory

# Monitor network requests
netstat -an | grep :443  # Check HTTPS connections
```

## 📊 Performance Issues

### Issue: Slow generation times

**Symptoms:**
- Scripts take a long time to complete
- High CPU or memory usage

**Solutions:**

1. **Profile the code**:
   ```bash
   node --prof script.js
   node --prof-process isolate-*.log > profile.txt
   ```

2. **Optimize JSON processing**:
   ```typescript
   // Use streaming JSON parser for large responses
   import { parser } from 'stream-json';
   import StreamValues from 'stream-json/streamers/StreamValues';
   
   const stream = response.body
     .pipe(parser())
     .pipe(StreamValues.withParser());
   ```

3. **Parallel processing**:
   ```typescript
   // Process endpoints in parallel with concurrency limit
   import pLimit from 'p-limit';
   
   const limit = pLimit(3);
   await Promise.all(
     endpoints.map(endpoint =>
       limit(() => processEndpoint(endpoint))
     )
   );
   ```

### Issue: High memory usage

**Solutions:**

1. **Clear references**:
   ```typescript
   let largeObject = await processLargeData();
   await useData(largeObject);
   largeObject = null; // Clear reference
   ```

2. **Use streams for large files**:
   ```typescript
   import { createReadStream, createWriteStream } from 'fs';
   import { pipeline } from 'stream/promises';
   
   await pipeline(
     createReadStream('input.json'),
     new JSONProcessor(),
     createWriteStream('output.ts')
   );
   ```

## 🆘 Getting Help

### Log Analysis

When reporting issues, include relevant logs:

```bash
# Generate detailed logs
DEBUG=portal-api-gen:* npm run generate:details 2>&1 | tee debug.log

# Check error logs
tail -50 logs/generate.create.log
```

### System Information

Include system information when reporting issues:

```bash
# System info
node --version
npm --version
uname -a

# Project info
npm list --depth=0
git rev-parse HEAD
```

### Issue Templates

Use this template when reporting issues:

```markdown
## Issue Description
Brief description of the problem

## Environment
- OS: [macOS/Linux/Windows]
- Node.js version: [x.x.x]
- npm/pnpm version: [x.x.x]
- Project version: [git commit hash]

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Error Messages
```
[paste error messages here]
```

## Additional Context
Any other relevant information
```

### Community Resources

- **GitHub Issues**: [Report bugs and request features](https://github.com/elbasel42/portal-api-gen/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/elbasel42/portal-api-gen/discussions)
- **Documentation**: [Check other documentation files](./README.md)

### Quick Reference

| Problem | Quick Fix |
|---------|-----------|
| Bun not found | `curl -fsSL https://bun.sh/install \| bash` |
| Permission denied | `chmod 755 directory` |
| Module not found | Check `tsconfig.json` paths |
| API 401 error | Verify `.env` file and API token |
| JSON parse error | Check API response format |
| Memory error | Increase `--max-old-space-size` |
| Network timeout | Increase timeout values |
| Rate limiting | Add request throttling |

If none of these solutions work, please create an issue on GitHub with detailed information about your problem.