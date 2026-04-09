import 'dotenv/config'
import { defineConfig } from 'orval'
import { env } from './src/lib/env'

export default defineConfig({
  api: {
    input: `${env.API_URL}/docs/json`,
    output: {
      target: './src/http/api.ts',
      client: 'fetch',
      httpClient: 'fetch',
      clean: true,
      override: {
        mutator: {
          path: './src/lib/fetch-client.ts',
          name: 'customFetch',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
})
