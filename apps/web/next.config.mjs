/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/qr-attendance',
  trailingSlash: true,
  reactStrictMode: true,
  experimental: { optimizePackageImports: ['lucide-react', 'framer-motion'] },
};
export default nextConfig;
