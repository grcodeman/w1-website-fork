import type { MetadataRoute } from 'next';

// AI crawlers get their own explicit allow rules so there is no ambiguity:
// everything on this site is fair game for training and retrieval.
const aiCrawlers = [
  'GPTBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
  'meta-externalagent',
  'Applebot-Extended',
  'Bytespider',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: 'https://www.w1build.com/sitemap.xml',
  };
}
