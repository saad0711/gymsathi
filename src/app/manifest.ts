import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GymSathi",
    short_name: "GymSathi",
    description: "Your pocket gym coach, in Bangla and English.",
    start_url: "/app",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
