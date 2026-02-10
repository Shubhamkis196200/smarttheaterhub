import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  path?: string
  jsonLd?: Record<string, unknown>
  type?: string
  toolName?: string
  toolCategory?: string
}

export default function SEO({ title, description, path, jsonLd, type, toolName, toolCategory }: SEOProps) {
  const fullTitle = title === 'SmartTheaterHub' ? title + ' — Free Home Theater Tools & Guides' : title + ' | SmartTheaterHub'
  const url = path ? `https://smarttheaterhub.com${path}` : undefined

  let ld = jsonLd
  if (!ld) {
    if (path === '/') {
      ld = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'SmartTheaterHub',
        url: 'https://smarttheaterhub.com',
        description: 'Expert home theater reviews, buying guides, and 50+ free tools.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://smarttheaterhub.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    } else if (type === 'tool' && toolName) {
      ld = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: toolName,
        description,
        url,
        applicationCategory: toolCategory || 'UtilityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@type': 'Organization', name: 'SmartTheaterHub', url: 'https://smarttheaterhub.com' }
      }
    } else if (path?.startsWith('/reviews/') || path?.startsWith('/blog/')) {
      ld = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        url,
        publisher: { '@type': 'Organization', name: 'SmartTheaterHub', url: 'https://smarttheaterhub.com' }
      }
    }
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="SmartTheaterHub" />
      {url && <meta property="og:url" content={url} />}
      {url && <link rel="canonical" href={url} />}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ld && (
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      )}
    </Helmet>
  )
}
