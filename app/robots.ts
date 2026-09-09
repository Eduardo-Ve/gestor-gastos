import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://finanzas.devportftool.dpdns.org/"; // TODO: reemplazar

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/transactions", "/categories", "/budgets", "/settings", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}