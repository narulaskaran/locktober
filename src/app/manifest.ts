import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Loctober",
    short_name: "Loctober",
    description: "A private scoreboard for a month-long lock-in.",
    start_url: "/home",
    display: "standalone",
    background_color: "#efe8dc",
    theme_color: "#efe8dc",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
