import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Pixovia Movies — Stream Free Movies Online | Pixovia LLC",
  description = "Pixovia Movies by Pixovia LLC lets you stream thousands of movies in HD quality — completely free. Enjoy unlimited entertainment anytime, anywhere, with no subscriptions or ads.",
  keywords = "Pixovia Movies, Pixovia LLC, free movies, online movie streaming, HD movies, watch movies free, entertainment, Pixovia, Pixovia TV, Pixovia Stream, free cinema",
  url = "https://pixovia.pages.dev/movies",
  type = "video.movie",
  image = "https://pixovia.pages.dev/movies-cover.png",
}) => {
  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Pixovia LLC" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#000000" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Pixovia Movies" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@PixoviaLLC" />

      {/* PWA / App Meta */}
      <meta name="application-name" content="Pixovia Movies" />
      <meta name="apple-mobile-web-app-title" content="Pixovia Movies" />
      <meta name="msapplication-TileColor" content="#000000" />

      {/* Organization Schema */}
      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Pixovia LLC",
          "url": "https://pixovia.pages.dev",
          "logo": "https://pixovia.pages.dev/icon-coloured-closeup.png",
          "description": "Pixovia LLC is a free digital ecosystem offering apps, games, movies, music, tools, and learning resources — all in one place.",
          "sameAs": [
            "https://www.instagram.com/pixoviallc",
            "https://www.youtube.com/@pixoviallc",
            "https://x.com/pixoviallc",
            "https://www.facebook.com/pixoviallc"
          ]
        }
      `}</script>

      {/* Movie / Video Schema */}
      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": "Pixovia Movies — Stream Free Movies Online",
          "description": "${description}",
          "thumbnailUrl": ["${image}"],
          "uploadDate": "2026-01-01T00:00:00Z",
          "publisher": {
            "@type": "Organization",
            "name": "Pixovia LLC",
            "logo": {
              "@type": "ImageObject",
              "url": "https://pixovia.pages.dev/icon-coloured-closeup.png"
            }
          },
          "contentUrl": "${url}",
          "embedUrl": "${url}",
          "potentialAction": {
            "@type": "WatchAction",
            "target": "${url}"
          }
        }
      `}</script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://pixovia.pages.dev/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Movies",
              "item": "https://pixovia.pages.dev/movies"
            }
          ]
        }
      `}</script>
    </Helmet>
  );
};

export default SEO;
