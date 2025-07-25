/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // Add your image domains here
  },
  // Add this to handle hydration issues
  compiler: {
    styledComponents: true,
  }
}

module.exports = nextConfig