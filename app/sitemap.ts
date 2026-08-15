import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.w1build.com';

// /info and /join are redirects to /, so they stay out of the sitemap.
const routes: { path: string; changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number }[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/build', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/ecosystem', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/learn', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/portfolio', changeFrequency: 'monthly', priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
