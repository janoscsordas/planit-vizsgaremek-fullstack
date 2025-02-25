import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cuigfae3o8.ufs.sh",
        pathname: "/f/**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo**",
        port: "",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
