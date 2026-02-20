import { useEffect } from 'react';

interface SEOOptions {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  articlePublishedTime?: string;
  articleAuthor?: string;
  articleTags?: string[];
  canonical?: string;
  jsonLd?: Record<string, any>;
}

const setMetaTag = (property: string, content: string) => {
  let element = document.querySelector(`meta[property="${property}"]`) || 
                document.querySelector(`meta[name="${property}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    const isProperty = property.startsWith('og:') || property.startsWith('article:');
    if (isProperty) {
      element.setAttribute('property', property);
    } else {
      element.setAttribute('name', property);
    }
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

const removeMetaTag = (property: string) => {
  const element = document.querySelector(`meta[property="${property}"]`) || 
                  document.querySelector(`meta[name="${property}"]`);
  if (element) {
    element.remove();
  }
};

const setCanonicalTag = (url: string) => {
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
};

const removeCanonicalTag = () => {
  const element = document.querySelector('link[rel="canonical"]');
  if (element) {
    element.remove();
  }
};

const setJsonLd = (data: Record<string, any>) => {
  let element = document.querySelector('script[type="application/ld+json"]');
  if (!element) {
    element = document.createElement('script');
    element.setAttribute('type', 'application/ld+json');
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
};

const removeJsonLd = () => {
  const element = document.querySelector('script[type="application/ld+json"]');
  if (element) {
    element.remove();
  }
};

export const useSEO = (options: SEOOptions) => {
  useEffect(() => {
    if (options.title) {
      document.title = `${options.title} | Germaine Tutoring`;
    }

    if (options.description) {
      setMetaTag('description', options.description);
    }

    if (options.ogTitle) {
      setMetaTag('og:title', options.ogTitle);
    }

    if (options.ogDescription) {
      setMetaTag('og:description', options.ogDescription);
    }

    if (options.ogImage) {
      setMetaTag('og:image', options.ogImage);
    }

    if (options.ogUrl) {
      setMetaTag('og:url', options.ogUrl);
    }

    if (options.ogType) {
      setMetaTag('og:type', options.ogType);
    }

    if (options.twitterCard) {
      setMetaTag('twitter:card', options.twitterCard);
    }

    if (options.twitterSite) {
      setMetaTag('twitter:site', options.twitterSite);
    }

    if (options.twitterCreator) {
      setMetaTag('twitter:creator', options.twitterCreator);
    }

    if (options.articlePublishedTime) {
      setMetaTag('article:published_time', options.articlePublishedTime);
    }

    if (options.articleAuthor) {
      setMetaTag('article:author', options.articleAuthor);
    }

    if (options.articleTags && options.articleTags.length > 0) {
      const existingTags = document.querySelectorAll('meta[property="article:tag"]');
      existingTags.forEach(tag => tag.remove());
      
      options.articleTags.forEach(tag => {
        setMetaTag('article:tag', tag);
      });
    }

    if (options.canonical) {
      setCanonicalTag(options.canonical);
    }

    if (options.jsonLd) {
      setJsonLd(options.jsonLd);
    }

    return () => {
      if (options.title) {
        document.title = 'Germaine Tutoring';
      }

      if (options.description) {
        removeMetaTag('description');
      }

      if (options.ogTitle) {
        removeMetaTag('og:title');
      }

      if (options.ogDescription) {
        removeMetaTag('og:description');
      }

      if (options.ogImage) {
        removeMetaTag('og:image');
      }

      if (options.ogUrl) {
        removeMetaTag('og:url');
      }

      if (options.ogType) {
        removeMetaTag('og:type');
      }

      if (options.twitterCard) {
        removeMetaTag('twitter:card');
      }

      if (options.twitterSite) {
        removeMetaTag('twitter:site');
      }

      if (options.twitterCreator) {
        removeMetaTag('twitter:creator');
      }

      if (options.articlePublishedTime) {
        removeMetaTag('article:published_time');
      }

      if (options.articleAuthor) {
        removeMetaTag('article:author');
      }

      if (options.articleTags && options.articleTags.length > 0) {
        const existingTags = document.querySelectorAll('meta[property="article:tag"]');
        existingTags.forEach(tag => tag.remove());
      }

      if (options.canonical) {
        removeCanonicalTag();
      }

      if (options.jsonLd) {
        removeJsonLd();
      }
    };
  }, [options.title, options.description, options.ogTitle, options.ogDescription, 
      options.ogImage, options.ogUrl, options.ogType, options.twitterCard, options.twitterSite,
      options.twitterCreator, options.articlePublishedTime,
      options.articleAuthor, options.articleTags, options.canonical, JSON.stringify(options.jsonLd)]);
};
