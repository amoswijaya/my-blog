import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "placehold.co",
      "ui-avatars.com",
      "s3.sellerpintar.com",
      "images.unsplash.com",
    ],
  },
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default nextConfig;
