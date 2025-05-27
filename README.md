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

## Extended Model Support

Beyond the default Pawan API configuration, this version of AutoGPT-Next-Web now supports a wider range of models through the Hugging Face Inference API and Google Gemini models (via Vertex AI). This allows for greater flexibility in choosing the AI engine that powers your tasks.

### Configuring New Model Providers

To use Hugging Face or Gemini models:

1.  **Open the Settings Dialog**: Click on the settings icon in the application.
2.  **Select the Provider**: In the "Provider" dropdown, choose either "Hugging Face" or "Google Gemini".
3.  **Enter Model Name**:
    *   For **Hugging Face**, input the desired Hugging Face Model ID (e.g., "gpt2", "google/flan-t5-xxl", "meta-llama/Llama-2-7b-chat-hf") in the "Hugging Face Model" field.
    *   For **Google Gemini**, input the Gemini model name (e.g., "gemini-pro", "gemini-1.5-pro-latest") in the "Gemini Model" field.
4.  **API Key**:
    *   **Hugging Face**: Enter your Hugging Face API key (User Access Token) into the "API Key" field. You can generate an API key from your Hugging Face account settings (usually under "Access Tokens" in your profile settings: `https://huggingface.co/settings/tokens`).
    *   **Google Gemini (Vertex AI)**:
        *   **Recommended Authentication**: The primary authentication method is via Google Cloud Application Default Credentials (ADC). Ensure your environment is set up by running `gcloud auth application-default login` in your terminal if you are running locally, or that your deployment environment (e.g., Vercel) has the necessary Google Cloud service account credentials configured. If using ADC, the "API Key" field in the UI can be left blank.
        *   **Vertex AI API Key**: If you have a specific Vertex AI API key and are not using ADC, you can enter it into the "API Key" field.
5.  **Custom Endpoint (Optional)**:
    *   **Hugging Face**: If you are using a self-hosted Hugging Face Inference Endpoint or a compatible service, you can specify its URL in the "Endpoint" field under "Advanced Settings". If left blank, it defaults to the standard Hugging Face Inference API.
    *   **Google Gemini (Vertex AI)**: This field is typically not needed as the Vertex AI SDK handles the endpoint.
6.  **Save Settings**: Click "Save" to apply your configuration.

The application will then use the selected provider and model for its operations. Remember that performance and capabilities will vary significantly based on the chosen model.

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
