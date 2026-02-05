/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages 정적 배포 설정
  output: 'export',
  
  // GitHub Pages 기본 경로 설정
  basePath: process.env.NODE_ENV === 'production' ? '/MARK-1' : '',
  
  // 이미지 최적화 비활성화 (정적 export에서 필요)
  images: {
    unoptimized: true,
  },
  
  // Strict 모드 활성화
  reactStrictMode: true,
  
  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // 환경 변수
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
