// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds and Vercel deployments.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

import nextI18NextConfig from "./next-i18next.config.js";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /* If trying out the experimental appDir, comment the i18n config out
   * @see https://github.com/vercel/next.js/issues/41980 */
  i18n: nextI18NextConfig.i18n,
  webpack: function (config, options) {
    config.experiments = { asyncWebAssembly: true, layers: true };
    
    // Handle node modules for client-side
    if (!options.isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        process: false,
      };
    }
    
    return config;
  },
  // Remove standalone output for Vercel
  // output: "standalone",
  
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
  
  // Environment variables for client-side
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_API_BASE_URL: process.env.OPENAI_API_BASE_URL,
  },
};
export default config;
