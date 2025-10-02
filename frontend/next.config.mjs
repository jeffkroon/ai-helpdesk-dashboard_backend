/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8000',
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    
    // Ensure the backend URL is properly formatted
    let formattedBackendUrl = backendUrl
    if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
      // If it's just a service name, assume it's a Render service
      formattedBackendUrl = `https://${backendUrl}.onrender.com`
    }
    
    return [
      {
        source: '/api/:path*',
        destination: `${formattedBackendUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig