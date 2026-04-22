/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'se-images.campuslabs.com' },
      { protocol: 'https', hostname: 'images.lumacdn.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'wwmt.com' },
      { protocol: 'https', hostname: 'www.trumba.com' },
      { protocol: 'https', hostname: 'img.evbuc.com' },
      { protocol: 'https', hostname: 'startgarden.com' },
    ],
  },
};

module.exports = nextConfig;
