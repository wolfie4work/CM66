/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // basePath is required for GitHub Pages since it will be hosted at https://wolfie4work.github.io/CM66
  basePath: "/CM66",
  // Optional: Change trailing slash behavior
  trailingSlash: true,
};

export default nextConfig;
