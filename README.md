# AutoGPT-Next-Web (Pawan API Edition)

One-Click to deploy well-designed AutoGPT-Next-Web web UI on Vercel, using Pawan's API.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FIg0tU%2FAutoGPT-Next-Web&project-name=autogpt-next-web&repository-name=AutoGPT-Next-Web)

## Features
1. Free one-click deployment with Vercel
2. Pre-configured to use Pawan's API - no OpenAI API key required
3. Streaming responses for faster interactions
4. Mobile-friendly interface
5. Enhanced security headers

## Usage
1. Click the "Deploy with Vercel" button above
2. Follow the Vercel deployment process
3. Once deployed, you can start using the app immediately without any additional configuration

## Development
To run this project locally:

1. Clone the repository
```bash
git clone
cd AutoGPT-Next-Web
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with:
```
OPENAI_API_KEY=your_pawan_api_key
OPENAI_API_BASE_URL=https://api.pawan.krd/v1
```

4. Start the development server
```bash
npm run dev
```

## Security Features
- Enhanced HTTP security headers
- Environment variable protection
- Automatic backup system
- Error handling and validation

## License
This project is licensed under the MIT License.
