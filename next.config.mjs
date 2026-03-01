/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.imxh777.com'
      },
      {
        protocol: 'https',
        hostname: '**.oss-cn-beijing.aliyuncs.com'
      },
      {
        protocol: 'https',
        hostname: 'oss-cn-shanghai.aliyuncs.com'
      }
    ]
  }
};

export default nextConfig;
