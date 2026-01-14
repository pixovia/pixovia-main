import { useEffect } from "react";

/**
 * Modernized SEO hook for Pixovia Store
 * Keeps meta tags in sync for the /store section
 * Aligned with the global SEO.js system
 */
export const useSEO = (config = {}) => {
  useEffect(() => {
    const {
      title = "Pixovia Store - Free Apps, Games & Extensions",
      description = "Download free apps, games, browser themes, and extensions. Premium software completely free of cost on Pixovia Store.",
      keywords = "free apps, games, browser themes, extensions, premium software, download",
      image = "https://pixovia.pages.dev/icon-coloured-closeup.png",
      url = "https://pixovia.pages.dev/store/",
      type = "website",
    } = config;

    // --- Helper to create or update a <meta> tag ---
    const updateMeta = (attr, key, value) => {
      if (!value) return;
      let element = document.querySelector(`${attr}[${key}="${value}"]`);
      if (!element) {
        element = document.createElement(attr);
        element.setAttribute(key, value);
        document.head.appendChild(element);
      }
      return element;
    };

    // Update <title>
    document.title = title;

    // --- Standard Meta Tags ---
    const setMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("author", "Pixovia LLC");
    setMeta("robots", "index, follow");
    setMeta("theme-color", "#0f172a");

    // --- Open Graph ---
    const setOG = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    setOG("og:type", type);
    setOG("og:url", url);
    setOG("og:title", title);
    setOG("og:description", description);
    setOG("og:image", image);
    setOG("og:site_name", "Pixovia Store");
    setOG("og:locale", "en_US");

    // --- Twitter ---
    setOG("twitter:card", "summary_large_image");
    setOG("twitter:url", url);
    setOG("twitter:title", title);
    setOG("twitter:description", description);
    setOG("twitter:image", image);
    setOG("twitter:site", "@PixoviaLLC");

    // --- Canonical Link ---
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // --- JSON-LD Structured Data ---
    let jsonLd = document.querySelector('script[type="application/ld+json"]#store-schema');
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.type = "application/ld+json";
      jsonLd.id = "store-schema";
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "url": url,
      "description": description,
      "publisher": {
        "@type": "Organization",
        "name": "Pixovia LLC",
        "url": "https://pixovia.pages.dev",
        "logo": "https://pixovia.pages.dev/icon-coloured-closeup.png",
        "sameAs": [
          "https://www.instagram.com/pixoviallc",
          "https://www.youtube.com/@pixoviallc",
          "https://x.com/pixoviallc",
          "https://www.facebook.com/pixoviallc"
        ]
      },
      "image": image,
    });
  }, [config]);
};
