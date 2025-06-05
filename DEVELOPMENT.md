# Development Setup Guide

This guide will help you set up and launch the AutoGPT-Next-Web application locally.

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/k0880k/autohugginggemini.git
   cd autohugginggemini
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your specific configuration:

   - Add your API keys (OpenAI, Hugging Face, Gemini)
   - Modify feature flags as needed
   - Update database URL if using a different database

4. **Launch the application**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Environment Configuration

### Required Variables

- `NEXTAUTH_SECRET`: A random secret key for NextAuth.js
- `NEXTAUTH_URL`: Your application URL (e.g., `http://localhost:3000`)

### Optional Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `HUGGINGFACE_API_KEY`: Your Hugging Face API token
- `GEMINI_API_KEY`: Your Google Gemini API key
- `DATABASE_URL`: Database connection string (defaults to SQLite)

### Feature Flags

- `NEXT_PUBLIC_FF_AUTH_ENABLED`: Enable/disable authentication
- `NEXT_PUBLIC_FF_SUB_ENABLED`: Enable/disable subscriptions
- `NEXT_PUBLIC_WEB_SEARCH_ENABLED`: Enable/disable web search
- `NEXT_PUBLIC_FF_MOCK_MODE_ENABLED`: Enable/disable mock mode

## Troubleshooting

### Dependency Issues

If you encounter dependency conflicts during installation, use:

```bash
npm install --legacy-peer-deps
```

### Port Configuration

To run on a different port:

```bash
npm run dev -- --port 8080
```

### Database Setup

The application uses SQLite by default for development. For production, configure a proper database URL in your environment variables.

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm test`: Run tests
