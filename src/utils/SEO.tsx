import { Helmet } from 'react-helmet-async';

interface MainSEOData {
  title: string;
  description?: string;
  image?: string;
  author?: string;
  publishedAt?: string;
  type?: 'article' | 'website' | 'product';
}

interface SEOProps {
  mainData: MainSEOData;
  canonicalUrl?: string;
  twitterCreator?: string;
  iaMarkupUrl?: string;
  iaMarkupUrlDev?: string;
  iaRulesUrl?: string;
  iaRulesUrlDev?: string;
}

const makeAbsoluteUrl = (url: string) =>
  url?.startsWith('http') ? url : `https://www.kickside.rw${url}`;

const SEO = ({
  mainData,
  canonicalUrl = typeof window !== 'undefined' ? window.location.href : '',
  twitterCreator = '@kickside_rw',
  iaMarkupUrl = canonicalUrl,
  iaMarkupUrlDev,
  iaRulesUrl = 'https://www.kickside.rw/ia-rules.json',
  iaRulesUrlDev,
}: SEOProps) => {
  const {
    title,
    description = 'Kickside is Rwanda’s leading digital newspaper covering tech, sports, entertainment, and business. Get all trending news from Rwanda and East Africa in one place.',
    image = '/images/logo.png',
    author = 'Kickside News',
    publishedAt = '2023-12-01T10:00:00Z',
    type = 'article',
  } = mainData;

  const currentImage = makeAbsoluteUrl(image);
  const currentUrl = makeAbsoluteUrl(canonicalUrl);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'NewsArticle' : 'WebPage',
    headline: title,
    description,
    image: [currentImage],
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kickside Rwanda',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.kickside.rw/logo.png',
      },
    },
    mainEntityOfPage: currentUrl,
    datePublished: publishedAt,
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <meta
        name="keywords"
        content="Kickside, Rwanda News, Tech, Sports, Entertainment, Kigali"
      />

      <link rel="canonical" href={currentUrl} />

      <meta property="og:locale" content="en_RW" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={currentImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Kickside Rwanda" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={currentImage} />
      <meta name="twitter:creator" content={twitterCreator} />

      {iaMarkupUrl && <meta property="ia:markup_url" content={iaMarkupUrl} />}
      {iaMarkupUrlDev && (
        <meta property="ia:markup_url_dev" content={iaMarkupUrlDev} />
      )}
      {iaRulesUrl && <meta property="ia:rules_url" content={iaRulesUrl} />}
      {iaRulesUrlDev && (
        <meta property="ia:rules_url_dev" content={iaRulesUrlDev} />
      )}

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
