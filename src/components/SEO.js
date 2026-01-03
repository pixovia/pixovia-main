import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Pixovia LLC - Digital Solutions", 
  description = "Leading digital solutions provider. Access our Store for free apps, games, themes, and extensions, plus our Library service.",
  keywords = "Pixovia LLC, digital solutions, free apps, games, themes, extensions, library",
  url = "https://pixovia.pages.dev/",
  type = "website"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;