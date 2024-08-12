/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "scontent.fsgn2-3.fna.fbcdn.net",
      "www.kindpng.com",
      "res.cloudinary.com",
    ],
  },
  swcMinify: true,
};

export default nextConfig;
