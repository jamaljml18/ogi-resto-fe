import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';
import { resolveFrontendApiUrl } from './scripts/deployment-config.mjs';

/** @type {import('next').NextConfig} */
export default function nextConfig(phase) {
  const development = phase === PHASE_DEVELOPMENT_SERVER;
  const apiUrl = resolveFrontendApiUrl({ development, apiUrl: process.env.NEXT_PUBLIC_API_URL });
  return {
    ...(development ? {} : { output: 'export' }),
    trailingSlash: true,
    images: { unoptimized: true },
    allowedDevOrigins: ['*.trycloudflare.com'],
    env: { NEXT_PUBLIC_API_URL: apiUrl },
    ...(development ? {
      async rewrites() {
        return [{ source: '/api/:path*', destination: 'http://localhost:5000/api/:path*' }];
      }
    } : {})
  };
}
