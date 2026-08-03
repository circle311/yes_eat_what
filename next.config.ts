import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: "/yes_eat_what",
        assetPrefix: "/yes_eat_what/",
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
