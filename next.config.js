/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'se-images.campuslabs.com' },
      { protocol: 'https', hostname: 'images.lumacdn.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'wwmt.com' },
    ],
  },
};

module.exports = nextConfig;
