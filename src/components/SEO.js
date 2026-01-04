import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Pixovia LLC - Free Digital Ecosystem | Apps, Games, Movies, Music & More", 
  description = "Pixovia LLC offers the world's largest free digital ecosystem. Download premium apps, games, themes & extensions. Stream unlimited movies, music, sports live. Access digital library, downloader tools & learning platform - all completely free.",
  keywords = "free apps, free games, free movies, free music streaming, digital library, video downloader, online learning, sports streaming, browser themes, extensions, premium software free, Pixovia LLC",
  url = "https://pixovia.pages.dev/",
  type = "website",
  image = "https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Pixovia LLC" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Pixovia LLC" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:site" content="@PixoviaLLC" />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#0f172a" />
      <meta name="application-name" content="Pixovia LLC" />
      <meta name="apple-mobile-web-app-title" content="Pixovia LLC" />
      <meta name="msapplication-TileColor" content="#0f172a" />
    </Helmet>
  );
};

export default SEO;