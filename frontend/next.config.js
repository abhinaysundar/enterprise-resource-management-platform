/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* Target backend API port redirect proxy configuration for local development */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
