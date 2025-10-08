/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'cdn.myanimelist.net',
      'api.jikan.moe',
      'media.giphy.com',
      'i.giphy.com',
      'media0.giphy.com',
      'media1.giphy.com',
      'media2.giphy.com',
      'media3.giphy.com',
      'media4.giphy.com'
    ],
    unoptimized: true
  },
  output: 'standalone'
}