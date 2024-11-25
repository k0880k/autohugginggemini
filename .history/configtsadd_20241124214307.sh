#!/bin/bash

# Add error handling and exit on failure
set -e

# Create directories if they don't exist
mkdir -p src/utils

# Create config.ts file
cat << 'EOF' > src/utils/config.ts
// API Configuration
const BASE_URL = process.env.OPENAI_API_BASE_URL || "https://api.pawan.krd/v1"
const DEFAULT_MODEL = "gpt-3.5-turbo"
const TEMPERATURE = 0.7

export const config = {
  baseUrl: BASE_URL,
  defaultModel: DEFAULT_MODEL,
  temperature: TEMPERATURE,
  apiKey: process.env.OPENAI_API_KEY,
}

export default config
EOF

echo "Successfully created config.ts! 🎉"
