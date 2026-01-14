import { useEffect } from 'react';

export const useSEO = (config) => {
  useEffect(() => {
    const {
      title = 'Pixovia Store',
      description = 'Free gaming and tech platform by Pixovia - All apps and games are completely free',
      keywords = 'free app store, free gaming, free windows apps, free software download',
      image = 'https://pixovia.pages.dev/store/assets/og-image.png',
      url = 'https://pixovia.pages.dev/store/',
      type = 'website'
    } = config;

    // Update title
    document.title = title;

    // Update meta tags
    const updateMeta = (name, content, property = false) => {
      let element = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:url', url, true);
    updateMeta('og:type', type, true);
    updateMeta('twitter:title', title, true);
    updateMeta('twitter:description', description, true);
    updateMeta('twitter:image', image, true);

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [config]);
};